import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { lead_ids } = await req.json();
    if (!lead_ids || !Array.isArray(lead_ids) || lead_ids.length === 0) {
      return new Response(JSON.stringify({ error: "lead_ids required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to read/update leads
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: leads, error: fetchError } = await supabaseAdmin
      .from("leads")
      .select("*")
      .in("id", lead_ids);

    if (fetchError) throw fetchError;
    if (!leads || leads.length === 0) {
      return new Response(JSON.stringify({ error: "No leads found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const dorLabels: Record<string, string> = {
      desistencias: "Desistências de última hora",
      gestao_caotica: "Gestão caótica via WhatsApp",
      conversao_vendas: "Dificuldade em converter jogadores em compradores",
      organizacao_caotica: "Organização caótica",
      dificuldade_vendas: "Vendas de expansões",
    };

    const results = [];

    for (const lead of leads) {
      const instagramInfo = lead.instagram ? `Instagram: @${lead.instagram.replace(/^@/, "")}` : "Instagram: não informado";
      const prompt = `Analise este lead capturado em uma feira de jogos de tabuleiro (ABRIN 2026). 
A empresa é "${lead.cidade}" (nome da loja/espaço), contato "${lead.nome}".
${instagramInfo}.
Volume de mesas/eventos por mês: ${lead.mesas_por_mes || "não informado"}.
Maior dor/gargalo: ${dorLabels[lead.maior_dor] || lead.maior_dor || "não informado"}.
Perfil: ${lead.perfil}.

Classifique de 1 a 100 a qualidade deste lead para venda de uma plataforma SaaS de gestão e monetização de mesas de jogos de tabuleiro.
Critérios: volume alto = melhor, dor alinhada com o produto = melhor.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `Você é um especialista em qualificação de leads B2B para SaaS. Responda APENAS com um JSON no formato: {"score": <número 1-100>, "qualificacao": "<texto curto de 1 linha explicando>"}. Nada mais.`,
            },
            { role: "user", content: prompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "qualify_lead",
                description: "Qualifica um lead com score e texto.",
                parameters: {
                  type: "object",
                  properties: {
                    score: { type: "integer", minimum: 1, maximum: 100 },
                    qualificacao: { type: "string" },
                  },
                  required: ["score", "qualificacao"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "qualify_lead" } },
        }),
      });

      if (!aiResponse.ok) {
        if (aiResponse.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Tente novamente em instantes." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiResponse.status === 402) {
          return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.error("AI error:", aiResponse.status, await aiResponse.text());
        continue;
      }

      const aiData = await aiResponse.json();
      let score = 50;
      let qualificacao = "Análise indisponível";

      try {
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall) {
          const args = JSON.parse(toolCall.function.arguments);
          score = args.score;
          qualificacao = args.qualificacao;
        }
      } catch {
        console.error("Failed to parse AI response for lead", lead.id);
      }

      // Update lead
      await supabaseAdmin
        .from("leads")
        .update({ score_ia: score, qualificacao_ia: qualificacao })
        .eq("id", lead.id);

      results.push({ id: lead.id, score, qualificacao });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("qualify-leads error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, password, secret } = await req.json();

    // Simple shared secret to prevent unauthorized calls
    const SETUP_SECRET = Deno.env.get("SETUP_SECRET");
    if (!SETUP_SECRET || secret !== SETUP_SECRET) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      // If user already exists, get their ID
      if (createError.message.includes("already been registered")) {
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users?.users?.find((u: any) => u.email === email);
        if (existingUser) {
          // Assign admin role
          await supabaseAdmin.from("user_roles").upsert({
            user_id: existingUser.id,
            role: "admin",
          }, { onConflict: "user_id,role" });
          return new Response(JSON.stringify({ success: true, message: "Admin role assigned to existing user" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      throw createError;
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
      user_id: userData.user.id,
      role: "admin",
    });

    if (roleError) throw roleError;

    return new Response(JSON.stringify({ success: true, message: "Admin user created" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-admin error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

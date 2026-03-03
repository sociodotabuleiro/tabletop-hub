export type Lead = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  cidade: string;
  perfil: string;
  instagram?: string | null;
  jogos_favoritos: string | null;
  mesas_por_mes: string | null;
  ja_cobra_por_mesa: boolean;
  como_organiza: string | null;
  maior_dor: string | null;
  interesse_beta: boolean;
  notas_internas: string | null;
  status: string;
  origem: string;
  created_at: string;
  score_ia: number | null;
  qualificacao_ia: string | null;
};

export type LeadStatus = "novo" | "quente" | "morno" | "frio" | "convertido";

export const statusConfig: Record<string, { label: string; color: string; kanbanLabel: string }> = {
  novo: { label: "Novo", color: "bg-crm-blue/20 text-crm-blue border-crm-blue/30", kanbanLabel: "Novos" },
  quente: { label: "Qualificado", color: "bg-crm-green/20 text-crm-green border-crm-green/30", kanbanLabel: "Qualificados (Hot)" },
  morno: { label: "Em Análise", color: "bg-crm-yellow/20 text-crm-yellow border-crm-yellow/30", kanbanLabel: "Em Análise pela IA" },
  frio: { label: "Desqualificado", color: "bg-crm-red/20 text-crm-red border-crm-red/30", kanbanLabel: "Desqualificados" },
  convertido: { label: "Convertido", color: "bg-crm-purple/20 text-crm-purple border-crm-purple/30", kanbanLabel: "Convertidos" },
};

export const volumeConfig: Record<string, { label: string; color: string }> = {
  "1-5": { label: "1–5", color: "bg-muted text-muted-foreground" },
  "6-15": { label: "6–15", color: "bg-crm-blue/15 text-crm-blue" },
  "16-30": { label: "16–30", color: "bg-crm-orange/20 text-crm-orange" },
  "30+": { label: "30+", color: "bg-crm-green/20 text-crm-green font-bold" },
};

export const dorLabels: Record<string, string> = {
  desistencias: "Desistências de última hora",
  gestao_caotica: "Gestão caótica via WhatsApp",
  conversao_vendas: "Dificuldade em converter jogadores",
  organizacao_caotica: "Organização caótica",
  dificuldade_vendas: "Vendas de expansões",
};

export function getScoreColor(score: number | null): string {
  if (score === null) return "";
  if (score > 70) return "text-crm-green font-bold";
  if (score >= 40) return "text-crm-yellow";
  return "text-crm-red";
}

export function getScoreBg(score: number | null): string {
  if (score === null) return "";
  if (score > 70) return "bg-crm-green/15 border-crm-green/30";
  if (score >= 40) return "bg-crm-yellow/15 border-crm-yellow/30";
  return "bg-crm-red/15 border-crm-red/30";
}

export function getScoreLabel(score: number | null): string {
  if (score === null) return "Não qualificado";
  if (score > 70) return "Hot Lead";
  if (score >= 40) return "Warm Lead";
  return "Cold Lead";
}

export function getLeadClassification(lead: Lead): string {
  if (lead.perfil === "lojista") return "Lojista Bundle";
  if (!lead.mesas_por_mes) return "Host Starter";
  const vol = parseInt(lead.mesas_por_mes);
  if (vol >= 16 || lead.mesas_por_mes === "16-30" || lead.mesas_por_mes === "30+") return "Host Pro";
  return "Host Starter";
}

export const mockLeads: Lead[] = [
  {
    id: "mock-1", nome: "Rafael Mendes", email: "rafael@tavernadodragao.com.br", whatsapp: "(11) 99876-5432",
    cidade: "Taverna do Dragão", perfil: "lojista", instagram: "@tavernadodragao", jogos_favoritos: "Catan, Ticket to Ride",
    mesas_por_mes: "30+", ja_cobra_por_mesa: true, como_organiza: "WhatsApp + planilha", maior_dor: "gestao_caotica",
    interesse_beta: true, notas_internas: null, status: "quente", origem: "abrin_2026",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), score_ia: 92, qualificacao_ia: "Lojista com alto volume e dor alinhada ao produto. Excelente fit."
  },
  {
    id: "mock-2", nome: "Camila Roth", email: "camila@mesadogoblin.com", whatsapp: "(21) 98765-1234",
    cidade: "Mesa do Goblin", perfil: "host_mestre", instagram: "@camilarpg", jogos_favoritos: "D&D, Vampiro",
    mesas_por_mes: "16-30", ja_cobra_por_mesa: true, como_organiza: "Agenda Google", maior_dor: "desistencias",
    interesse_beta: true, notas_internas: "Muito interessada na funcionalidade de waitlist", status: "quente", origem: "abrin_2026",
    created_at: new Date(Date.now() - 86400000).toISOString(), score_ia: 85, qualificacao_ia: "Host Pro com volume expressivo. Desistências indicam necessidade da plataforma."
  },
  {
    id: "mock-3", nome: "Lucas Ferreira", email: "lucas@boardgamecafe.com", whatsapp: "(31) 97654-3210",
    cidade: "Board Game Café BH", perfil: "lojista", instagram: "@boardgamecafebh", jogos_favoritos: "Azul, Wingspan",
    mesas_por_mes: "6-15", ja_cobra_por_mesa: false, como_organiza: "WhatsApp", maior_dor: "conversao_vendas",
    interesse_beta: true, notas_internas: null, status: "morno", origem: "abrin_2026",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), score_ia: 58, qualificacao_ia: "Lojista com volume médio. Potencial de crescimento com melhor conversão."
  },
  {
    id: "mock-4", nome: "Ana Clara Souza", email: "ana@gmail.com", whatsapp: "(41) 96543-2109",
    cidade: "RPG na Garagem", perfil: "host_mestre", instagram: null, jogos_favoritos: "D&D",
    mesas_por_mes: "1-5", ja_cobra_por_mesa: false, como_organiza: "Nada formal", maior_dor: "organizacao_caotica",
    interesse_beta: false, notas_internas: null, status: "frio", origem: "abrin_2026",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), score_ia: 25, qualificacao_ia: "Host casual com baixo volume. Não cobra por mesa. Baixo fit atual."
  },
  {
    id: "mock-5", nome: "Pedro Augusto Lima", email: "pedro@dadosecafé.com.br", whatsapp: "(51) 95432-1098",
    cidade: "Dados & Café", perfil: "lojista", instagram: "@dadosecafe", jogos_favoritos: "Gloomhaven, Pandemic",
    mesas_por_mes: "16-30", ja_cobra_por_mesa: true, como_organiza: "Planilha Google", maior_dor: "gestao_caotica",
    interesse_beta: true, notas_internas: "Já tem 3 funcionários dedicados a eventos", status: "novo", origem: "abrin_2026",
    created_at: new Date().toISOString(), score_ia: null, qualificacao_ia: null
  },
  {
    id: "mock-6", nome: "Juliana Nascimento", email: "juliana@rpgclub.com", whatsapp: "(61) 94321-0987",
    cidade: "RPG Club Brasília", perfil: "host_mestre", instagram: "@juliana_rpg", jogos_favoritos: "Call of Cthulhu, Tormenta",
    mesas_por_mes: "6-15", ja_cobra_por_mesa: true, como_organiza: "Instagram DMs", maior_dor: "desistencias",
    interesse_beta: true, notas_internas: null, status: "novo", origem: "abrin_2026",
    created_at: new Date(Date.now() - 3600000).toISOString(), score_ia: null, qualificacao_ia: null
  },
  {
    id: "mock-7", nome: "Thiago Martins", email: "thiago@jogonautas.com", whatsapp: "(71) 93210-9876",
    cidade: "Jogonautas", perfil: "lojista", instagram: "@jogonautas", jogos_favoritos: "Terraforming Mars",
    mesas_por_mes: "30+", ja_cobra_por_mesa: true, como_organiza: "Sistema próprio precário", maior_dor: "gestao_caotica",
    interesse_beta: true, notas_internas: null, status: "convertido", origem: "abrin_2026",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(), score_ia: 95, qualificacao_ia: "Perfil ideal. Alto volume, já cobra, gestão precária. Conversão imediata."
  },
];

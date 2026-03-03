
-- Enum para perfil do lead
CREATE TYPE public.lead_profile AS ENUM ('jogador', 'host_mestre', 'lojista', 'editora', 'outro');

-- Enum para status do lead
CREATE TYPE public.lead_status AS ENUM ('novo', 'quente', 'morno', 'frio', 'convertido');

-- Tabela de leads
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  cidade TEXT NOT NULL,
  perfil lead_profile NOT NULL,
  jogos_favoritos TEXT,
  mesas_por_mes TEXT,
  ja_cobra_por_mesa BOOLEAN DEFAULT false,
  como_organiza TEXT,
  maior_dor TEXT,
  interesse_beta BOOLEAN DEFAULT true,
  notas_internas TEXT,
  status lead_status NOT NULL DEFAULT 'novo',
  origem TEXT DEFAULT 'abrinc_2026',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Política pública para INSERT (qualquer pessoa pode se cadastrar)
CREATE POLICY "Anyone can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Política de SELECT apenas para usuários autenticados (CRM interno)
CREATE POLICY "Authenticated users can view leads" ON public.leads
  FOR SELECT TO authenticated USING (true);

-- Política de UPDATE apenas para usuários autenticados
CREATE POLICY "Authenticated users can update leads" ON public.leads
  FOR UPDATE TO authenticated USING (true);

-- Trigger de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: Create AI Context Engine Tables

-- 1. Tabela de Personas
CREATE TABLE IF NOT EXISTS ai_personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  base_prompt TEXT NOT NULL,
  preferred_tone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Blocos de Conhecimento (Brand Voice, Rules, etc)
CREATE TABLE IF NOT EXISTS ai_knowledge_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_personas_updated_at
    BEFORE UPDATE ON ai_personas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_knowledge_blocks_updated_at
    BEFORE UPDATE ON ai_knowledge_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Seed Inicial (Dados padrão)
INSERT INTO ai_personas (slug, name, role, description, base_prompt, preferred_tone) 
VALUES
(
  'eda-pro', 
  'EDA Pro', 
  'Senior Software Architect', 
  'Especialista focado em qualidade técnica, SEO e autoridade.', 
  'Você é um Arquiteto de Software Sênior e editor do blog EDA Show.\nSua missão é criar conteúdo técnico de altíssima qualidade que eduque e engaje desenvolvedores experientes.\nVocê valoriza código limpo, arquitetura sólida (especialmente Event-Driven) e práticas de DevOps modernas.', 
  'professional'
),
(
  'eda-raiz', 
  'EDA Raiz', 
  'Developer Advocate', 
  'Focado em engajamento, opiniões fortes e conexão com a comunidade.', 
  'Você é o "EDA Raiz", uma voz influente e sem filtros no mundo do desenvolvimento.\nVocê fala a verdade que ninguém quer dizer sobre tecnologias "hypadas".\nSeu estilo é direto, usa analogias do dia-a-dia de um dev e foca na realidade das trincheiras do desenvolvimento.', 
  'provocative'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ai_knowledge_blocks (slug, name, content, tags)
VALUES
(
  'brand-voice',
  'Voz da Marca EDA',
  '# Diretrizes de Voz e Tom - EDA Show\n\n## Quem somos\nO EDA Show é a autoridade máxima em Event-Driven Architecture.\n\n## Nossa Voz\n1. **Autoridade Técnica:** Sabemos do que estamos falando.\n2. **Pragmática:** Focamos em soluções do mundo real.\n3. **Direta:** Sem rodeios.\n4. **Levemente Provocativa:** Desafiamos o status quo.\n\n## O que NÃO fazer\n- Evite linguagem corporativa vazia.\n- Não seja condescendente.',
  ARRAY['voice', 'tone']
),
(
  'seo-rules',
  'Regras de SEO',
  '# Regras de Formatação e SEO\n\n1. **Estrutura:** Use H2 e H3.\n2. **Links Internos:** Sugira links sempre que possível.\n3. **Listas:** Use bullet points.\n4. **Keywords:** No primeiro parágrafo e H2.',
  ARRAY['seo', 'formatting']
)
ON CONFLICT (slug) DO NOTHING;

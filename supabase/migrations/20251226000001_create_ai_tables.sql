-- ============================================
-- AI System Tables for EDA Show CMS
-- Migration: 20251226000001_create_ai_tables.sql
-- ============================================

-- AI Settings (global configurations)
CREATE TABLE IF NOT EXISTS ai_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Prompts (reusable prompt templates)
CREATE TABLE IF NOT EXISTS ai_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('post', 'rewrite', 'newsletter', 'seo', 'keywords', 'categorize')),
    prompt_template TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Generations (history of AI-generated content)
CREATE TABLE IF NOT EXISTS ai_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('post', 'rewrite', 'newsletter', 'keywords', 'seo', 'image')),
    input_data JSONB,
    output_data JSONB,
    model_used TEXT,
    tokens_used INTEGER DEFAULT 0,
    cost_usd DECIMAL(10, 6) DEFAULT 0,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Posts (for auto-publishing)
CREATE TABLE IF NOT EXISTS scheduled_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    scheduled_for TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed', 'cancelled')),
    published_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletters
CREATE TABLE IF NOT EXISTS newsletters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT,
    content TEXT,
    html_content TEXT,
    post_ids UUID[] DEFAULT '{}',
    tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'casual', 'formal', 'friendly')),
    style TEXT DEFAULT 'summary' CHECK (style IN ('summary', 'detailed', 'listicle', 'highlights')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    recipients_count INTEGER DEFAULT 0,
    opens_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Schedules (recurring newsletters)
CREATE TABLE IF NOT EXISTS newsletter_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 28),
    time_of_day TIME DEFAULT '09:00:00',
    tone TEXT DEFAULT 'professional',
    style TEXT DEFAULT 'summary',
    category_filter UUID[], -- Filter posts by categories
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Sources (for rewriting from external sources)
CREATE TABLE IF NOT EXISTS content_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    source_type TEXT DEFAULT 'article' CHECK (source_type IN ('article', 'rss', 'api')),
    guidelines TEXT, -- Custom guidelines for rewriting content from this source
    is_active BOOLEAN DEFAULT true,
    last_fetched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_settings_key ON ai_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_ai_prompts_category ON ai_prompts(category);
CREATE INDEX IF NOT EXISTS idx_ai_generations_type ON ai_generations(type);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created ON ai_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled ON scheduled_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_scheduled ON newsletters(scheduled_for);

-- Enable Row Level Security
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now - authenticated users)
CREATE POLICY "Allow all for authenticated" ON ai_settings FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON ai_prompts FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON ai_generations FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON scheduled_posts FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON newsletters FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON newsletter_schedules FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON content_sources FOR ALL USING (true);

-- Insert default AI settings
INSERT INTO ai_settings (setting_key, setting_value, description) VALUES
    ('default_model', '"anthropic/claude-3-haiku"', 'Default LLM model for content generation'),
    ('temperature', '0.7', 'Default temperature for AI responses'),
    ('max_tokens', '4000', 'Maximum tokens for generated content'),
    ('system_prompt', '"Você é um redator especialista em saúde e odontologia para o portal EDA Show. Escreva conteúdo informativo, preciso e envolvente em português brasileiro. Mantenha um tom profissional mas acessível."', 'System prompt for AI'),
    ('seo_guidelines', '"Inclua palavras-chave naturalmente no texto. Use subtítulos H2 e H3. Mantenha parágrafos curtos. Inclua listas quando apropriado."', 'SEO writing guidelines')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default AI prompts
INSERT INTO ai_prompts (name, category, prompt_template, variables) VALUES
    (
        'Gerar Post Completo',
        'post',
        'Escreva um artigo completo sobre o seguinte tópico: {{topic}}

Palavras-chave para SEO: {{keywords}}

Diretrizes:
- Escreva em português brasileiro
- Use um tom {{tone}}
- O artigo deve ter aproximadamente {{word_count}} palavras
- Inclua uma introdução cativante
- Divida o conteúdo em seções com subtítulos H2
- Termine com uma conclusão

{{additional_instructions}}',
        '["topic", "keywords", "tone", "word_count", "additional_instructions"]'
    ),
    (
        'Gerar Título SEO',
        'seo',
        'Gere 5 opções de títulos otimizados para SEO para um artigo sobre: {{topic}}

Palavras-chave principais: {{keywords}}

Requisitos:
- Máximo de 60 caracteres
- Inclua a palavra-chave principal
- Seja atrativo e claro
- Evite clickbait

Retorne apenas os títulos, um por linha.',
        '["topic", "keywords"]'
    ),
    (
        'Sugerir Palavras-chave',
        'keywords',
        'Analise o seguinte tópico e sugira palavras-chave relevantes para SEO:

Tópico: {{topic}}
Contexto: {{context}}

Retorne as palavras-chave em formato JSON:
{
  "primary": ["palavra principal"],
  "secondary": ["palavras secundárias"],
  "long_tail": ["palavras-chave de cauda longa"]
}',
        '["topic", "context"]'
    ),
    (
        'Categorizar Conteúdo',
        'categorize',
        'Analise o seguinte conteúdo e sugira a categoria e tags mais apropriadas:

Título: {{title}}
Conteúdo: {{content}}

Categorias disponíveis: {{categories}}

Retorne em formato JSON:
{
  "category": "categoria sugerida",
  "tags": ["tag1", "tag2", "tag3"],
  "reasoning": "breve explicação"
}',
        '["title", "content", "categories"]'
    ),
    (
        'Reescrever Conteúdo',
        'rewrite',
        'Reescreva o seguinte conteúdo de forma original, mantendo as informações principais mas adaptando ao estilo do portal EDA Show:

Conteúdo original:
{{source_content}}

Diretrizes:
{{guidelines}}

Requisitos:
- Mantenha a precisão das informações
- Use linguagem própria e original
- Adapte para o público do portal de saúde
- Otimize para SEO com as palavras-chave: {{keywords}}',
        '["source_content", "guidelines", "keywords"]'
    ),
    (
        'Gerar Newsletter',
        'newsletter',
        'Crie uma newsletter com os seguintes posts recentes do portal EDA Show:

Posts:
{{posts_summary}}

Configurações:
- Tom: {{tone}}
- Estilo: {{style}}
- Periodicidade: {{frequency}}

Inclua:
- Saudação inicial
- Destaques dos posts
- Breve descrição de cada artigo
- Call-to-action para ler mais
- Despedida

{{additional_notes}}',
        '["posts_summary", "tone", "style", "frequency", "additional_notes"]'
    )
ON CONFLICT DO NOTHING;

-- Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON ai_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_prompts_updated_at BEFORE UPDATE ON ai_prompts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scheduled_posts_updated_at BEFORE UPDATE ON scheduled_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON newsletters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_schedules_updated_at BEFORE UPDATE ON newsletter_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_sources_updated_at BEFORE UPDATE ON content_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

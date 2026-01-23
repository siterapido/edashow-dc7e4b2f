# 📚 EdaShow - Contexto de Desenvolvimento

Bem-vindo ao diretório `.context` do projeto EdaShow! Este diretório contém documentação essencial, playbooks de agentes e recursos para facilitar o desenvolvimento e manutenção do projeto.

## 📂 Estrutura do Diretório

```
.context/
├── docs/                      # Documentação técnica
│   ├── README.md             # Este arquivo
│   ├── project-overview.md   # Visão geral do projeto
│   ├── architecture.md       # Arquitetura detalhada
│   ├── development-workflow.md # Fluxo de trabalho
│   ├── testing-strategy.md   # Estratégia de testes
│   ├── security.md           # Práticas de segurança
│   ├── glossary.md           # Glossário de termos
│   ├── tooling.md            # Ferramentas e configurações
│   └── codebase-map.json     # Mapa semântico do código
├── agents/                    # Playbooks de agentes especializados
│   ├── frontend-specialist.md
│   ├── feature-developer.md
│   ├── bug-fixer.md
│   ├── code-reviewer.md
│   ├── test-writer.md
│   ├── documentation-writer.md
│   ├── performance-optimizer.md
│   ├── security-auditor.md
│   ├── refactoring-specialist.md
│   ├── architect-specialist.md
│   └── devops-specialist.md
└── plans/                     # Planos de implementação
    └── (futuros planos)
```

## 🎯 Objetivo deste Diretório

Este diretório serve como **fonte única de verdade** para:

1. **Documentação Técnica**: Arquitetura, padrões e decisões de design
2. **Guias de Desenvolvimento**: Como contribuir, testar e deployar
3. **Playbooks de Agentes**: Instruções específicas para agentes IA especializados
4. **Planos de Implementação**: Roadmaps e tarefas estruturadas

## 📖 Documentação Principal

### 🔍 Para Novos Desenvolvedores

**Comece aqui**:
1. [Project Overview](./project-overview.md) - Entenda o que é o EdaShow
2. [Architecture](./architecture.md) - Como o sistema funciona
3. [Development Workflow](./development-workflow.md) - Como trabalhar no projeto

### 🏗️ Para Arquitetos

- [Architecture](./architecture.md) - Decisões arquiteturais e trade-offs
- [Codebase Map](./codebase-map.json) - Mapa semântico completo do código

### 🛠️ Para Desenvolvedores

- [Development Workflow](./development-workflow.md) - Processo de desenvolvimento
- [Tooling](./tooling.md) - Ferramentas e configurações
- [Glossary](./glossary.md) - Termos e conceitos

### 🔒 Para Security/DevOps

- [Security](./security.md) - Práticas de segurança
- [Testing Strategy](./testing-strategy.md) - Como testar adequadamente

## 🤖 Agentes Especializados

Os playbooks de agentes estão em `/agents/` e servem como guias para agentes IA trabalharem em áreas específicas:

### Desenvolvimento
- **[frontend-specialist.md](./agents/frontend-specialist.md)**: UI/UX, React, Tailwind
- **[feature-developer.md](./agents/feature-developer.md)**: Desenvolvimento de features
- **[bug-fixer.md](./agents/bug-fixer.md)**: Debugging e correções

### Qualidade
- **[code-reviewer.md](./agents/code-reviewer.md)**: Code review sistemático
- **[test-writer.md](./agents/test-writer.md)**: Testes automatizados
- **[security-auditor.md](./agents/security-auditor.md)**: Auditoria de segurança

### Otimização
- **[performance-optimizer.md](./agents/performance-optimizer.md)**: Performance tuning
- **[refactoring-specialist.md](./agents/refactoring-specialist.md)**: Refatoração de código

### Infraestrutura
- **[architect-specialist.md](./agents/architect-specialist.md)**: Decisões arquiteturais
- **[devops-specialist.md](./agents/devops-specialist.md)**: Deploy e infraestrutura

### Documentação
- **[documentation-writer.md](./agents/documentation-writer.md)**: Escrita técnica

## 🚀 Início Rápido

### Quero entender o projeto
```bash
# Leia nesta ordem:
1. docs/project-overview.md
2. docs/architecture.md
3. docs/glossary.md
```

### Quero desenvolver uma feature
```bash
# Leia nesta ordem:
1. docs/development-workflow.md
2. agents/feature-developer.md
3. docs/testing-strategy.md
```

### Quero corrigir um bug
```bash
# Leia nesta ordem:
1. agents/bug-fixer.md
2. docs/tooling.md  # debugging tools
3. docs/architecture.md  # entender o sistema
```

### Quero otimizar performance
```bash
# Leia nesta ordem:
1. agents/performance-optimizer.md
2. docs/architecture.md  # bottlenecks conhecidos
3. docs/tooling.md  # profiling tools
```

## 📊 Mapa do Codebase

O arquivo `docs/codebase-map.json` contém uma análise semântica completa do código, incluindo:

- **Stack tecnológico**: Linguagens, frameworks, ferramentas
- **Estrutura**: Total de arquivos, diretórios principais
- **Arquitetura**: Camadas e dependências
- **Símbolos**: Classes, interfaces, funções, tipos
- **API Pública**: Símbolos exportados
- **Dependências**: Arquivos mais importados
- **Estatísticas**: Métricas do projeto

Use este mapa para:
- Entender rapidamente o projeto
- Encontrar componentes e utilitários
- Identificar pontos de integração
- Planejar refatorações

## 🔄 Workflow PREVC

Este projeto utiliza o workflow **PREVC** (Planning, Review, Execution, Validation, Confirmation):

### P - Planning (Planejamento)
- Definir objetivos e escopo
- Criar planos de implementação
- Identificar dependências

### R - Review (Revisão)
- Code review sistemático
- Validação de arquitetura
- Checagem de padrões

### E - Execution (Execução)
- Implementação das features
- Seguir os padrões estabelecidos
- Documentar decisões

### V - Validation (Validação)
- Testes automatizados
- Testes manuais
- Performance checks

### C - Confirmation (Confirmação)
- Deploy em staging
- Smoke tests
- Deploy em produção

## 🎓 Conceitos Importantes

### Artefatos
Objetos criados pelos agentes IA:
- **Research Artifacts**: Pesquisas científicas
- **Image Analysis**: Análises de imagem
- **Notes**: Anotações persistentes
- **Study Materials**: Materiais educacionais

### Agentes IA
Assistentes especializados em tarefas específicas:
- **Science Agent**: Pesquisa científica
- **Imaging Agent**: Análise de imagens
- **Odonto GPT**: Assistente geral
- **Planning Agent**: Planejamento
- **Teaching Agent**: Material educacional

### Server Actions
Funções do Next.js executadas no servidor:
- Type-safe
- Automatically serialized
- Progressive enhancement

### Payload Collections
Schemas de dados do CMS:
- Posts, Users, Media, Pages
- Hooks, Access Control, Versioning

## 📚 Recursos Adicionais

### Documentação Externa
- [Next.js 15](https://nextjs.org/docs)
- [React 19](https://react.dev)
- [Payload CMS](https://payloadcms.com/docs)
- [Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Ferramentas de Desenvolvimento
- **pnpm**: Package manager
- **TypeScript**: Type checking
- **ESLint**: Code linting
- **Vercel**: Deployment platform

## 🤝 Contribuindo

Ao contribuir para o projeto:

1. **Leia a documentação relevante** em `/docs/`
2. **Siga o playbook apropriado** em `/agents/`
3. **Documente suas decisões** (inline comments + docs)
4. **Teste adequadamente** (veja `testing-strategy.md`)
5. **Faça code review** antes de mergear

## 📝 Mantendo esta Documentação

Para atualizar o contexto:

```bash
# Regenerar análise semântica
npm run context:analyze

# Adicionar novo agente
cp .context/agents/template.md .context/agents/meu-agente.md

# Criar novo plano
npm run context:plan -- "Nome do Plano"
```

## 🔍 Busca Rápida

### Encontrar componentes
```bash
# Ver codebase-map.json seção "symbols.classes"
# ou
find components/ -name "*.tsx" | grep <nome>
```

### Encontrar utilitários
```bash
# Ver codebase-map.json seção "utils"
# ou
grep -r "export function" lib/
```

### Encontrar Server Actions
```bash
# Ver lib/actions/
ls -la lib/actions/
```

## 💡 Dicas

### Para Agentes IA
- **Sempre comece lendo o playbook relevante** em `/agents/`
- **Consulte o codebase-map.json** para entender estrutura
- **Siga os padrões do projeto** descritos em `/docs/`
- **Documente decisões importantes**

### Para Desenvolvedores
- **Use o codebase-map** para navegar rapidamente
- **Consulte os playbooks** para best practices
- **Atualize a documentação** quando mudar comportamentos
- **Crie planos** para features complexas

## 📞 Suporte

Para dúvidas:
1. Consulte esta documentação
2. Leia o playbook do agente relevante
3. Consulte o glossário de termos
4. Revise a arquitetura

---

**Última atualização**: 2026-01-21
**Versão do projeto**: 2.2.0
**Gerado por**: Antigravity AI

*Esta documentação é gerada e mantida automaticamente com base na análise semântica do codebase.*

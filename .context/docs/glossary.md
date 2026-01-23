# Glossário - EdaShow

Este glossário define termos técnicos, conceitos e acrônimos usados no projeto EdaShow.

## A

### **Agente / Agent**
Assistente IA especializado em uma tarefa específica. Exemplos: Science Agent (pesquisa), Imaging Agent (análise de imagens), Odonto GPT (assistente geral).

### **Agno**
Framework/serviço Python (FastAPI) que gerencia os agentes IA do sistema.

### **App Router**
Sistema de roteamento do Next.js 13+ baseado em sistema de arquivos, substituindo o Pages Router.

### **Artefato / Artifact**
Objeto criado por um agente como resultado de uma interação. Tipos: Research (pesquisa), Image Analysis (análise), Note (nota), Study Material (material de estudo).

## C

### **Collection (Payload)**
Schema de dados no Payload CMS. Exemplo: `posts`, `users`, `media`. Define campos, validações e permissões.

### **CMS (Content Management System)**
Sistema de gerenciamento de conteúdo. Usamos Payload CMS 3.x.

### **CopilotKit**
Framework para construir interfaces de chat AI. Usado no dashboard para comunicação com agentes.

## D

### **Dashboard**
Interface administrativa protegida do EdaShow (`/dashboard`), com chat, artefatos e pipeline.

### **Dynamic Import**
Importação lazy de componentes React para code splitting e performance.

## F

### **Framer Motion**
Biblioteca de animações declarativas para React.

## H

### **Hook (Payload)**
Função executada em momentos específicos do ciclo de vida de uma collection. Exemplos: `beforeChange`, `afterRead`.

### **Hook (React)**
Função especial do React para usar state e lifecycle. Exemplos: `useState`, `useEffect`, `useAgnoChat`.

## I

### **ISR (Incremental Static Regeneration)**
Técnica do Next.js para atualizar páginas estáticas após o build, com revalidação.

## L

### **Landing Page**
Página inicial pública do EdaShow (`/`), com hero, features e CTAs.

## M

### **MCP (Model Context Protocol)**
Padrão para conectar sistemas AI com ferramentas e dados externos.

### **Metadata**
Informações sobre uma página (título, descrição, OG tags) para SEO.

## N

### **Next.js**
Framework React full-stack. Usamos versão 15 com App Router.

## O

### **OpenRouter**
Serviço que provê acesso a múltiplos modelos LLM (GPT-4, Claude, etc) via API única.

## P

### **Payload CMS**
CMS headless code-first em TypeScript. Versão 3.x.

### **PREVC**
Workflow de desenvolvimento: Planning, Review, Execution, Validation, Confirmation.

## R

### **Radix UI**
Biblioteca de componentes primitivos acessíveis. Base do nosso design system.

### **Revalidate**
Atualizar cache de uma página no Next.js.

### **RLS (Row Level Security)**
Segurança em nível de linha no PostgreSQL/Supabase. Políticas controlam quem acessa quais dados.

### **RSC (React Server Components)**
Componentes React renderizados no servidor, reduzindo bundle do cliente.

## S

### **Server Action**
Função assíncrona do Next.js executada no servidor, marcada com `'use server'`.

### **shadcn/ui**
Coleção de componentes copiáveis baseados em Radix UI e Tailwind.

### **Supabase**
Plataforma BaaS (Backend as a Service) com PostgreSQL, Storage, Auth. Alternativa open-source ao Firebase.

## T

### **Tailwind CSS**
Framework CSS utility-first. Usamos versão 4.

### **TipTap**
Editor rich text extensível baseado em ProseMirror. Usado no CMS.

### **TypeScript**
Superset JavaScript com tipos estáticos.

## V

### **Vercel**
Plataforma de deploy e hosting otimizada para Next.js.

## Z

### **Zod**
Biblioteca TypeScript para validação e parsing de schemas.

---

## Acrônimos Comuns

| Acrônimo | Significado |
|----------|-------------|
| API | Application Programming Interface |
| BaaS | Backend as a Service |
| CMS | Content Management System |
| CTA | Call to Action |
| DB | Database |
| DX | Developer Experience |
| env | Environment (variables) |
| HOC | Higher Order Component |
| ISR | Incremental Static Regeneration |
| JWT | JSON Web Token |
| MCP | Model Context Protocol |
| OG | Open Graph |
| ORM | Object-Relational Mapping |
| PR | Pull Request |
| PREVC | Planning, Review, Execution, Validation, Confirmation |
| RBAC | Role-Based Access Control |
| RLS | Row Level Security |
| RSC | React Server Components |
| S3 | Simple Storage Service (AWS) |
| SEO | Search Engine Optimization |
| SSR | Server-Side Rendering |
| UI | User Interface |
| UX | User Experience |
| WCAG | Web Content Accessibility Guidelines |

---

## Termos Específicos do EdaShow

### **Agente Especializado**
Agente IA treinado para tarefa específica em odontologia. Exemplos: Science (pesquisa científica), Imaging (radiografias), Planning (planejamento de tratamento).

### **Chat Contextual**
Chat que entende o contexto da página/artefato atual e adapta respostas.

### **Pipeline**
Sistema de gerenciamento de tarefas no dashboard, com priorização automática.

### **Sidebar Persistente**
Sidebar de chat que permanece visível durante navegação em artefatos, com scroll independente.

### **Sugestões Contextuais / Suggestion Bubbles**
Botões de sugestão de perguntas que aparecem no chat baseados no contexto atual.

---

*Glossário vivo. Adicione novos termos conforme surgem no projeto.*

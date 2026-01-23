# Feature Developer - EdaShow

## Papel

Você desenvolve novas funcionalidades end-to-end no EdaShow, desde o planejamento até a implementação completa.

## Workflow PREVC

### P - Planning
1. Entenda completamente o requisito
2. Liste arquivos que serão criados/modificados
3. Identifique dependências
4. Planeje estrutura de dados (se aplicável)
5. Documente decisões técnicas

### R - Review
1. Auto-review do código
2. Verificar padrões do projeto
3. Garantir type-safety
4. Linter e build sem erros

### E - Execution
1. Crie branch: `feature/nome-da-feature`
2. Implemente seguindo padrões
3. Commits frequentes e descritivos
4. Documente código complexo

### V - Validation
1. Teste localmente
2. Build de produção OK
3. Performance aceitável
4. Responsividade mobile

### C - Confirmation
1. PR com descrição clara
2. Deploy preview (Vercel)
3. Smoke tests
4. Merge após aprovação

## Estrutura de Feature

### Nova Rota

```bash
# Pública
app/(frontend)/nova-rota/
├── page.tsx           # Página principal
├── layout.tsx         # Layout (se necessário)
└── loading.tsx        # Loading state

# Dashboard (protegida)
app/dashboard/nova-feature/
├── page.tsx
└── [id]/
    └── page.tsx       # Página detalhada
```

### Componentes

```bash
components/nova-feature/
├── index.tsx                # Export barrel
├── feature-list.tsx         # Lista
├── feature-item.tsx         # Item individual
└── feature-form.tsx         # Formulário (se aplicável)
```

### Server Actions

```typescript
// lib/actions/nova-feature.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase/server'

export async function createItem(data: FormData) {
  // 1. Validar com Zod
  const validated = schema.parse({
    title: data.get('title'),
    // ...
  })
  
  // 2. Persistir
  const { data: item, error } = await supabase
    .from('items')
    .insert(validated)
    .select()
    .single()
  
  if (error) throw error
  
  // 3. Revalidar cache
  revalidatePath('/items')
  
  return item
}
```

## Padrões de Implementação

### Database (Supabase)

```typescript
// 1. Definir tipo
interface Item {
  id: string
  title: string
  created_at: string
  user_id: string
}

// 2. Query
const { data, error } = await supabase
  .from('items')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### Forms

```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  title: z.string().min(3),
})

export function ItemForm() {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema)
  })
  
  const onSubmit = async (data) => {
    await createItem(data)
  }
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

### Estado e Loading

```typescript
'use client'
import { useState, useTransition } from 'react'

export function Component() {
  const [isPending, startTransition] = useTransition()
  
  const handleAction = () => {
    startTransition(async () => {
      await serverAction()
    })
  }
  
  return (
    <button disabled={isPending}>
      {isPending ? 'Loading...' : 'Submit'}
    </button>
  )
}
```

## Arquivos Chave a Conhecer

- `.context/docs/architecture.md`: Entender sistema
- `.context/docs/development-workflow.md`: Processo
- `lib/actions/`: Server Actions existentes
- `components/ui/`: Componentes base
- `lib/supabase/`: Clientes Supabase

## Checklist de Feature

### Antes de Implementar
- [ ] Li a documentação relevante
- [ ] Entendi a arquitetura
- [ ] Planejei a estrutura
- [ ] Identifiquei dependências

### Durante Implementação
- [ ] TypeScript strict (sem `any`)
- [ ] Server Components quando possível
- [ ] Validação com Zod
- [ ] Error handling adequado
- [ ] Loading states
- [ ] Commits descritivos

### Antes do PR
- [ ] Build sem erros
- [ ] Linter OK
- [ ] Funcionalidade testada
- [ ] Responsivo (mobile/desktop)
- [ ] Dark mode OK (se aplicável)
- [ ] Sem console.logs

## Exemplos de Features

### Artefato Simples

1. **Criar tabela** (Supabase Dashboard)
2. **Definir tipo** em `lib/types/`
3. **Server Actions** em `lib/actions/`
4. **Componentes** em `components/`
5. **Página** em `app/dashboard/`

### Integração Externa

1. **Variável de ambiente** para API key
2. **Client** em `lib/integrations/`
3. **Server Action** wrapper
4. **UI components**
5. **Error handling**

## Dicas

- **Comece simples**: MVP primeiro, refinamento depois
- **Reuse componentes**: Não reinvente a roda
- **Type-safe**: Use TypeScript ao máximo
- **Performance**: Server Components > Client
- **Acessibilidade**: Radix UI automaticamente
- **Documente decisões**: Comentários úteis

---

*Feature Developer: End-to-end ownership de funcionalidades.*

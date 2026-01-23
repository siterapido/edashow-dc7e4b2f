# Estratégia de Testes - EdaShow

## Visão Geral

O EdaShow atualmente não possui testes automatizados, mas esta documentação define a estratégia para implementação futura de testes.

## Pirâmide de Testes

```
        /\
       /E2E\        ← Poucos, testes críticos
      /------\
     /  API   \     ← Médios, endpoints principais
    /----------\
   /  UNIT TEST \   ← Muitos, componentes e utils
  /--------------\
```

## Testes Unitários

### Ferramentas Recomendadas
- **Jest**: Test runner
- **React Testing Library**: Testes de componentes
- **@testing-library/user-event**: Simulação de interações

### Componentes para Testar

**Componentes UI** (`components/ui/`):
```typescript
// button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
```

**Utilitários** (`lib/utils.ts`):
```typescript
// utils.test.ts
import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('bg-red', 'text-white')).toBe('bg-red text-white')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible'))
      .toBe('base visible')
  })
})
```

### Hooks Customizados

```typescript
// useAgnoChat.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAgnoChat } from './useAgnoChat'

describe('useAgnoChat', () => {
  it('initializes with empty messages', () => {
    const { result } = renderHook(() => useAgnoChat('science'))
    expect(result.current.messages).toEqual([])
  })

  it('sends message', async () => {
    const { result } = renderHook(() => useAgnoChat('science'))
    await act(async () => {
      await result.current.sendMessage('Hello')
    })
    expect(result.current.messages).toHaveLength(2) // user + assistant
  })
})
```

## Testes de Integração

### Server Actions

```typescript
// artifacts.test.ts
import { createResearchArtifact } from '@/lib/actions/artifacts'

describe('Artifacts Actions', () => {
  it('creates research artifact', async () => {
    const artifact = await createResearchArtifact({
      title: 'Test Research',
      content: 'Content',
      userId: 'user-123'
    })
    
    expect(artifact.id).toBeDefined()
    expect(artifact.title).toBe('Test Research')
  })
})
```

### API Routes

```typescript
// api.test.ts
import { POST } from '@/app/api/agno/chat/route'

describe('POST /api/agno/chat', () => {
  it('returns chat response', async () => {
    const request = new Request('http://localhost:3000/api/agno/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
        agentType: 'science'
      })
    })
    
    const response = await POST(request)
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.response).toBeDefined()
  })
})
```

## Testes E2E

### Ferramentas Recomendadas
- **Playwright**: Testes E2E em múltiplos browsers
- **Cypress**: Alternativa popular

### Fluxos Críticos

**Autenticação**:
```typescript
// auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000/admin')
  
  await page.fill('[name=email]', 'admin@example.com')
  await page.fill('[name=password]', 'password')
  await page.click('button[type=submit]')
  
  await expect(page).toHaveURL(/.*dashboard/)
})
```

**Criação de Post**:
```typescript
// post-creation.spec.ts
test('admin can create post', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/admin')
  // ... login steps
  
  // Create post
  await page.click('text=New Post')
  await page.fill('[name=title]', 'Test Post')
  await page.fill('[data-testid=editor]', 'Post content')
  await page.click('text=Publish')
  
  await expect(page.locator('text=Post published')).toBeVisible()
})
```

**Chat com Agente**:
```typescript
// chat.spec.ts
test('user can chat with agent', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard')
  
  await page.fill('[placeholder="Type a message"]', 'What is periodontitis?')
  await page.press('[placeholder="Type a message"]', 'Enter')
  
  await expect(page.locator('.message-assistant')).toBeVisible({ timeout: 10000 })
})
```

## Testes de Performance

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - run: pnpm start & npx wait-on http://localhost:3000
      - run: npx lighthouse-ci --upload.target=temporary-public-storage
```

### Web Vitals Monitoring

```typescript
// app/layout.tsx
export function reportWebVitals(metric) {
  console.log(metric)
  // Enviar para analytics
}
```

## Testes de Acessibilidade

### axe-core

```typescript
// accessibility.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Accessibility', () => {
  it('Button has no a11y violations', async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## Cobertura de Testes

### Meta de Cobertura

- **Unit Tests**: 80%+ cobertura
- **Integration Tests**: Endpoints críticos
- **E2E Tests**: Fluxos principais

### Ferramentas

```bash
# Instalar coverage
pnpm add -D @vitest/coverage-c8

# Rodar com coverage
pnpm test --coverage

# Ver relatório
open coverage/index.html
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test:unit
      
      - name: Run integration tests
        run: pnpm test:integration
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Mocking

### Supabase Client

```typescript
// __mocks__/supabase.ts
export const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      download: jest.fn(),
    })),
  },
}
```

### API Responses

```typescript
// __mocks__/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.post('/api/agno/chat', (req, res, ctx) => {
    return res(ctx.json({
      response: 'Mocked response',
      artifacts: []
    }))
  }),
]
```

## Best Practices

### Testes Devem Ser

- **Independentes**: Não dependem de ordem
- **Repetíveis**: Sempre mesmo resultado
- **Rápidos**: Rodam em segundos
- **Self-validating**: Pass ou fail claro
- **Timely**: Escritos com o código

### Nomenclatura

```typescript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = doSomething(input)
    
    // Assert
    expect(result).toBe('expected')
  })
})
```

### AAA Pattern

1. **Arrange**: Preparar dados
2. **Act**: Executar ação
3. **Assert**: Verificar resultado

## Scripts de Teste (Futuros)

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --coverage",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "test:a11y": "jest tests/a11y",
    "test:watch": "vitest watch"
  }
}
```

## Próximos Passos

1. [ ] Configurar Vitest/Jest
2. [ ] Escrever testes para utils
3. [ ] Testar componentes críticos
4. [ ] Adicionar testes de API
5. [ ] Implementar E2E básico
6. [ ] Configurar CI com testes
7. [ ] Adicionar coverage reporting

---

*Estratégia de testes definida em 2026-01-16. Implementação pendente.*

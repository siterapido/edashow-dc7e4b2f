# Test Writer - EdaShow

## Papel

Você escreve testes automatizados que garantem qualidade e previnem regressões.

## Pirâmide de Testes

```
    /E2E\         ← Poucos
   /-----\
  /  API  \       ← Médios  
 /---------\
/   UNIT    \     ← Muitos
```

## Unit Tests

### Components

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders text', () => {
    render(<Button>Click</Button>)
    expect(screen.getByText('Click')).toBeInTheDocument()
  })
  
  it('handles click', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(onClick).toHaveBeenCalled()
  })
})
```

### Utils

```typescript
import { cn } from './utils'

describe('cn', () => {
  it('merges classes', () => {
    expect(cn('a', 'b')).toBe('a b')
  })
})
```

## Integration Tests

### Server Actions

```typescript
import { createItem } from './actions'

describe('createItem', () => {
  it('creates item', async () => {
    const item = await createItem({ title: 'Test' })
    expect(item.id).toBeDefined()
  })
})
```

## E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/admin')
  await page.fill('[name=email]', 'test@example.com')
  await page.fill('[name=password]', 'password')
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/dashboard/)
})
```

## Best Practices

- AAA pattern (Arrange, Act, Assert)
- Testes independentes
- Nomes descritivos
- Fast execution
- Deterministic (não flaky)

---

*Test Writer: Confiança através de testes.*

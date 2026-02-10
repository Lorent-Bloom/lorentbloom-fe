# CLAUDE.md

## Project Overview

Next.js 15 + React 19 + TypeScript + Apollo GraphQL e-commerce frontend.
**Use Bun** (not npm/pnpm). Backend GraphQL: https://developer.adobe.com/commerce/webapi/reference/graphql/2.4.8/

## Commands

```bash
bun run dev              # Dev server (Turbopack)
bun run build            # Production build
bun run lint             # ESLint
bun run fmt              # Prettier
bun run generate:i18n    # Merge i18n files (run after any i18n changes)
```

## Architecture: Feature-Sliced Design (FSD)

**Unidirectional imports**: `shared → entities → features → widgets → views → app`

```
src/
├── app/        # Providers, initialization
├── views/      # Page compositions
├── widgets/    # Composite UI (header, footer, forms)
├── features/   # User interactions (change-language, address-management)
├── entities/   # Business entities (customer, customer-address)
└── shared/     # Reusable: ui/, config/, api/, lib/
```

**Import Aliases**: `@/*`, `@app/*`, `@shared/*`, `@widgets/*`, `@features/*`, `@views/*`, `@entities/*`, `@next/*`

### FSD Rules

- Lower layers CANNOT import from upper layers
- Import from slice root only (`import { X } from "@features/auth"`)
- One entity per domain concept (customer-address separate from customer)

### Slice Structure

```
slice-name/
├── ui/         # React components (JSX only)
├── lib/        # Hooks: use<Component>.ts (all logic here)
├── model/      # interface.ts, schema.ts, const.ts
├── api/        # gql/, action/server.ts, action/client.ts
├── i18n/       # en.json, ru.json, ro.json
└── index.ts    # Public exports
```

## Critical Pattern: Separation of Concerns

### lib/ - ALL Logic

```typescript
// lib/useProductCard.ts
"use client"; // Only if UI component has "use client"

export const useProductCard = (product: Product) => {
  const [quantity, setQuantity] = useState(1);
  const total = product.price * quantity;
  const handleIncrement = () => setQuantity((q) => q + 1);
  return { quantity, total, handleIncrement };
};
```

### ui/ - JSX Only

```typescript
// ui/ProductCard.tsx
import { useProductCard } from "../lib/useProductCard";
import type { ProductCardProps } from "../model/interface";

export function ProductCard({ product }: ProductCardProps) {
  const { quantity, total, handleIncrement } = useProductCard(product);
  return (
    <div>
      <span>{total}</span>
      <button onClick={handleIncrement}>{quantity}</button>
    </div>
  );
}
```

### What's FORBIDDEN in ui/ components

- useState, useEffect, useMemo, useCallback
- Event handler implementations
- Calculations, derived values, data transformations
- Business logic conditionals

### model/ - Types & Schemas

```typescript
// model/interface.ts - ALL props interfaces here
export interface ProductCardProps {
  product: Product;
  className?: string;
}

// model/schema.ts - Zod schemas for forms
export const FormSchema = z.object({ email: z.string().email() });
export type TFormSchema = z.infer<typeof FormSchema>;
```

## GraphQL & Server Actions

```typescript
// api/action/server.ts
"use server";
import { isAuthError } from "@shared/lib/utils";

export async function myAction(input: Input) {
  try {
    const result = await getClient().mutate({ mutation, variables: input });
    return { success: true, data: result.data };
  } catch (error) {
    if (isAuthError(error)) return { success: false, error: "SESSION_EXPIRED" };
    return { success: false, error: "Something went wrong" };
  }
}
```

**Rules**:

- Always use `isAuthError` from `@shared/lib/utils` (handles 401, GraphQL auth errors)
- Return `{ success: boolean, error?: string, data?: T }`
- UI checks `SESSION_EXPIRED` and redirects to `/sign-in`

## Authentication

- Cookie-based: `TOKEN_COOKIE_NAME` (httpOnly, secure, 7-day expiry)
- All routes private by default
- Route protection is handled in `proxy.ts` (Next.js 15+ replacement for `middleware.ts`)
- To make a route public, add it to `publicPaths` in both `proxy.ts` and `src/shared/lib/hooks/useAuthCheck.ts`
- Public: `/` (home), `/sign-in`, `/sign-up`, `/faq`, `/about`, `/how-to-rent-out`, `/terms-of-policy`, `/contact-us`
- Auth-locked: `/sign-in`, `/sign-up` redirect home if authenticated

## i18n (next-intl)

Locales: en (default), ru, ro | Routes: `/[locale]/...`

1. Add translations to slice's `i18n/{locale}.json`
2. Run `bun run generate:i18n`

## UI Stack

- **Styling**: Tailwind CSS v4, next-themes (dark mode)
- **Components**: Shadcn UI (`@shared/ui`)
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **Icons**: lucide-react
- **Toasts**: Sonner

**Button hovers**: Always add visible hover states (`hover:bg-{color}`, `dark:hover:bg-{color}`)

## Component Rules

- Use `next/link` (never `<a>`)
- Use `next/image` (never `<img>`)
- Client components: suffix with `Client` when needed
- Mobile-first: all code must be mobile friendly

## Reference Slices

Good examples to follow: `widgets/sign-in-form`, `widgets/sign-up-form`, `features/change-language`

## Database Migrations (Supabase)

SQL migrations are stored in `/migrations/` folder with sequential numbering:

- `001_chat_system.sql`
- `002_chat_reports.sql`
- `003_documents.sql`

When adding new migrations, use the next available number prefix (e.g., `004_feature_name.sql`).

## SEO Rules

- **Meta title**: 50–60 characters max
- **Meta description**: 100–130 characters max
- Never include `BRAND.name` ("Lorent Bloom") in page-level titles — the layout template `%s | Lorent Bloom` appends it automatically
- Use `{ absolute: ... }` for titles only when "| Lorent Bloom" is already in the string (e.g., home page)

## Dev Notes

- Don't start servers for me (I do it manually)
- Run `bun run generate:i18n` after i18n changes
- TLS disabled in dev: `NODE_TLS_REJECT_UNAUTHORIZED=0`

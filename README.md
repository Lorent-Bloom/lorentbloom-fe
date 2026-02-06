# Lorent Bloom

A modern rental marketplace built with Next.js 16, React 19, and TypeScript. Rent anything from electronics to equipment, easily and affordably.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Shadcn UI
- **State:** Zustand
- **API:** Apollo GraphQL (Adobe Commerce backend)
- **Forms:** React Hook Form + Zod
- **i18n:** next-intl (English, Russian, Romanian)
- **Auth:** Cookie-based JWT
- **Package Manager:** Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/lorent-bloom.git
cd lorent-bloom

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command                 | Description                  |
| ----------------------- | ---------------------------- |
| `bun run dev`           | Start dev server (Turbopack) |
| `bun run build`         | Production build             |
| `bun run start`         | Start production server      |
| `bun run lint`          | Run ESLint                   |
| `bun run fmt`           | Format with Prettier         |
| `bun run generate:i18n` | Merge i18n translation files |
| `bun run test:e2e`      | Run Playwright tests         |
| `bun run test:e2e:ui`   | Playwright UI mode           |

## Project Structure

This project follows **Feature-Sliced Design (FSD)** architecture with unidirectional imports:

```
src/
├── app/          # App initialization, providers
├── views/        # Page compositions
├── widgets/      # Composite UI blocks (header, footer, forms)
├── features/     # User interactions (auth, address-management)
├── entities/     # Business entities (customer, product, order)
└── shared/       # Reusable utilities
    ├── ui/       # Shadcn components
    ├── api/      # Apollo client, server actions
    ├── config/   # Environment, i18n, brand constants
    └── lib/      # Hooks, utilities
```

### Import Rules

- Lower layers cannot import from upper layers
- Import from slice root only: `import { X } from "@features/auth"`
- One entity per domain concept

### Slice Structure

```
slice-name/
├── ui/           # React components (JSX only)
├── lib/          # Hooks with all logic
├── model/        # Types, schemas, constants
├── api/          # GraphQL queries, server actions
├── i18n/         # Translations (en.json, ru.json, ro.json)
└── index.ts      # Public exports
```

## Environment Variables

Create a `.env.local` file with:

```env
# GraphQL API
NEXT_PUBLIC_API_URL=https://your-magento-api.com/graphql

# Authentication
TOKEN_COOKIE_NAME=auth_token

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key

# Email (Resend)
RESEND_API_KEY=your_resend_key
EMAIL_FROM=noreply@lorentbloom.com
ADMIN_EMAIL=admin@lorentbloom.com

# File uploads (UploadThing)
UPLOADTHING_TOKEN=your_uploadthing_token

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project
SENTRY_AUTH_TOKEN=your_auth_token
```

## Internationalization

Supported locales: `en` (default), `ru`, `ro`

Routes are prefixed with locale: `/en/products`, `/ru/products`, `/ro/products`

After modifying translation files, run:

```bash
bun run generate:i18n
```

## Key Features

- **Product Catalog** - Browse and search rental items by category
- **User Authentication** - Sign up, sign in, password recovery
- **Shopping Cart** - Add items, manage quantities
- **Checkout Flow** - Billing, shipping, payment processing
- **User Dashboard** - Orders, addresses, settings
- **Rental Management** - Track active rentals
- **Reviews & Ratings** - Leave feedback on products
- **Wishlist** - Save items for later
- **Dark Mode** - System-aware theme switching
- **Mobile Responsive** - Optimized for all devices

## Development Guidelines

### Component Pattern

**Logic in hooks (`lib/`):**

```typescript
// lib/useProductCard.ts
export const useProductCard = (product: Product) => {
  const [quantity, setQuantity] = useState(1);
  const handleIncrement = () => setQuantity((q) => q + 1);
  return { quantity, handleIncrement };
};
```

**JSX only in components (`ui/`):**

```typescript
// ui/ProductCard.tsx
export function ProductCard({ product }: ProductCardProps) {
  const { quantity, handleIncrement } = useProductCard(product);
  return <button onClick={handleIncrement}>{quantity}</button>;
}
```

### Server Actions

```typescript
// api/action/server.ts
"use server";

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

## Testing

E2E tests use Playwright:

```bash
# Run all tests
bun run test:e2e

# Run with UI
bun run test:e2e:ui

# Run specific test file
bunx playwright test e2e/auth/sign-in.spec.ts
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual

```bash
bun run build
bun run start
```

## License

Private - All rights reserved.

---

Built with [Next.js](https://nextjs.org) and [Shadcn UI](https://ui.shadcn.com)

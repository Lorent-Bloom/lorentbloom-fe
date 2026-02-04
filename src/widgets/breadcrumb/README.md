# Breadcrumb Widget

A breadcrumb navigation component following FSD architecture principles.

## Features

- Supports internationalization (i18n)
- Responsive design
- Accessible navigation
- Customizable breadcrumb items
- Built with shadcn/ui primitives

## Usage

### Basic Usage (Client Component)

```tsx
"use client";

import { Breadcrumb } from "@widgets/breadcrumb";

export default function MyPage() {
  const items = [
    { label: "Home", href: "/en" },
    { label: "Products", href: "/en/products" },
    { label: "Product Name" }, // Last item without href (current page)
  ];

  return <Breadcrumb items={items} />;
}
```

### Using with i18n and Hook

```tsx
"use client";

import { Breadcrumb, useBreadcrumb } from "@widgets/breadcrumb";
import { useLocale, useTranslations } from "next-intl";

export default function ProductPage() {
  const locale = useLocale();
  const t = useTranslations("breadcrumb");

  const items = useBreadcrumb({
    locale,
    customItems: [
      { label: t("home"), href: `/${locale}` },
      { label: t("products"), href: `/${locale}/products` },
      { label: "MacBook Pro 16" }, // Current page
    ],
  });

  return <Breadcrumb items={items} className="mb-4" />;
}
```

### Server Component Example

```tsx
import { Breadcrumb } from "@widgets/breadcrumb";
import { getLocale, getTranslations } from "next-intl/server";

export default async function ProductDetailPage() {
  const locale = await getLocale();
  const t = await getTranslations("breadcrumb");

  const items = [
    { label: t("home"), href: `/${locale}` },
    { label: t("products"), href: `/${locale}/products` },
    { label: "Product Name" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={items} />
      {/* Page content */}
    </div>
  );
}
```

## Props

### BreadcrumbProps

| Prop      | Type             | Required | Description               |
| --------- | ---------------- | -------- | ------------------------- |
| items     | BreadcrumbItem[] | Yes      | Array of breadcrumb items |
| className | string           | No       | Additional CSS classes    |

### BreadcrumbItem

| Prop  | Type   | Required | Description                                |
| ----- | ------ | -------- | ------------------------------------------ |
| label | string | Yes      | Display text for the breadcrumb item       |
| href  | string | No       | Link URL (omit for current page/last item) |

## Available Translations

The breadcrumb widget includes pre-configured translations for common pages:

- `home` - Home page
- `products` - Products page
- `about` - About page
- `faq` - FAQ page
- `howToRentOut` - How to Rent Out page
- `termsOfPolicy` - Terms of Policy page
- `accountSettings` - Account Settings
- `profile` - Profile
- `account` - Account
- `addresses` - Addresses
- `security` - Security

## File Structure

```
src/widgets/breadcrumb/
├── ui/
│   └── Breadcrumb.tsx       # Main component
├── model/
│   └── interface.ts         # TypeScript interfaces
├── lib/
│   └── useBreadcrumb.ts     # Hook for breadcrumb logic
├── i18n/
│   ├── en.json              # English translations
│   ├── ru.json              # Russian translations
│   └── ro.json              # Romanian translations
└── index.ts                 # Public API exports
```

## Styling

The breadcrumb component uses Tailwind CSS and inherits theme colors from your design system. It supports:

- Light/dark mode
- Hover states
- Focus states for accessibility
- Responsive text sizing

## Accessibility

- Uses semantic HTML (`<nav>`, `<ol>`, `<li>`)
- Includes `aria-label` for navigation
- Current page marked with `aria-current="page"`
- Keyboard navigable links

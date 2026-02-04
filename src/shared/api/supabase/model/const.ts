export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Support both new (publishable) and legacy (anon) key names
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

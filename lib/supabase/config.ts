import { DOE_SUPABASE_ANON_KEY, DOE_SUPABASE_URL } from "@/lib/supabase/project";

function isPlaceholder(value: string | undefined): boolean {
  return !value || value.startsWith("your-");
}

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!isPlaceholder(url)) return url!;
  return DOE_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string {
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!isPlaceholder(envKey)) return envKey!;
  return DOE_SUPABASE_ANON_KEY;
}

export function hasSupabase() {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY
}

export const ENABLE_SMS = String(import.meta.env.VITE_ENABLE_SMS || '').toLowerCase() === 'true'
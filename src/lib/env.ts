/**
 * Read NEXT_PUBLIC_* vars via direct property access so Next.js can inline
 * them in client bundles. Validation runs lazily on first access, not at import.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type SupabasePublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

let cached: SupabasePublicEnv | null = null;

function resolveSupabaseEnv(): SupabasePublicEnv {
  if (cached) {
    return cached;
  }

  if (!SUPABASE_URL) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL"
    );
  }

  if (!SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  cached = {
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
  };

  return cached;
}

/** Validated Supabase public config — throws only when read, not on import. */
export function getSupabaseEnv(): SupabasePublicEnv {
  return resolveSupabaseEnv();
}

export const env = {
  get supabaseUrl(): string {
    return resolveSupabaseEnv().supabaseUrl;
  },
  get supabaseAnonKey(): string {
    return resolveSupabaseEnv().supabaseAnonKey;
  },
};

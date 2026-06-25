type SupabasePublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

declare global {
  interface Window {
    __NEXT_PUBLIC_ENV__?: {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
    };
  }
}

let cached: SupabasePublicEnv | null = null;

/**
 * Read env at call time — never at module import.
 * Client: prefers window.__NEXT_PUBLIC_ENV__ (injected by server at runtime).
 * Server: reads process.env (Cloud Run runtime or build-time inlining).
 */
function readRawEnv(): { supabaseUrl?: string; supabaseAnonKey?: string } {
  if (typeof window !== "undefined") {
    const runtime = window.__NEXT_PUBLIC_ENV__;
    if (runtime?.supabaseUrl && runtime?.supabaseAnonKey) {
      return {
        supabaseUrl: runtime.supabaseUrl,
        supabaseAnonKey: runtime.supabaseAnonKey,
      };
    }
  }

  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

function resolveSupabaseEnv(): SupabasePublicEnv {
  if (cached) {
    return cached;
  }

  const { supabaseUrl, supabaseAnonKey } = readRawEnv();

  if (!supabaseUrl) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL"
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  cached = { supabaseUrl, supabaseAnonKey };
  return cached;
}

/** Clear cache (e.g. after runtime script hydrates window env). */
export function resetSupabaseEnvCache(): void {
  cached = null;
}

export function getSupabaseEnv(): SupabasePublicEnv {
  return resolveSupabaseEnv();
}

export function getSupabaseUrl(): string {
  return resolveSupabaseEnv().supabaseUrl;
}

export function getSupabaseAnonKey(): string {
  return resolveSupabaseEnv().supabaseAnonKey;
}

/**
 * Injects public env vars for the browser at request time.
 * Needed when NEXT_PUBLIC_* were not inlined during `next build` (e.g. Cloud Run
 * buildpack) but are set on the server at runtime.
 */
export function PublicEnvScript() {
  const payload = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };

  return (
    <script
      id="next-public-env"
      dangerouslySetInnerHTML={{
        __html: `window.__NEXT_PUBLIC_ENV__=${JSON.stringify(payload)}`,
      }}
    />
  );
}

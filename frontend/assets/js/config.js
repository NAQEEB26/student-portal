/**
 * Frontend Configuration for CampusFlow
 * 
 * For local development, update the values below with your Supabase project credentials.
 * For production (Vercel), these are injected at build/deploy time via environment variables.
 * 
 * IMPORTANT: Only use the anon (public) key here. Never expose the service role key in frontend code.
 */
window.__ENV__ = {
    SUPABASE_URL: 'https://your-project-id.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key-here'
};

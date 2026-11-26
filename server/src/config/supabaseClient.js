import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

// Database connection is mandatory. There is no local JSON fallback.
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase is required: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the backend.');
}

// IMPORTANT: the service-role key must NEVER be exposed to the frontend.
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

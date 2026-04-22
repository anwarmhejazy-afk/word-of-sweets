const SUPABASE_URL = "https://roubmrtlctofykokqddv.db.co";
const SUPABASE_ANON_KEY = "sb_publishable_fOaDO0rPk6PzzHudxi-WZQ_QlxhXrwE";

window.db = window.db.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
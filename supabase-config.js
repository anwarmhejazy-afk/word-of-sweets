const SUPABASE_URL = "https://roubmrtlctofykokqddv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fOaDO0rPk6PzzHudxi-WZQ_QlxhXrwE";

const { createClient } = supabase;
window.db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
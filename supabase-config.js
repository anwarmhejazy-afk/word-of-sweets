const SUPABASE_URL = "https://roubmrtlctofykokqddv.supabase.co";
const SUPABASE_KEY = "sb_publishable_fOaDO0rPk6PzzHudxi-WZQ_QlxhXrwE";

window.db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase connected:", window.db);
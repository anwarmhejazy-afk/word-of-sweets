const SUPABASE_URL = "https://roubmrtlctofykokqddv.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY_HERE"; // from Supabase

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// IMPORTANT: expose globally
window.db = db;

console.log("Supabase connected:", db);
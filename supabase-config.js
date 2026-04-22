import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://roubmrtlctofykokqddv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fOaDO0rPk6PzzHudxi-WZQ_QlxhXrwE";

window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
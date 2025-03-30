import { createClient } from '@supabase/supabase-js';
// import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log("🧪 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🧪 SUPABASE_KEY:", process.env.SUPABASE_KEY ? "✅ 読み込み成功" : "❌ 読み込み失敗");


export const supabase = createClient(supabaseUrl, supabaseKey);

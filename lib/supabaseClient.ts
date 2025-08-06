import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jyceiafqvfgadzvdsyhn.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5Y2VpYWZxdmZnYWR6dmRzeWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDMxNzksImV4cCI6MjA3MDA3OTE3OX0.889ceckj_WxkXlkUm494tGpcxlLVbw-GYj-hCZLvhYU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

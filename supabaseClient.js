// supabaseClient.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://thxiqhhpabenkqqnktrb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeGlxaGhwYWJlbmtxcW5rdHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjY2NDAsImV4cCI6MjA2Njg0MjY0MH0.Z_GHmgzGBuRX4YWj2uRT4rR8WtpUA9lg-qZHwn2xNMw";

export const supabase = createClient(supabaseUrl, supabaseKey);

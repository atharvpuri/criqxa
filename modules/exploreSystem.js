// exploreSystem.js
import { supabase } from '../homepage/supabaseClient.js';

export async function getLatestPosts(limit = 20) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) console.error('Explore posts error:', error);
  return data;
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, bio');

  if (error) console.error('User list error:', error);
  return data;
}

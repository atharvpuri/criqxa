// modules/postSystem.js
import { supabase } from '../homepage/supabaseClient.js';

// ✅ Create a post
export async function createPost(content, user) {
  if (!content || !user) return { error: "Missing content or user." };

  const { data, error } = await supabase.from('posts').insert([
    {
      content,
      user_id: user.id,
      username: user.user_metadata?.username || user.email.split('@')[0],
      likes: 0,
      liked_by: [],
    }
  ]);

  return { data, error };
}

// ✅ Fetch recent 20 posts
export async function fetchRecentPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return { data, error };
}

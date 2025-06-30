// userSystem.js
import { supabase } from '../homepage/supabaseClient.js';

// ✅ Get a user's profile
export async function getUserProfile(uid) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .single();

  if (error) console.error('Profile fetch error:', error);
  return data;
}

// ✅ Get posts by user
export async function getUserPosts(uid) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('User posts fetch error:', error);
    return [];
  }

  return data;
}

// ✅ Get user stats (posts, likes, followers)
export async function getStats(uid) {
  const posts = await getUserPosts(uid);
  const likes = posts.reduce((acc, post) => acc + (post.likes || 0), 0);
  const followers = await getFollowers(uid);
  return {
    posts: posts.length,
    likes,
    followers: followers.length
  };
}

// ✅ Follow a user
export async function followUser(currentUserId, targetUserId) {
  const { data, error } = await supabase
    .from('follows')
    .insert([{ follower_id: currentUserId, following_id: targetUserId }]);

  if (error) console.error('Follow error:', error);
  return { data, error };
}

// ✅ Unfollow a user
export async function unfollowUser(currentUserId, targetUserId) {
  const { data, error } = await supabase
    .from('follows')
    .delete()
    .match({ follower_id: currentUserId, following_id: targetUserId });

  if (error) console.error('Unfollow error:', error);
  return { data, error };
}

// ✅ Check if following
export async function isFollowing(currentUserId, targetUserId) {
  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .match({ follower_id: currentUserId, following_id: targetUserId });

  return { isFollowing: data?.length > 0, error };
}

// ✅ Get followers of a user
export async function getFollowers(userId) {
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('following_id', userId);

  if (error) console.error('Fetch followers error:', error);
  return data || [];
}

// ✅ Get users a user is following
export async function getFollowing(userId) {
  const { data, error } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId);

  if (error) console.error('Fetch following error:', error);
  return data || [];
}

// ✅ Get list of other users to follow (excluding self and already followed)
export async function getSuggestedUsers(currentUserId) {
  const following = await getFollowing(currentUserId);
  const followingIds = following.map(f => f.following_id);

  const { data, error } = await supabase
    .from('users')
    .select('id, username, bio')
    .not('id', 'in', `(${[...followingIds, currentUserId].join(',')})`);

  if (error) console.error('Suggested users error:', error);
  return data || [];
}

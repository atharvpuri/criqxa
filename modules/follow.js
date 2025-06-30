// modules/follow.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://thxiqhhpabenkqqnktrb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeGlxaGhwYWJlbmtxcW5rdHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjY2NDAsImV4cCI6MjA2Njg0MjY0MH0.Z_GHmgzGBuRX4YWj2uRT4rR8WtpUA9lg-qZHwn2xNMw'
);

// Get current user
export async function getCurrentUser() {
  const session = await supabase.auth.getSession();
  return session.data.session?.user;
}

// Check if current user follows someone
export async function isFollowing(followerId, followingId) {
  const { data } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();

  return !!data;
}

// Follow user
export async function followUser(followerId, followingId) {
  return await supabase.from('follows').insert({
    follower_id: followerId,
    following_id: followingId,
  });
}

// Unfollow user
export async function unfollowUser(followerId, followingId) {
  return await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
}

// Hook this to the "Following" button at top bar in index.html
export async function setupFollowButton() {
  const followBtn = document.getElementById('followingBtn');
  if (!followBtn) return;

  const user = await getCurrentUser();
  if (!user) {
    followBtn.textContent = 'Login';
    followBtn.onclick = () => (window.location.href = '../login/login.html');
    return;
  }

  followBtn.textContent = 'Following';
  followBtn.onclick = () => {
    alert('You are not following anyone yet. Go explore some profiles.');
    // Optional: redirect to explore.html or something
    // window.location.href = './explore.html';
  };
}

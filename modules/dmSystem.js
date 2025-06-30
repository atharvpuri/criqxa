// dmSystem.js
import { supabase } from '../homepage/supabaseClient.js';

export async function sendDM(senderId, receiverId, message) {
  const { data, error } = await supabase
    .from('dms')
    .insert([{ sender_id: senderId, receiver_id: receiverId, message }]);

  if (error) console.error('DM error:', error);
  return data;
}

export async function fetchDMs(user1, user2) {
  const { data, error } = await supabase
    .from('dms')
    .select('*')
    .or(`and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`)
    .order('created_at', { ascending: true });

  if (error) console.error('Fetch DMs error:', error);
  return data;
}

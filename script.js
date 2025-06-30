// Initialize supabase client properly
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://thxiqhhpabenkqqnktrb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeGlxaGhwYWJlbmtxcW5rdHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjY2NDAsImV4cCI6MjA2Njg0MjY0MH0.Z_GHmgzGBuRX4YWj2uRT4rR8WtpUA9lg-qZHwn2xNMw'
);

const postBox = document.getElementById("postContent");
const postBtn = document.getElementById("submitPost");
const timeline = document.getElementById("timeline");

// Home button function: just reload posts, no navigation
window.navigateHome = async function () {
  await loadPosts();
  // Optionally clear post box or reset UI state here if needed
};

// Posting a new post
postBtn.addEventListener("click", async () => {
  const content = postBox.value.trim();
  if (!content) return alert("Write something, bro.");

  // Ideally, get username from auth, fallback to guest
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;
  const username = user?.email?.split("@")[0] || "guest";

  const { error } = await supabase.from("posts").insert([
    {
      content: content,
      username: username
    }
  ]);

  if (error) {
    alert("Error posting: " + error.message);
  } else {
    postBox.value = "";
    loadPosts();
  }
});

// Load posts from Supabase and render them
async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false }); // Use created_at, not id

  if (error) {
    alert("Can't fetch posts.");
    console.error(error);
    return;
  }

  timeline.innerHTML = "";

  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="post-user">@${post.username}</div>
      <div class="post-content">${post.content}</div>
      <div class="post-meta">
        <span>${new Date(post.created_at).toLocaleString()}</span>
      </div>
    `;
    timeline.appendChild(div);
  });
}

// Initial load when script runs
loadPosts();

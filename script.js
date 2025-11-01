import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://avgzkymqdinpqphgphpt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z3preW1xZGlucHFwaGdwaHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDE5OTksImV4cCI6MjA3NzU3Nzk5OX0.WLu35eL3cIHA218eqEIZxFCUFl8qO9bdDo2Kv-rkb1g';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const videoContainer = document.getElementById("videoContainer");
const statusText = document.getElementById("status");

// Subir video
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Selecciona un video para subir.");
    return;
  }

  statusText.textContent = "Subiendo video... ⏳";

  const filePath = `public/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("videos")
    .upload(filePath, file);

  if (error) {
    console.error(error);
    statusText.textContent = "❌ Error al subir el video.";
  } else {
    const { data: urlData } = supabase.storage.from("videos").getPublicUrl(filePath);
    statusText.textContent = "✅ Video subido con éxito.";
    mostrarVideo(urlData.publicUrl);
  }
});

// Mostrar todos los videos públicos
async function cargarVideos() {
  const { data, error } = await supabase.storage.from("videos").list("public", { limit: 50 });
  if (error) {
    console.error(error);
    return;
  }

  for (const video of data.reverse()) {
    const { data: urlData } = supabase.storage.from("videos").getPublicUrl(`public/${video.name}`);
    mostrarVideo(urlData.publicUrl);
  }
}

function mostrarVideo(url) {
  const vid = document.createElement("video");
  vid.src = url;
  vid.controls = true;
  videoContainer.appendChild(vid);
}

cargarVideos();
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://xbpnqxktepepbizedbpe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicG5xeGt0ZXBlcGJpemVkYnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDk1MzEsImV4cCI6MjA3NzU4NTUzMX0.dUyHVMfwjeK6VyJQaJynNY6zG1SNtqcQgnUmqzhTBX4';

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

// Cargar videos al iniciar
cargarVideos();

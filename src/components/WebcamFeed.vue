<template>
    <div class="text-center">
      <video ref="video" autoplay muted width="640" height="480" class="border"></video>
      
    </div>
  
    <div class="mb-3">
      <button class="btn btn-primary me-2" @click="startWebcam">Start webcam</button>
      <button class="btn btn-danger" @click="stopWebcam">Stop webcam</button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  
  const video = ref<HTMLVideoElement | null>(null);
  const stream = ref<MediaStream | null>(null); 



  
  onMounted(async () => {
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
      if (video.value) {
        video.value.srcObject = stream.value;
      }
    } catch (err) {
       console.error('Camera access error:', err);
    }
  });
  
  async function startWebcam() {
    if (video.value) {
      if (!stream.value) {
        stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      video.value.srcObject = stream.value;
    }
  }
  
  function stopWebcam() {
    if (stream.value) {
      stream.value.getTracks().forEach((track) => track.stop());
      stream.value = null;
    }
  
    if (video.value) {
      video.value.srcObject = null;
    }
  }
  </script>
  
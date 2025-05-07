<!-- src/components/FaceOverlay.vue -->
<template>
    <div class="video-container position-relative">
      <video
        ref="video"
        autoplay
        playsinline
        class="rounded border border-dark"
        width="640"
        height="480"
      ></video>
      <canvas
        ref="canvas"
        width="640"
        height="480"
        class="overlay-canvas"
      ></canvas>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  import * as faceapi from 'face-api.js';
  
  const emit = defineEmits<{
    (e: 'faces-detected', faces: any[]): void;
  }>();
  
  const props = defineProps<{
    active: boolean;
  }>();
  
  const video = ref<HTMLVideoElement | null>(null);
  const canvas = ref<HTMLCanvasElement | null>(null);
  const stream = ref<MediaStream | null>(null);
  const previousFaces = ref<any[]>([]);
  
  const startWebcam = async () => {
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
      if (video.value) {
        video.value.srcObject = stream.value;
        video.value.onloadeddata = () => detectFaces();
      }
    } catch (err) {
      console.error('Webcam error:', err);
    }
  };
  
  const stopWebcam = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop());
    }
    const ctx = canvas.value?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  };
  
  onMounted(async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.ageGenderNet.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
  });
  
  watch(() => props.active, (newVal) => {
    newVal ? startWebcam() : stopWebcam();
  });
  
  onBeforeUnmount(() => {
    stopWebcam();
  });
  
  const detectFaces = async () => {
    if (!video.value || !canvas.value) return;
  
    const displaySize = { width: video.value.width, height: video.value.height };
    faceapi.matchDimensions(canvas.value, displaySize);
  
    const detections = await faceapi
      .detectAllFaces(video.value, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withAgeAndGender()
      .withFaceExpressions();
  
    const resized = faceapi.resizeResults(detections, displaySize);
    const faces = resized.map((d) => ({
      age: Math.round(d.age),
      gender: d.gender,
      emotion: Object.entries(d.expressions)
        .sort((a, b) => b[1] - a[1])[0][0],
      box: d.detection.box,
    }));
  
    if (JSON.stringify(faces) !== JSON.stringify(previousFaces.value)) {
      previousFaces.value = faces;
      emit('faces-detected', faces);
    }
  
    const ctx = canvas.value.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
      faceapi.draw.drawDetections(canvas.value, resized);
      faceapi.draw.drawFaceLandmarks(canvas.value, resized);
      faceapi.draw.drawFaceExpressions(canvas.value, resized);
    }
  
    setTimeout(() => detectFaces(), 500);
  };
  </script>
  
  <style scoped>
  .video-container {
    position: relative;
    width: 640px;
    height: 480px;
    margin: auto;
  }
  .overlay-canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  </style>
  
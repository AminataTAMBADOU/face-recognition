<template>
  <div class="container text-center mt-4">
    <h3>Live Webcam</h3>
    <div class="video-container">
      <video ref="video" autoplay playsinline class="rounded border border-dark" width="640" height="480"></video>
      <canvas ref="canvas" width="640" height="480" class="position-absolute top-0 start-0"></canvas>

    </div>
    <div class="mt-3">
      <button class="btn btn-primary me-2" @click="startWebcam" :disabled="webcamActive">Start</button>
      <button class="btn btn-danger" @click="stopWebcam" :disabled="!webcamActive">Stop</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useFaceStore } from '@/stores/face';
import * as faceapi from 'face-api.js';

const video = ref<HTMLVideoElement | null>(null);
const stream = ref<MediaStream | null>(null);
const faceStore = useFaceStore();
const canvas = ref<HTMLCanvasElement | null>(null);


const webcamActive = ref(false);

const startWebcam = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
    if (video.value) {
      video.value.srcObject = stream.value;
      webcamActive.value = true;
      faceStore.toggleWebcam(); 
      video.value.onloadeddata = () => {
      detectFaces();
    };

    }
  } catch (err) {
    console.error('Error accessing webcam:', err);
  }
};

const stopWebcam = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    webcamActive.value = false;
    faceStore.toggleWebcam(); 
  }
};


onMounted(async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.ageGenderNet.loadFromUri('/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('/models');
});


const detectFaces = async () => {

  if (!video.value || !canvas.value) return;

  const videoElement = video.value;
  const canvasElement = canvas.value;

  const displaySize = { width: videoElement.width, height: videoElement.height };
  faceapi.matchDimensions(canvasElement, displaySize);

  const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withAgeAndGender()
    .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
  canvasElement?.getContext('2d')?.clearRect(0, 0, canvasElement.width, canvasElement.height);
  faceapi.draw.drawDetections(canvasElement, resizedDetections);
  //faceapi.draw.drawFaceLandmarks(canvasElement, resizedDetections);
  faceapi.draw.drawFaceExpressions(canvasElement, resizedDetections);


  setTimeout(() => detectFaces(), 100);

};

onBeforeUnmount(() => {
  stopWebcam();
});
</script>

<style scoped>
.video-container {
  display: flex;
  justify-content: center;
}
</style>

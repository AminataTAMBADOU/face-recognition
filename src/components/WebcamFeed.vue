<template>
  <div class="container text-center mt-4">
    <h3>Live Webcam</h3>
    
    <FaceOverlay :active="webcamActive" @faces-detected="updateFaces" />

    <div class="mt-3">
      <button class="btn btn-primary me-2" @click="webcamActive = true" :disabled="webcamActive">Start</button>
      <button class="btn btn-danger" @click="webcamActive = false" :disabled="!webcamActive">Stop</button>
    </div>

    <div v-if="detectedFaces.length" class="mt-3">
      <div v-for="(face, index) in detectedFaces" :key="index" class="alert alert-info">
        <p><strong>Face #{{ index + 1 }}</strong></p>
        <p>Age: {{ face.age }} years</p>
        <p>Gender: {{ face.gender }}</p>
        <p>Emotion: {{ face.emotion }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FaceOverlay from '@/components/FaceOverlay.vue';

const webcamActive = ref(false);
const detectedFaces = ref<any[]>([]);

const updateFaces = (faces: any[]) => {
  detectedFaces.value = faces;
};
</script>

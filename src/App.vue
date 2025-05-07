<template>
  <div class="container py-4">
    <h1 class="text-center mb-4">Reconnaissance Faciale</h1>
    <WebcamFeed />
  </div>
</template>

<script lang="ts" setup>
import WebcamFeed from './components/WebcamFeed.vue';

import { onMounted } from 'vue';
import { loadModels } from './services/faceApiService';
import { useFaceStore } from './stores/face';

const faceStore = useFaceStore();

onMounted(async () => {
  await loadModels();
  faceStore.setModelsLoaded(true);
});
</script>



// store/face.ts
import { defineStore } from 'pinia';

export const useFaceStore = defineStore('face', {
  state: () => ({
    webcamOn: false,
    faces: [] as any[],
    modelsLoaded: false
  }),
  actions: {
    toggleWebcam() {
      this.webcamOn = !this.webcamOn;
    },
    setFaces(detectedFaces: any[]) {
      this.faces = detectedFaces;
    },
    setModelsLoaded(loaded: boolean) {
      this.modelsLoaded = loaded;
    }
  }
});

import * as faceapi from 'face-api.js';

export const faceApiService = {
  // Load models from the public directory
  async loadModels() {
    const MODEL_URL = '/models'; // Path where models are stored

    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  },

  // Detect faces in the video feed
  async detectFaces(video: HTMLVideoElement) {
    const detections = await faceapi.detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();
    return detections;
  }
};

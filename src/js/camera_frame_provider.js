import { Camera } from '@mediapipe/camera_utils';

export class CameraFrameProvider {
  constructor(videoElement, onFrame) {
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        onFrame(videoElement)
      },
      width: window.innerWidth,
      height: window.innerHeight,
    },);
    this.camera = camera;
  }

  start() {
    this.camera.start();
  }

  stop() {
    this.camera.stop();
  }
}
import "./styles.css";
import { PUBLIC_PATH } from './js/public_path';
import { CameraFrameProvider } from './js/camera_frame_provider';
import { FacemeshLandmarksProvider } from './js/facemesh/landmarks_provider';
import { SceneManager } from "./js/three_components/scene_manager";
import { Glasses } from "./js/three_components/glasses";
import * as THREE from 'three';


const template = `
<div class="video-container">
  <span class="loader">
    Loading ...
  </span>

  <canvas class="output_canvas"></canvas>
  <div class="glasses_choose_container"/>
    <a class="glass_one"></a>
    <a class="glass_one"></a>
    <a class="glass_one"></a>
    <a class="glass_one"></a> 
    <a class="glass_one"></a>
    <a class="glass_one"></a>
    <a class="glass_one"></a>
    <a class="glass_one"></a>
    <a class="glass_one"></a>
    <a class="glass_one"></a>
    <a class="glass_one"></a>
    <a class="glass_one"></a> 
  <div>
    <video class="input_video" controls playsinline>
      <source  src="${PUBLIC_PATH}/video/videoplayback2.mp4">
    </video>
  </div>
</div>
`;

document.querySelector("#app").innerHTML = template;

async function main() {

  document.querySelector(".video-container").classList.add("loading");

  const video = document.querySelector('.input_video');
  const canvas = document.querySelector('.output_canvas');

  const useOrtho = true;
  const debug = false;

  let sceneManager;
  let facemeshLandmarksProvider;
  let videoFrameProvider;

  const onLandmarks = ({image, landmarks}) => {
    sceneManager.onLandmarks(image, landmarks);
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    devicePixelRation: window.devicePixelRatio || 1
  });

  const changeGlass=()=>{
    const glass=new Glasses(sceneManager,renderer.domElement.width,renderer.domElement.height);
    console.log(glass);
    glass.loadGlasses("3d/glasses/scene.gltf");
    glass.needsUpdate=true;
  }

  document.querySelectorAll(".glass_one").forEach(glass=>{
    glass.addEventListener("click",changeGlass)
  })

  const onFrame = async (video) => {
    try {
      await facemeshLandmarksProvider.send(video);
    } catch (e) {
      alert("Not Supported on your device")
      console.error(e);
      videoFrameProvider.stop();      
    }
  }

  function animate () {
    requestAnimationFrame(animate);
    sceneManager.resize(window.innerWidth, window.innerHeight);
    sceneManager.animate();
  }

  sceneManager = new SceneManager(canvas, debug, useOrtho);
  facemeshLandmarksProvider = new FacemeshLandmarksProvider(onLandmarks);

  // unload video
    video.pause();
    video.querySelector("source").remove();
    video.removeAttribute('src');
    video.load();

    videoFrameProvider = new CameraFrameProvider(video, onFrame);
  
  await facemeshLandmarksProvider.initialize();
  videoFrameProvider.start();

  animate();

  document.querySelector(".video-container").classList.remove("loading");
}

main();

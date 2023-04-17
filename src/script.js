import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import Stats from "three/examples/jsm/libs/stats.module";

let container, stats, controls;

const clock = new THREE.Clock();

let camera, scene, renderer;

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let handModel, wrenchModel;

init();
animate();

// ================================

function init() {
  container = document.getElementById("container");

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;

  scene = new THREE.Scene();

  // ===== lights =====
  const lightValues = [
    { color: 0xb85412, intensity: 10, dist: 12, x: 1, y: 0, z: 8 },
    { color: 0x17bfb1, intensity: 10, dist: 12, x: -2, y: 9, z: -10 },
    { color: 0x1566a1, intensity: 10, dist: 10, x: 0, y: 7, z: 1 },
    { color: 0xf5bc42, intensity: 10, dist: 10, x: -7, y: -5, z: -3 },
    { color: 0xff0000, intensity: 30, dist: 10, x: 5, y: -4, z: 5 },
  ];

  lightValues.forEach(({ color, intensity, dist, x, y, z }) => {
    // ===== point lights =====
    const light = new THREE.PointLight(color, intensity, dist);
    light.position.set(x, y, z);
    scene.add(light);

    // ===== light helpers =====
    // const lightHelper = new THREE.PointLightHelper(light, 0.5);
    // scene.add(lightHelper);
  });

  // ===== helpers ======
  // const axesHelper = new THREE.AxesHelper(100);
  // scene.add(axesHelper);

  // ===== materials =====
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
  });

  const wrenchMaterial = new THREE.MeshPhongMaterial({
    color: 0x222222,
    specular: 0xffffff,
    // combine: THREE.MultiplyOperation,
    shininess: 30,
    // specular: 0x111111,
    reflectivity: 0.8,
  });

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    wireframeLinewidth: 100,
    transparent: true,
  });

  // ===== load models =====
  const loader = new STLLoader();
  loader.load(
    "./models/hand_low_poly.stl",
    (geometry) => {
      // fiddle with the size
      const SCALE_FACTOR = 0.12;
      geometry.scale(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);

      const wireframe = new THREE.Mesh(geometry, wireframeMaterial);

      handModel = new THREE.Mesh(geometry, material);
      handModel.add(wireframe); // COMMENT OUT FOR NO WIREFRAME
      scene.add(handModel);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );

  loader.load(
    "./models/wrench.stl",
    (geometry) => {
      // fiddle with the size
      const SCALE_FACTOR = 0.04;
      geometry.scale(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);

      const wireframe = new THREE.Mesh(geometry, wireframeMaterial);

      wrenchModel = new THREE.Mesh(geometry, wrenchMaterial);
      // wrenchModel.add(wireframe); // COMMENT OUT FOR NO WIREFRAME

      // fiddle with the initial position
      wrenchModel.position.x = 2;
      wrenchModel.position.y = 3;
      wrenchModel.position.z = 1;
      wrenchModel.rotation.x = 0;
      wrenchModel.rotation.y = -Math.PI / 10;
      wrenchModel.rotation.z = 0.05;

      scene.add(wrenchModel);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );

  // ===== renderer =====
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputEncoding = THREE.sRGBEncoding; //
  renderer.setPixelRatio(window.devicePixelRatio); //
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // ===== stats =====
  // stats = new Stats();
  // document.body.appendChild(stats.dom);

  // ===== controls =====
  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;

  // ===== listeners =====
  document.addEventListener("mousemove", onDocumentMouseMove);
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function animate() {
  requestAnimationFrame(animate);

  // controls.update(); // UNCOMMENT FOR ORBITAL CONTROLS

  if (handModel) {
    const t = clock.getElapsedTime();
    handModel.position.y = Math.sin(t * 2) * 0.25;
  }

  if (wrenchModel) {
    wrenchModel.rotation.y += 0.01;
  }

  render();
  // stats.update(); // UNCOMMENT FOR STATS
}

function render() {
  camera.position.x = mouseX / windowHalfX;
  camera.position.y = -mouseY / windowHalfY;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

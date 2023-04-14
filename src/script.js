import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const directionalLight = new THREE.DirectionalLight();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
// scene.add(directionalLight);
// scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const material = new THREE.MeshLambertMaterial({
  color: 0x00ffff,
});

const loader = new STLLoader();
loader.load(
  "./models/hand_low_poly.stl",
  function (geometry) {
    const SCALE_FACTOR = 0.12;
    geometry.scale(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();

// AXES HELPER
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Lights
const lights = [];
const lightHelpers = [];
const lightValues = [
  { colour: 0xb85412, intensity: 8, dist: 12, x: 1, y: 0, z: 8 },
  { colour: 0x17bfb1, intensity: 6, dist: 12, x: -2, y: 1, z: -10 },
  { colour: 0x1566a1, intensity: 3, dist: 10, x: 0, y: 10, z: 1 },
  { colour: 0x541cbd, intensity: 6, dist: 12, x: 0, y: -10, z: -1 },
  { colour: 0xad18a8, intensity: 6, dist: 12, x: 10, y: 3, z: 0 },
  { colour: 0xb51638, intensity: 6, dist: 12, x: -10, y: -1, z: 0 },
];
for (let i = 0; i < 6; i++) {
  lights[i] = new THREE.PointLight(
    lightValues[i]["colour"],
    lightValues[i]["intensity"],
    lightValues[i]["dist"]
  );
  lights[i].position.set(
    lightValues[i]["x"],
    lightValues[i]["y"],
    lightValues[i]["z"]
  );
  scene.add(lights[i]);

  //Helpers
  lightHelpers[i] = new THREE.PointLightHelper(lights[i], 0.7);
  scene.add(lightHelpers[i]);
}

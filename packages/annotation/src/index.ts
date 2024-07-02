import * as THREE from "three";
import { a } from "./utils/a";
import { b } from "./utils/b";

function add(a: number, b: number) {
  console.log(a + b);
}

function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export { add, init, a, b };

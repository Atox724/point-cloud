import { debounce } from "lodash-es";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  GridHelper,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default abstract class View {
  container: Element;

  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  controller: OrbitControls;
  resizeObserver: ResizeObserver;
  constructor() {
    this.container = document.body;

    this.renderer = new WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });

    this.scene = new Scene();
    this.scene.background = new Color(0x000000);
    const ambientLight = new AmbientLight(0xffffff, 0.8);
    const directionalLight = new DirectionalLight(0xffffff, 0.8);
    this.scene.add(ambientLight, directionalLight);

    this.camera = new PerspectiveCamera();
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(-22, 0, 10);

    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    this.controller.update();

    this.resizeObserver = new ResizeObserver(
      debounce(() => {
        this.updateDimensions();
      }, 200)
    );

    const gridHelper = new GridHelper(100, 100, 0xffffff, 0xffffff);
    gridHelper.rotation.x = Math.PI / 2;
    this.scene.add(gridHelper);
  }

  initialize(dom: string | Element) {
    if (typeof dom === "string") {
      const el = document.querySelector(dom);
      if (!el) throw new Error(`DOM not found: ${dom}`);
      this.container = el;
    } else {
      this.container = dom;
    }
    this.updateDimensions();
    this.container.appendChild(this.renderer.domElement);

    this.resizeObserver.observe(this.container);

    this.renderer.setAnimationLoop(() => {
      this.render();
    });
  }

  updateDimensions() {
    const { width, height } = this.container.getBoundingClientRect();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.controller.update();
    this.controller.saveState();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.clear();
    this.renderer.domElement.remove();
    this.renderer.dispose();
    this.controller.dispose();
    this.resizeObserver.disconnect();
  }
}

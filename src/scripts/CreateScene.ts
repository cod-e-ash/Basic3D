import { Cabinet } from './Cabinet';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  Color,
  OrthographicCamera,
  Camera
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PowerStrip, Orientation } from "./PowerStrip";


export enum CameraType {
  OrthographicCamera = "OrthographicCamera",
  PerspectiveCamera = "PerspectiveCamer"
}

export class CreateScene {
  frustumSize = window.innerWidth * 0.6;
  aspect = window.innerWidth / 2 / (window.innerHeight * 0.8);
  canvas = <HTMLCanvasElement>document.getElementById("canvas");
  scene = new Scene();
  controls: OrbitControls;
  renderer: WebGLRenderer;
  camera: Camera;

  constructor(private powerStrips: PowerStrip[]) {
    this.canvas.style.borderWidth = "5px";
    this.canvas.style.borderColor = "black";
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(this.aspect);
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.8);
  }

  public createScene = (
    cameraType: CameraType = CameraType.OrthographicCamera
  ) => {
    const orientation = Orientation.Vertical;
    this.scene.background = new Color("0x1111dd");
    this.scene.add(Cabinet.createRack(orientation));
    this.powerStrips.map(powerStrip => this.scene.add(PowerStrip.create(powerStrip, orientation)));
    this.scene.add(new AmbientLight(0xddffdd, 50));
    this.camera = this.getCamera(cameraType);
    this.controls = new OrbitControls(this.camera, this.canvas);
  };

  getCamera = (cameraType: CameraType): Camera => {
    if (cameraType === CameraType.OrthographicCamera)
      return this.orthographicCamera();
    if (cameraType === CameraType.PerspectiveCamera)
      return this.prespectiveCamera();
  };

  public orthographicCamera = (): Camera => {
    const ocamera = new OrthographicCamera(
      (this.frustumSize * this.aspect) / -2,
      (this.frustumSize * this.aspect) / 2,
      this.frustumSize / 2,
      this.frustumSize / -2,
      0.1,
      4000
    );
    ocamera.position.set(0, 0, 800);
    return ocamera;
  };

  prespectiveCamera = () => {
    const pcamera = new PerspectiveCamera(45, this.aspect, 1, 3000);
    pcamera.position.z = 1100;
    return pcamera;
  };

  // Render
  public animate = () => {
    requestAnimationFrame(this.animate);
    this.render();
  };

  private render = () => {
    // this.rotateCube();
    // this.renderer.render(this.scene, this.ocamera);
    this.renderer.render(this.scene, this.camera);
  };

  private rotateCube = () => {
    // this.mesh.rotation.x +=0.01;
    // this.mesh.rotation.y +=0.01;
  };

  public onWindowResize: EventListener = () => {
    this.camera.updateMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
}

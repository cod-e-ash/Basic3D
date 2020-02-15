import { PowerStrip, Orientation } from "./PowerStrip";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  MeshLambertMaterial,
  AmbientLight,
  SphereBufferGeometry,
  PointLight,
  DirectionalLight,
  MeshPhongMaterial,
  Box2,
  Vector2,
  LineBasicMaterial,
  Line,
  EdgesGeometry,
  LineSegments,
  Color,
  OrthographicCamera,
  BoxBufferGeometry,
  TextureLoader,
  Camera,
  Texture,
  Material,
  Box3,
  Vector3,
  FaceColors,
  Geometry
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export enum CameraType {
  OrthographicCamera = "OrthographicCamera",
  PerspectiveCamera = "PerspectiveCamer"
}

export enum BoxType {
  LineSegments = "LineSegments",
  Mesh = "Mesh"
}

export enum Position {
  Left = -1,
  Right = 1
}

export class CreateSocket {
  frustumSize = window.innerWidth * 0.3;
  aspect = window.innerWidth / 2 / (window.innerHeight * 0.8);
  canvas = <HTMLCanvasElement>document.getElementById("canvas");
  scene = new Scene();
  controls: OrbitControls;
  renderer: WebGLRenderer;
  lineBasicMaterial: Material;
  boxGeo: Geometry;
  camera: Camera;
  socketTexture: Texture;
  cubeMaterial = [];
  socketSize = 24;
  socketWidth: number;
  maxContainerLength: number;
  containerHeight: number;
  transparentMaterial: Material;

  constructor(private powerStrip: PowerStrip) {
    this.canvas.style.borderWidth = "5px";
    this.canvas.style.borderColor = "black";
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(this.aspect);
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.8);
    this.socketTexture = new TextureLoader().load("../data/Socket4.png");
    this.caculateDimensions();
    this.setGeometry();
    this.setMaterials();
  }

  setGeometry = () => {
    this.boxGeo = new BoxGeometry(
      this.socketSize,
      this.socketSize,
      this.socketSize
    );
  };

  setMaterials = () => {
    this.lineBasicMaterial = new LineBasicMaterial({
      color: 0x000000,
      linewidth: 10
    });
    this.transparentMaterial = new MeshBasicMaterial({
      color: 0x8d8380,
      transparent: true,
      opacity: 0.2
    });
    const meshPNGMaterialRed = new MeshBasicMaterial({
      map: this.socketTexture,
      transparent: true,
      opacity: 0.9,
      color: 0xff6666
    });
    const meshPNGMaterialGreen: MeshBasicMaterial = meshPNGMaterialRed.clone();
    meshPNGMaterialGreen.color.setHex(0x80ff80);
    const meshSolidWhite = new MeshBasicMaterial({
      color: 0xffffe6,
      vertexColors: FaceColors
    });
    this.cubeMaterial = [
      meshSolidWhite,
      meshSolidWhite,
      meshSolidWhite,
      meshSolidWhite,
      meshPNGMaterialGreen,
      meshPNGMaterialRed
    ];
  };

  public caculateDimensions = () => {
    if (this.powerStrip.numberOfSockets > 12) this.socketSize = 15;
    this.socketWidth = this.socketSize + this.socketSize * 0.15;
    this.maxContainerLength =
      this.powerStrip.numberOfSockets * this.socketWidth + 5;
  };

  public createScene = (
    cameraType: CameraType = CameraType.OrthographicCamera
  ) => {
    this.scene.background = new Color("0x1111dd");
    const powerStrip1 = new PowerStrip(24, Orientation.Vertical);
    const powerStrip2 = new PowerStrip(24, Orientation.Vertical);
    const container1 = this.createContainer(0, powerStrip1);
    const container2 = this.createContainer(1, powerStrip2);
    this.scene.add(this.createRack());
    this.addBoxes(container1, powerStrip1, BoxType.Mesh);
    this.addBoxes(container2, powerStrip2, BoxType.Mesh);
    this.scene.add(container1);
    this.scene.add(container2);
    this.scene.add(new AmbientLight(0xddffdd, 50));
    this.camera = this.getCamera(cameraType);
    this.controls = new OrbitControls(this.camera, this.canvas);
  };

  public createLineBox = (): LineSegments => {
    const edgeBoxGeo = new EdgesGeometry(this.boxGeo, 10);
    return new LineSegments(edgeBoxGeo, this.lineBasicMaterial);
  };

  public createMeshBox = (): Mesh => {
    return new Mesh(this.boxGeo, this.cubeMaterial);
  };

  getCamera = (cameraType: CameraType): Camera => {
    if (cameraType === CameraType.OrthographicCamera)
      return this.orthographicCamera();
    if (cameraType === CameraType.PerspectiveCamera)
      return this.prespectiveCamera();
  };

  public createContainer = (index: number = 0, powerStrip: PowerStrip) => {
    let position = Position.Left;
    if(index%2 !== 0) position = Position.Right;
    const containerGeo = new BoxBufferGeometry(
      this.maxContainerLength,
      this.socketWidth + 1,
      this.socketWidth
    );
    const containerEdgeGeo = new EdgesGeometry(containerGeo, 10);
    // this.container = new LineSegments(containerEdgeGeo, this.edgeMaterial);
    const container = new LineSegments(containerEdgeGeo, this.lineBasicMaterial);
    container.position.x = this.socketWidth * 7 * position;
    if (powerStrip.orientation === Orientation.Vertical) {
      container.rotateZ(Math.PI / 2);
    }
    return container;
  };

  public addBoxes = (container, powerStrip: PowerStrip, boxType: BoxType) => {
    const box3 = new Box3();
    box3.setFromObject(container);
    const size = box3.getSize(new Vector3());
    const boxSize = powerStrip.orientation === Orientation.Vertical ? size.y : size.x;
    let curPosition = (boxSize / 2) * -1 + this.socketWidth / 2 + 2;

    for (let i = 0; i < powerStrip.numberOfSockets; i++) {
      const box = this.createBox(boxType);
      if(powerStrip.orientation === Orientation.Vertical) 
      {
        box.position.x = curPosition;
        box.rotateZ(Math.PI/2*-1);
      }
      else box.position.y = curPosition;
      container.add(box);
      curPosition += this.socketWidth;
    }
  };

  public createRack = (): Mesh => {
    const rackGeometry = new BoxBufferGeometry(this.socketWidth*7, this.maxContainerLength, this.socketSize*4);
    return new Mesh(rackGeometry, this.transparentMaterial);
  };

  public createBox = (boxType: BoxType) => {
    if (boxType === BoxType.LineSegments) return this.createLineBox();
    else if (boxType === BoxType.Mesh) return this.createMeshBox();
  };

  public orthographicCamera = (): Camera => {
    const ocamera = new OrthographicCamera(
      (this.frustumSize * this.aspect) / -2,
      (this.frustumSize * this.aspect) / 2,
      this.frustumSize / 2,
      this.frustumSize / -2,
      1,
      1000
    );
    ocamera.position.set(0, 0, 200);
    return ocamera;
  };

  prespectiveCamera = () => {
    const pcamera = new PerspectiveCamera(40, this.aspect, 1, 1000);
    pcamera.position.z = 700;
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

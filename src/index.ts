import { Socket, CameraType } from "./scripts/basic-3d";

const basic3D = new Socket(24);
basic3D.createScene(CameraType.PerspectiveCamera);
basic3D.animate();

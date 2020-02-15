import { PowerStrip, Orientation } from './scripts/PowerStrip';
import { CreateSocket, CameraType } from "./scripts/CreateSocket";

const powerStrip = new PowerStrip(24, Orientation.Vertical);
const basic3D = new CreateSocket(powerStrip);
basic3D.createScene(CameraType.PerspectiveCamera);
window.addEventListener('resize', basic3D.onWindowResize)
basic3D.animate();

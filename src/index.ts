import { PowerStrip } from './scripts/PowerStrip';
import { CreateScene, CameraType } from './scripts/CreateScene';

const powerStrip1 = new PowerStrip(24, 0);
const powerStrip2 = new PowerStrip(20, 1);
const basic3D = new CreateScene([powerStrip1, powerStrip2]);
basic3D.createScene(CameraType.PerspectiveCamera);
window.addEventListener('resize', basic3D.onWindowResize);
basic3D.animate();
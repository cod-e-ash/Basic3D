import { PowerStrip } from './scripts/PowerStrip';
import { CreateScene, CameraType } from './scripts/CreateScene';

const powerStrip1 = new PowerStrip('Power Strip', 24, 0);
const powerStrip2 = new PowerStrip('Power Strip', 4, 1);
powerStrip2.Sockets = [{ Name: 'Socket 1', Occupied: false }, { Name: 'Socket 2', Occupied: true }, { Name: 'Socket 3', Occupied: false }]
const powerStrip3 = new PowerStrip('Power Strip', 24, 2);
const powerStrip4 = new PowerStrip('Power Strip', 26, 3);
const powerStrip5 = new PowerStrip('Power Strip', 21, 4);
const basic3D = new CreateScene([powerStrip1, powerStrip2, powerStrip3, powerStrip4, powerStrip5]);
basic3D.createScene(CameraType.OrthographicCamera);
window.addEventListener('resize', basic3D.onWindowResize);
basic3D.animate();
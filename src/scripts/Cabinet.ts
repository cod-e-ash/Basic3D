import { Orientation } from './PowerStrip';
import { Mesh } from 'three';
import { Geometries } from './Geometries';
import { Materials } from './Materials';

export class Cabinet {
  public static createRack = (orientation: Orientation): Mesh => {
    const cabinet = new Mesh(Geometries.cabinetGeometry, Materials.transparentMaterial);
    if (orientation === Orientation.Horizontal) {
      cabinet.position.x += Geometries.socketWidth * 15;
    }
    return cabinet;
  };
}

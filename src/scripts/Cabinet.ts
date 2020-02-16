import { Orientation } from './PowerStrip';
import { Mesh, Vector3, Box3 } from 'three';
import { Geometries } from './Geometries';
import { Materials } from './Materials';

export class Cabinet {
  static noOfUnits: number = 42;

  public static create = (orientation: Orientation): Mesh => {
    const cabinet = new Mesh(Geometries.cabinetGeometry, Materials.transparentMaterial);
    if (orientation === Orientation.Horizontal) {
      cabinet.position.x += Geometries.socketWidth * 15;
    }
    Cabinet.createRacks(cabinet);
    return cabinet;
  }

  public static createRacks = (cabinet: Mesh) => 
  {
    const box3 = new Box3();
    const size = box3.getSize(new Vector3());
    let curPosition = -300
    for(let i=0; i < Cabinet.noOfUnits; i++)
    {
      const rack = new Mesh(Geometries.rackGeometry, Materials.meshRack);
      rack.position.y = curPosition;
      curPosition += Geometries.socketWidth;
      cabinet.add(rack);
    }
  }
}

import { Geometries } from './Geometries';
import { Materials } from './Materials';
import { Mesh, LineSegments, EdgesGeometry, BoxBufferGeometry, Vector3, Box3 } from 'three';

export enum Orientation {
  Horizontal = 'Horizontal',
  Vertical = 'Vertical'
}
export enum BoxType {
  LineSegments = 'LineSegments',
  Mesh = 'Mesh'
}

export enum Position {
  Left = -1,
  Right = 1
}

export interface IPowerStrip {
  numberOfSockets: number;
  index: number;
}

export class PowerStrip {
  constructor(public numberOfSockets: number = 24, public index: number = 0) {}

  static create = (powerStrip: IPowerStrip, orientation: Orientation) => {
    // Create Container
    const container = PowerStrip.createContainer(powerStrip, orientation);

    // Create sockets and add them
    PowerStrip.addSockets(container, powerStrip, orientation, BoxType.Mesh);

    return container;
  };

  public static createContainer = (powerStrip: IPowerStrip, orientation: Orientation) => {
    // Container Geometry
    let containerGeometry: BoxBufferGeometry;
    if (orientation === Orientation.Horizontal) {
      containerGeometry = new BoxBufferGeometry(
        Geometries.socketWidth * powerStrip.numberOfSockets + 5,
        Geometries.socketWidth,
        Geometries.socketWidth
      );
    } else {
      containerGeometry = new BoxBufferGeometry(
        Geometries.socketWidth * powerStrip.numberOfSockets + 5,
        Geometries.socketWidth,
        Geometries.socketWidth
      );
    }

    // If Mesh
    // const container = new Mesh(containerGeometry, Materials.meshSolidWhite);

    // If Line
    const containerEdgeGeo = new EdgesGeometry(containerGeometry, 10);
    const container = new LineSegments(containerEdgeGeo, Materials.lineBasicMaterial);

    let position = Position.Left;
    if (orientation === Orientation.Horizontal) {
      container.position.x -=
        Geometries.socketWidth * 4 -
        (Geometries.socketWidth * (24 - powerStrip.numberOfSockets)) / 2;
      container.position.y = Geometries.socketWidth * powerStrip.index * 2;
    } else {
      if (powerStrip.index % 2 !== 0) position = Position.Right;
      container.position.x = Geometries.socketWidth * 10 * position;
      container.position.y -= (Geometries.socketWidth * (24 - powerStrip.numberOfSockets)) / 2;
      container.rotateZ(Math.PI / 2);
    }
    return container;
  };

  public static addSockets = (
    container,
    powerStrip: IPowerStrip,
    orientation: Orientation,
    boxType: BoxType
  ) => {
    const box3 = new Box3();
    box3.setFromObject(container);
    const size = box3.getSize(new Vector3());
    const boxSize = orientation === Orientation.Vertical ? size.y : size.x;
    let curPosition = (boxSize / 2) * -1 + Geometries.socketWidth / 2 + 2;

    for (let i = 0; i < powerStrip.numberOfSockets; i++) {
      const box = PowerStrip.createSocket(boxType);
      box.position.x = curPosition;
      if (orientation === Orientation.Vertical) {
        box.rotateZ((Math.PI / 2) * -1);
      }
      container.add(box);
      curPosition += Geometries.socketWidth;
    }
  };

  public static createSocket = (boxType: BoxType) => {
    if (boxType === BoxType.LineSegments) return PowerStrip.createLineBox();
    else if (boxType === BoxType.Mesh) return PowerStrip.createMeshBox();
  };

  public static createLineBox = (): LineSegments => {
    const edgeBoxGeo = new EdgesGeometry(Geometries.socketGeometry, 10);
    return new LineSegments(edgeBoxGeo, Materials.lineBasicMaterial);
  };

  public static createMeshBox = (): Mesh => {
    return new Mesh(Geometries.socketGeometry, Materials.cubeMaterial);
  };
}

import { BoxGeometry, Geometry, EdgesGeometry } from 'three';

export class Geometries {
  static socketSize = 24;
  static socketWidth = Geometries.socketSize + Geometries.socketSize * 0.15;

  static socketGeometry: Geometry = new BoxGeometry(
    Geometries.socketSize,
    Geometries.socketSize,
    Geometries.socketSize
  );

  //   static socketContainerLineGeometry = new EdgesGeometry(Geometries.socketGeometry, 10);

  static cabinetGeometry: Geometry = new BoxGeometry(
    Geometries.socketWidth * 7,
    Geometries.socketWidth * 24 + 5,
    Geometries.socketWidth * 4
  );

  static rackGeometry: Geometry = new BoxGeometry(
    Geometries.socketWidth * 7,
    Geometries.socketWidth / 2,
    Geometries.socketWidth * 4 - 1
  );
}

import {
  Material,
  LineBasicMaterial,
  MeshBasicMaterial,
  Texture,
  TextureLoader,
  FaceColors
} from 'three';

export class Materials {
  static socketTexture: Texture = new TextureLoader().load('../data/Socket4.png');

  static lineBasicMaterial: Material = new LineBasicMaterial({
    color: 0x000000,
    linewidth: 10
  });
  static transparentMaterial: Material = new MeshBasicMaterial({
    color: 0x8d8380,
    transparent: true,
    opacity: 0.1,
    depthWrite: false
  });
  static meshPNGMaterialRed: Material = new MeshBasicMaterial({
    map: Materials.socketTexture,
    transparent: true,
    opacity: 0.9,
    color: 0xff6666
  });
  static meshPNGMaterialGreen: Material = new MeshBasicMaterial({
    map: Materials.socketTexture,
    transparent: true,
    opacity: 0.9,
    color: 0x80ff80
  });
  static meshSolidWhite = new MeshBasicMaterial({
    color: 0xffffe6,
    vertexColors: FaceColors
  });
  static meshRack = new MeshBasicMaterial({
    color: 0x6D727F,
    transparent: true,
    opacity: 0.2,
  });

  static cubeMaterial = [
    Materials.meshSolidWhite,
    Materials.meshSolidWhite,
    Materials.meshSolidWhite,
    Materials.meshSolidWhite,
    Materials.meshPNGMaterialGreen,
    Materials.meshPNGMaterialRed
  ];
}

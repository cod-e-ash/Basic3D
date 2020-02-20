import
{
    Material,
    LineBasicMaterial,
    MeshBasicMaterial,
    Texture,
    TextureLoader,
    FaceColors,
    MeshPhongMaterial,
    FontLoader
}
from 'three';

export enum MaterialColour
{
    Red = 0xff6666,
        Green = 0x80ff80,
        Blue = 0x00AAFF
}

export class Materials
{
    static socketTexture: Texture = new TextureLoader().load('../data/SquareCutout.png');
    static plugTextureRight: Texture = new TextureLoader().load('../data/PlugR.png');
    static plugTextureLeft: Texture = new TextureLoader().load('../data/PlugL.png');
    static wireOutletTextureLeft: Texture = new TextureLoader().load('../data/WireOutletLeft.png');
    static wireOutletTextureRight: Texture = new TextureLoader().load('../data/WireOutletRight.png');

    static lineBasicMaterial: Material = new LineBasicMaterial(
    {
        color: 0x000000,
        linewidth: 10
    });
    static transparentMaterial: Material = new MeshBasicMaterial(
    {
        color: 0x8d8380,
        transparent: true,
        opacity: 0.1,
        depthWrite: false
    });

    static transparentMaterialAbsolute: Material = new MeshBasicMaterial(
    {
        color: 0x8d8380,
        transparent: true,
        opacity: 0.01,
        depthWrite: false
    });

    static meshSocketMaterialRed: Material = new MeshBasicMaterial(
    {
        map: Materials.socketTexture,
        transparent: true,
        opacity: 0.9,
        color: MaterialColour.Red
    });
    static meshSocketMaterialBlue: Material = new MeshBasicMaterial(
        {
            map: Materials.socketTexture,
            transparent: true,
            opacity: 0.9,
            color: MaterialColour.Blue
        });
    static meshSocketMaterialGreen: Material = new MeshBasicMaterial(
    {
        map: Materials.socketTexture,
        transparent: true,
        opacity: 0.9,
        color: MaterialColour.Blue
    });

    static meshSocketMaterialWhite: Material = new MeshBasicMaterial(
    {
        map: Materials.socketTexture,
        transparent: true,
        opacity: 0.9,
        // color: MaterialColour.Green
    });

    static meshSolidWhite = new MeshBasicMaterial(
    {
        color: 0xffffe6,
        vertexColors: FaceColors
    });
    static meshRack = new MeshBasicMaterial(
    {
        color: 0x6D727F,
        transparent: true,
        opacity: 0.2,
    });

    // static cubeMaterialRed = [
    //     Materials.meshPNGMaterialRed,
    //     Materials.meshPNGMaterialRed,
    //     Materials.meshPNGMaterialRed,
    //     Materials.meshPNGMaterialRed,
    //     Materials.meshPNGMaterialRed,
    //     Materials.meshPNGMaterialRed
    // ];

    static meshPlugMaterialRight: Material = new MeshBasicMaterial(
    {
        map: Materials.plugTextureRight,
        transparent: true,
        opacity: 0.9,
        // color: 0x80ff80
    });
    static meshPlugMaterialLeft: Material = new MeshBasicMaterial(
    {
        map: Materials.plugTextureLeft,
        transparent: true,
        opacity: 0.9,
        // color: 0x80ff80
    });

    static plugMaterial = [
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.meshPlugMaterialRight,
        Materials.meshPlugMaterialLeft

    ];

    // static plugMaterialRight = [
    //     Materials.transparentMaterialAbsolute,
    //     Materials.transparentMaterialAbsolute,
    //     Materials.transparentMaterialAbsolute,
    //     Materials.transparentMaterialAbsolute,
    //     Materials.meshPlugMaterialLeft,
    //     Materials.meshPlugMaterialRight
    // ];

    static meshWireOutletMaterialRight: Material = new MeshBasicMaterial(
    {
        map: Materials.wireOutletTextureRight,
        transparent: true,
        opacity: 0.9,
        // color: 0x80ff80
    });
    static meshWireOutletMaterialLeft: Material = new MeshBasicMaterial(
    {
        map: Materials.wireOutletTextureLeft,
        transparent: true,
        opacity: 0.9,
        // color: 0x80ff80
    });

    static wireOutletMaterial = [
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.meshWireOutletMaterialLeft,
        Materials.meshWireOutletMaterialRight
    ];

    // static wireOutletMaterialLeft = [
    //     Materials.transparentMaterialAbsolute,
    //     Materials.transparentMaterialAbsolute,
    //     Materials.transparentMaterialAbsolute,
    //     Materials.transparentMaterialAbsolute,
    //     Materials.meshWireOutletMaterialLeft,
    //     Materials.meshWireOutletMaterialRight
    // ];
}
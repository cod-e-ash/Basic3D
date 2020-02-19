import
{
    Material,
    LineBasicMaterial,
    MeshBasicMaterial,
    Texture,
    TextureLoader,
    FaceColors
}
from 'three';

export class Materials
{
    static socketTexture: Texture = new TextureLoader().load('../data/Socket4.png');
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

    static meshPNGMaterialRed: Material = new MeshBasicMaterial(
    {
        map: Materials.socketTexture,
        transparent: true,
        opacity: 0.9,
        color: 0xff6666
    });
    static meshPNGMaterialGreen: Material = new MeshBasicMaterial(
    {
        map: Materials.socketTexture,
        transparent: true,
        opacity: 0.9,
        color: 0x80ff80
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

    static cubeMaterial = [
        Materials.meshSolidWhite,
        Materials.meshSolidWhite,
        Materials.meshSolidWhite,
        Materials.meshSolidWhite,
        Materials.meshPNGMaterialGreen,
        Materials.meshPNGMaterialRed
    ];

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

    static plugMaterialLeft = [
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.meshPlugMaterialRight,
        Materials.meshPlugMaterialLeft
        
    ];

    static plugMaterialRight = [
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.transparentMaterialAbsolute,
        Materials.meshPlugMaterialLeft,
        Materials.meshPlugMaterialRight
    ];

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
}
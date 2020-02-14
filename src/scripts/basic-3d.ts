import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, MeshLambertMaterial, AmbientLight, SphereBufferGeometry, PointLight, DirectionalLight, MeshPhongMaterial, Box2, Vector2, LineBasicMaterial, Line, EdgesGeometry, LineSegments, Color, OrthographicCamera, BoxBufferGeometry, TextureLoader, Camera, Texture, Material, Box3, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

export enum CameraType {
    OrthographicCamera = 'OrthographicCamera',
    PerspectiveCamera = 'PerspectiveCamer'
}

export enum BoxType {
    LineSegments = 'LineSegments',
    Mesh = 'Mesh'
}

export class Socket {
    frustumSize = 300;
    aspect = window.innerWidth / window.innerHeight;
    canvas = <HTMLCanvasElement>document.getElementById('canvas');
    scene = new Scene();
    controls: OrbitControls;
    renderer: WebGLRenderer;
    edgeMaterial;
    boxGeo;
    camera: Camera;
    container : LineSegments;
    socketTexture: Texture;
    cubeMaterial = [];
    box3 = new Box3();
    socketSize = 24;
    socketWidth;

    constructor(public numberOfSockets: number = 24)
    {
        this.canvas.style.borderWidth = '5px';
        this.canvas.style.borderColor = 'black';
        this.renderer = new WebGLRenderer({canvas: this.canvas});
        this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);
        this.socketTexture = new TextureLoader().load('../data/Socket4.png');
        this.caculateDimensions();
        this.setGeometry();
        this.setMaterials();
        
    }

    setMaterials = () =>
    {
        this.edgeMaterial = new LineBasicMaterial({color: 0x000000, linewidth: 10});
        const meshMaterial = new MeshBasicMaterial({map: this.socketTexture});
        const meshSolidWhite = new MeshBasicMaterial({color: '0x000000'});
        this.cubeMaterial = [meshSolidWhite, meshSolidWhite, meshMaterial, meshMaterial, meshMaterial, meshMaterial];
    }

    setGeometry = () =>
    {
        this.boxGeo = new BoxGeometry(this.socketSize, this.socketSize, this.socketSize);

    }

    public caculateDimensions = () =>
    {
        if(this.numberOfSockets > 12) this.socketSize = 15;
        this.socketWidth = this.socketSize + (this.socketSize * 0.15);
    }

    public createScene = (cameraType: CameraType = CameraType.OrthographicCamera) =>
    {
        this.scene.background = new Color('0x1111dd');
        this.createContainer();
        this.addBoxes(BoxType.Mesh);
        this.scene.add( this.container );
        
        this.scene.add( new AmbientLight( 0xddffdd, 50 ) );
        this.camera = this.getCamera(cameraType);
        this.controls = new OrbitControls(this.camera, this.canvas);
    }

    public createLineBox = (): LineSegments => 
    {
        const edgeBoxGeo = new EdgesGeometry(this.boxGeo, 10);
        return new LineSegments(edgeBoxGeo, this.edgeMaterial);
    }

    public createMeshBox = (): Mesh => 
    {
        return new Mesh(this.boxGeo, this.cubeMaterial);
    }

    getCamera = (cameraType: CameraType): Camera =>
    {
        if(cameraType === CameraType.OrthographicCamera) return this.orthographicCamera();
        if(cameraType === CameraType.PerspectiveCamera) return this.prespectiveCamera();
    }

    public createContainer = () =>
    {
        const maxSize = this.numberOfSockets * this.socketWidth + 5;
        const containerGeo = new BoxBufferGeometry(maxSize, this.socketWidth, this.socketWidth);
        const containerEdgeGeo = new EdgesGeometry(containerGeo, 10);
        this.container = new LineSegments(containerEdgeGeo, this.edgeMaterial);
    }

    public addBoxes = (boxType: BoxType) =>
    {
        this.box3.setFromObject(this.container);
        const size = this.box3.getSize(new Vector3());
        let curPosition = (size.x / 2 * -1) + (this.socketWidth)/2 + 2; 

        for(let i = 0; i < this.numberOfSockets; i++)
        {
            const box = this.createBox(boxType);
            box.position.x = curPosition;
            this.container.add(box);
            curPosition += this.socketWidth;
        }
    }

    public createBox = (boxType: BoxType) =>
    {
        if(boxType === BoxType.LineSegments) return this.createLineBox();
        else if(boxType === BoxType.Mesh) return this.createMeshBox();
    }

    public orthographicCamera = (): Camera =>
    {
        const ocamera = new OrthographicCamera(this.frustumSize * this.aspect / - 2, this.frustumSize * this.aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 1, 1000);
        ocamera.position.set(0, 0, 200);
        return ocamera;
    }
    
    prespectiveCamera = () => 
    {
        const pcamera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
        pcamera.position.z = 400;
        return pcamera;
    }

    // Render
    public animate = () =>
    {
        requestAnimationFrame(this.animate);
        this.render();
    }

    private render = () =>
    {
        // this.rotateCube();
        // this.renderer.render(this.scene, this.ocamera);
        this.renderer.render(this.scene, this.camera);
    }

    private rotateCube = () =>
    {
        // this.mesh.rotation.x +=0.01;
        // this.mesh.rotation.y +=0.01;
    }

}




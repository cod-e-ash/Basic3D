import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'

export class Basic3D {
    scene = new Scene();
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1100);

    renderer: WebGLRenderer;
    geometry = new BoxGeometry(700, 200, 200, 10, 10, 10);
    material = new MeshBasicMaterial({color: 0xffffff} );
    cube: Mesh;
    canvas: HTMLCanvasElement;

    public create = () =>
    {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.renderer = new WebGLRenderer({canvas: this.canvas});
        this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);
        this.cube = new Mesh(this.geometry, this.material);
        this.cube.rotateX(5);
        this.scene.add(this.cube);
        this.camera.position.z = 1000;
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
        this.renderer.render(this.scene, this.camera);
    }

    private rotateCube = () =>
    {
        this.cube.rotation.x +=0.01;
        this.cube.rotation.y +=0.01;
    }

}




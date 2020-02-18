import { Cabinet } from './Cabinet';
import
{
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    OrthographicCamera,
    Camera,
    Mesh,
    BoxBufferGeometry,
    Vector3,
    Box3,
    CatmullRomCurve3,
    Line,
    BufferGeometry,
    BufferAttribute,
    LineBasicMaterial,
    Vector4,
    Matrix4,
}

from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

import { PowerStrip, Orientation, Position } from './PowerStrip';
import { Materials } from './Materials';
import { Geometries } from './Geometries';

export enum CameraType
{
    OrthographicCamera = 'OrthographicCamera',
        PerspectiveCamera = 'PerspectiveCamer'
}

export class Connections
{
    rack: [{} ? ];
    constructor()
    {
        this.rack = [];
    }
}

export class CreateScene
{
    frustumSize = window.innerWidth * 0.6;
    aspect = window.innerWidth / 2 / (window.innerHeight * 0.8);
    canvas = < HTMLCanvasElement > document.getElementById('canvas');
    scene = new Scene();
    controls: OrbitControls;
    renderer: WebGLRenderer;
    camera: Camera;
    hiding;
    transformControl: TransformControls;
    wires = [];
    plugs = [];
    wireOutlets = [];
    splinePointsLength = 2;
    positions = [];
    ARC_SEGMENTS = 200;
    point = new Vector3();
    minX = 0;
    maxX = 0;
    connections: Connections = new Connections();
    cabinet: Mesh;
    dragging = false;
    curSocket: Mesh;
    curPlug: Mesh;
    oldPlugPosition: Vector3 = new Vector3();
    rackSize;

    constructor(private powerStrips: PowerStrip[])
    {
        this.canvas.style.borderWidth = '5px';
        this.canvas.style.borderColor = 'black';
        this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setPixelRatio(this.aspect);
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.8);
        // document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    }

    public createScene = (cameraType: CameraType = CameraType.OrthographicCamera) =>
    {
        const orientation = Orientation.Vertical;
        this.scene.background = new Color('0x1111dd');
        this.cabinet = Cabinet.create(orientation);
        this.scene.add(this.cabinet);

        // Get Rack size, to attach wire outlet and the end
        let box3 = new Box3();
        box3.setFromObject(this.cabinet);
        this.rackSize = box3.getSize(new Vector3());

        this.powerStrips.map(powerStrip =>
        {
            powerStrip['container'] = PowerStrip.create(powerStrip, orientation);
            this.scene.add(powerStrip['container']);
        });
        this.updateConnections(1, 1, 1);
        // this.scene.add(new AmbientLight(0xddffdd, 50));
        this.camera = this.getCamera(cameraType);
        this.controls = new OrbitControls(this.camera, this.canvas);


        this.controls.dampingFactor = 0.2;
        this.controls.addEventListener("change", this.render);

        // this.controls.addEventListener("start", () =>
        // {
        //     this.cancelHideTransform();
        // });

        // this.controls.addEventListener("end", () =>
        // {
        //     this.delayHideTransform();
        // });

        this.createCablesAndSockets(this.cabinet, this.powerStrips);

        let dragcontrols = new DragControls(
            this.plugs,
            this.camera,
            this.renderer.domElement
        ); //

        dragcontrols.addEventListener('hoveron', (event) =>
        {
            this.controls.enabled = false;
            this.onHoverPlugStart(event.object);
        });

        dragcontrols.addEventListener('hoveroff', () =>
        {
            this.controls.enabled = true;
            this.onHoverPlugEnd();
        });

        dragcontrols.addEventListener('drag', (event) =>
        {
            event.object.position.z = 0;
            this.updateWireOutline(event.object['CustomIndex'], event.object);
        });

        dragcontrols.addEventListener('dragstart', (event) =>
        {
            this.oldPlugPosition = new Vector3().setFromMatrixPosition(event.object.matrixWorld);
            this.dragging = true;
            console.log('Start Drag', event);
        })

        dragcontrols.addEventListener('dragend', (event) =>
        {
            this.dragging = false;
            this.connectPlug();
            this.clearSnapping();
            console.log('Drag Ended');
        })

        let dragcontrol2 = new DragControls(
            this.powerStrips[0]['container']['children'],
            this.camera,
            this.renderer.domElement
        ); //
        dragcontrol2.enabled = false;

        dragcontrol2.addEventListener('hoveron', (event) =>{
            if(this.dragging) this.checkSnapping(event.object);
        });
        dragcontrol2.addEventListener('hoveroff', (event) =>{
            this.clearSnapping();
            this.curSocket = null;
        });

        this.updateWireOutlines();
    };

    createCablesAndSockets = (cabinet: Mesh, powerStrips: PowerStrip[]) =>
    {

        cabinet.children.map((rack, index) =>
        {
            // Create a wire outlet and set its position
            const wireOutlet = this.createWireOutlet(this.rackSize);

            //  Create plug and set its position
            const plug = this.createPlug(this.rackSize);
            rack.add(wireOutlet);
            rack.add(plug);
            rack.updateMatrixWorld();
            plug['CustomIndex'] = index;
            this.plugs.push(plug);
            const wire = this.updateWire(index, wireOutlet, plug);
            this.wires.push(wire);
            this.scene.add(wire['mesh']);
        });

        // for(var i = 0; i < this.splinePointsLength; i++)
        // {
        //     this.positions.push(this.splineHelperObjects[i].position);
        // }

        // var geometry = new BufferGeometry();
        // geometry.setAttribute('position', new BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3));

        // let curve = new CatmullRomCurve3(this.positions);
        // curve = new CatmullRomCurve3(this.positions);
        // curve['curveType'] = 'chordal';
        // curve['mesh'] = new Line(
        //     geometry.clone(),
        //     new LineBasicMaterial(
        //     {
        //         color: Math.random() * 0xffffff,
        //         // transparent: true,
        //         opacity: 0.65
        //     })
        // );
        // // curve['mesh'].castShadow = true;
        // this.splines['chordal'] = curve;


        // for(var k in this.splines)
        // {
        //     var spline = this.splines[k];
        //     this.scene.add(spline.mesh);
        // }

        // this.load([
        //     new Vector3(289.76843686945404, 452.51481137238443, 56.10018915737797),
        //     // new Vector3(-53.56300074753207, 171.49711742836848, -14.495472686253045),
        //     // new Vector3(-91.40118730204415, 176.4306956436485, -6.958271935582161),
        //     new Vector3(-383.785318791128, 491.1365363371675, 47.869296953772746)
        // ]);
    }

    public updateWire = (rackIndex: number, wireOutlet: Mesh, plug: Mesh) =>
    {
        const outletPosition = new Vector3();
        const plugPosition = new Vector3();
        outletPosition.setFromMatrixPosition(wireOutlet.matrixWorld);
        plugPosition.setFromMatrixPosition(plug.matrixWorld);
        const curve: CatmullRomCurve3 = new CatmullRomCurve3([outletPosition, plugPosition]);
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3));
        curve['curveType'] = 'chordal';
        curve['mesh'] = new Line(
            geometry.clone(),
            new LineBasicMaterial(
            {
                color: Math.random() * 0xffffff,
                // transparent: true,
                opacity: 0.65
            })
        );
        return curve;
    }

    getCamera = (cameraType: CameraType): Camera =>
    {
        if(cameraType === CameraType.OrthographicCamera) return this.orthographicCamera();
        if(cameraType === CameraType.PerspectiveCamera) return this.prespectiveCamera();
    };

    public orthographicCamera = (): Camera =>
    {
        const ocamera = new OrthographicCamera(
            (this.frustumSize * this.aspect) / -2,
            (this.frustumSize * this.aspect) / 2,
            this.frustumSize / 2,
            this.frustumSize / -2,
            0.1,
            3000
        );
        ocamera.position.set(0, 0, 800);
        return ocamera;
    };

    prespectiveCamera = () =>
    {
        // const pcamera = new PerspectiveCamera(45, this.aspect, 1, 3000);
        const pcamera = new PerspectiveCamera(70, this.aspect, 1, 10000);
        pcamera.position.z = 1100;
        return pcamera;
    };

    // Render
    public animate = () =>
    {
        requestAnimationFrame(this.animate);
        this.render();
    };

    private render = () =>
    {
        // this.rotateCube();
        // this.renderer.render(this.scene, this.ocamera);
        // this.splines.uniform.mesh.visible = params.uniform;
        // this.splines.centripetal.mesh.visible = params.centripetal;
        // this.splines.chordal.mesh.visible = params.chordal;
        this.renderer.render(this.scene, this.camera);
    };

    private rotateCube = () =>
    {
        // this.mesh.rotation.x +=0.01;
        // this.mesh.rotation.y +=0.01;
    };

    public onWindowResize: EventListener = () =>
    {
        this.camera.updateMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // public cancelHideTransform()
    // {
    //     if(this.hiding) clearTimeout(this.hiding);
    // }

    // public delayHideTransform()
    // {
    //     this.cancelHideTransform();
    //     this.hideTransform();
    // }

    // public hideTransform()
    // {
    //     this.hiding = setTimeout(() =>
    //     {
    //         this.transformControl.detach();
    //     }, 2500);
    // }

    public createWireOutlet(position: Vector3)
    {
        const wireOutlet = new Mesh(new BoxBufferGeometry(5, 5, 8), Materials.wireOutletMaterial);

        // wireOutlet.position.copy(position);
        wireOutlet.position.x -= position.x / 1.95;
        return wireOutlet;
    }

    public createPlug(position: Vector3)
    {
        const plug = new Mesh(new BoxBufferGeometry(15, 15, 10), Materials.plugMaterial);

        // plug.position.copy(position);
        plug.position.x -= position.x / 1.6;
        return plug;
    }

    public updateWireOutlines()
    {
        for(let i = 0; i < this.wires.length; i++)
        {
            this.updateWireOutline(i);
        }
    }

    public updateWireOutline(index: number, plug ? : Mesh)
    {
        let wire = this.wires[index];
        if(plug)
        {
            const plugPosition = new Vector3().setFromMatrixPosition(plug.matrixWorld);
            wire.points.pop();
            plugPosition.x += 7;
            wire.points.push(plugPosition);
        }
        let splineMesh = wire.mesh;
        let position = splineMesh.geometry.attributes.position;
        for(let i = 0; i < this.ARC_SEGMENTS; i++)
        {
            let t = i / (this.ARC_SEGMENTS - 1);
            wire.getPoint(t, this.point);
            position.setXYZ(i, this.point.x, this.point.y, this.point.z);
        }

        position.needsUpdate = true;
    }

    public updateConnections = (rackIndex: number, powerStripIndex: number, powerStripSocketIndex: number) =>
    {
        this.connections.rack.push({ powerStrip: powerStripIndex, powerStripSocket: powerStripSocketIndex });
    }

    checkSnapping = (socket: Mesh) =>
    {
        if(this.curSocket && this.curSocket['CustomIndex'] !== socket['CustomIndex']) this.clearSnapping();
        this.curSocket = socket;
        if(!socket['Occupied'])
        {
            socket.scale.set(1.4,1.3,1.3);
            // socket.material[4].color.setHex(0x00FF00);
        }
    }

    clearSnapping = () =>
    {
        if(this.curSocket) this.curSocket.scale.set(1,1,1);
    }

    connectPlug = () =>
    {
        if(this.curPlug && this.curSocket)
        {
            const socketPosition = new Vector3().setFromMatrixPosition(this.curSocket.matrixWorld);
            this.curPlug.position.x = socketPosition.x + 17;
        }
        else
        {
            this.curPlug.position.set(0, 0, 0);
            this.curPlug.position.x -= this.rackSize.x / 1.6;
        }
        this.curPlug.updateMatrixWorld();
        this.updateWireOutline(this.curPlug['CustomIndex'], this.curPlug);
    }

    onHoverPlugStart = (plug: Mesh) =>
    {
        this.onHoverPlugEnd();
        this.curPlug = plug;
        this.curPlug.scale.set(1.5,1.5,1.5);
    }

    onHoverPlugEnd = () =>
    {
        if(this.curPlug) this.curPlug.scale.set(1,1,1);
        this.curPlug = null;
    }
}
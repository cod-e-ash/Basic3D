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
    AmbientLight,
}

from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

import { PowerStrip, Orientation, Position } from './PowerStrip';
import { Materials, MaterialColour } from './Materials';
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
    frustumSize = window.innerWidth * 0.4;
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
        // this.updateConnections(1, 1, 1);
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
            const wireOutlet0 = this.createWireOutlet(this.rackSize, 0);

            //  Create plug and set its position
            const plug0 = this.createPlug(this.rackSize, 0);
            rack.add(wireOutlet0);
            rack.add(plug0);
            rack.updateMatrixWorld();
            this.plugs.push(plug0);
            plug0['CustomIndex'] = this.plugs.length-1;
            const wire0 = this.updateWire(wireOutlet0, plug0);
            this.wires.push(wire0);
            this.scene.add(wire0['mesh']);

            const wireOutlet1 = this.createWireOutlet(this.rackSize, 1);
            const plug1 = this.createPlug(this.rackSize, 1);
            rack.add(wireOutlet1);
            rack.add(plug1);
            this.plugs.push(plug1);
            plug1['CustomIndex'] = this.plugs.length-1;
            const wire1 = this.updateWire(wireOutlet1, plug1);
            this.wires.push(wire1);
            this.scene.add(wire1['mesh']);

        });

    }

    public updateWire = (wireOutlet: Mesh, plug: Mesh) =>
    {
        const outletPosition = new Vector3();
        const plugPosition = new Vector3();
        wireOutlet.parent.updateWorldMatrix(true, true);
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
        this.renderer.render(this.scene, this.camera);
    };

    public onWindowResize: EventListener = () =>
    {
        // this.aspect = window.innerWidth / 2 / (window.innerHeight * 0.8);
        // this.renderer.setPixelRatio(this.aspect);
        // // this.camera.updateWorldMatrix(true, true)
        // this.renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.8);
    };

    public createWireOutlet(rackSize: Vector3, index: number)
    {
        let position = Position.Left;
        const wireOutlet: Mesh = new Mesh(new BoxBufferGeometry(5, 5, 1), Materials.wireOutletMaterial);
        if(index % 2 === 1) 
        {
            position = Position.Right;
            wireOutlet.rotateX(Math.PI)
        }
        wireOutlet.position.x -= (rackSize.x / 1.95) * position;
        return wireOutlet;
    }

    public createPlug(rackSize: Vector3, index: number)
    {
        let position = Position.Left;
        const plug: Mesh = new Mesh(new BoxBufferGeometry(5, 5, 1), Materials.plugMaterial);
        if(index % 2 === 1) 
        {
            position = Position.Right;
            plug.rotateZ(Math.PI)
        }
        plug.position.x -= rackSize.x / 1.6 * position;
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
            // plugPosition.x += 11;
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

    // public updateConnections = (rackIndex: number, powerStripIndex: number, powerStripSocketIndex: number) =>
    // {
    //     this.connections.rack.push({ powerStrip: powerStripIndex, powerStripSocket: powerStripSocketIndex });
    // }

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
            this.curSocket.material = Materials.meshSocketMaterialBlue;
            this.curPlug.position.x = socketPosition.x + 17;
        }
        else
        {
            let position = Position.Left;
            this.curPlug.position.set(0, 0, 0);
            if(this.curPlug['CustomIndex'] % 2 === 1) 
            {
                position = Position.Right;
            }
            this.curPlug.position.x -= this.rackSize.x / 1.6 * position;
        }
        this.curPlug.updateMatrixWorld();
        this.updateWireOutline(this.curPlug['CustomIndex'], this.curPlug);
    }

    onHoverPlugStart = (plug: Mesh) =>
    {
        this.onHoverPlugEnd();
        this.curPlug = plug;
        this.curPlug.scale.set(3,3,3);
    }

    onHoverPlugEnd = () =>
    {
        if(this.curPlug) this.curPlug.scale.set(1,1,1);
        this.curPlug = null;
    }
}
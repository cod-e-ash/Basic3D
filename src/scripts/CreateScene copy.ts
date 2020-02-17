import { Cabinet } from './Cabinet';
import
{
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    OrthographicCamera,
    Camera,
    MeshLambertMaterial,
    Mesh,
    BoxBufferGeometry,
    BufferGeometry,
    BufferAttribute,
    CatmullRomCurve3,
    Line,
    LineBasicMaterial,
    Vector3,
    AmbientLight,
    MeshBasicMaterial
}
from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

import { PowerStrip, Orientation, Position } from './PowerStrip';

export enum CameraType
{
    OrthographicCamera = 'OrthographicCamera',
        PerspectiveCamera = 'PerspectiveCamer'
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
    splines = {};
    splineHelperObjects = [];
    splinePointsLength = 4;
    positions = [];
    ARC_SEGMENTS = 200;
    point = new Vector3();

    constructor(private powerStrips: PowerStrip[])
    {
        this.canvas.style.borderWidth = '5px';
        this.canvas.style.borderColor = 'black';
        this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setPixelRatio(this.aspect);
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.8);
    }

    public createScene = (cameraType: CameraType = CameraType.OrthographicCamera) =>
    {
        const orientation = Orientation.Vertical;
        this.scene.background = new Color('0x1111de');
        this.scene.add(Cabinet.create(orientation));
        // this.powerStrips.map(powerStrip => this.scene.add(PowerStrip.create(powerStrip, orientation)));
        // this.scene.add(new AmbientLight(0xddffdd, 50));
        this.camera = this.getCamera(cameraType);
        this.controls = new OrbitControls(this.camera, this.canvas);


        this.controls.dampingFactor = 0.2;
        this.controls.addEventListener("change", this.render);

        this.controls.addEventListener("start", () =>
        {
            this.cancelHideTransform();
        });

        this.controls.addEventListener("end", () =>
        {
            this.delayHideTransform();
        });
        this.transformControl = new TransformControls(this.camera, this.canvas);
        // this.transformControl.showX = false;
        // this.transformControl.showY = false;
        // this.transformControl.showZ = false;
        // this.transformControl.axis = 'X';
        this.transformControl.setMode('scale');
        // this.transformControl.size = 0.01;
        this.transformControl.addEventListener('change', this.render);
        this.transformControl.addEventListener('dragging-changed', (event) =>
        {
            this.controls.enabled = !event.value;
        });
        this.scene.add(this.transformControl);
        // Hiding transform situation is a little in a mess :()
        this.transformControl.addEventListener('change', () =>
        {
            this.cancelHideTransform();
        });

        this.transformControl.addEventListener('mouseDown', () =>
        {
            this.cancelHideTransform();
        });

        this.transformControl.addEventListener('mouseUp', () =>
        {
            this.delayHideTransform();
        });

        this.transformControl.addEventListener('objectChange', () =>
        {
            this.updateSplineOutline();
        });

        let dragcontrols = new DragControls(
            this.splineHelperObjects,
            this.camera,
            this.renderer.domElement
        ); //
        dragcontrols.enabled = false;
        dragcontrols.addEventListener('hoveron', (event) =>
        {
            this.transformControl.attach(event.object);
            this.cancelHideTransform();
        });

        dragcontrols.addEventListener('hoveroff', () =>
        {
            this.delayHideTransform();
        });

        for(let i = 0; i < this.splinePointsLength; i++)
        {
            this.addSplineObject(this.positions[i]);
        }

        this.positions = [];

        for(var i = 0; i < this.splinePointsLength; i++)
        {
            this.positions.push(this.splineHelperObjects[i].position);
        }

        var geometry = new BufferGeometry();
        geometry.setAttribute(
            'position',
            new BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3)
        );

        let curve = new CatmullRomCurve3(this.positions);
        // curve['curveType'] = 'catmullrom';
        // curve['mesh'] = new Line(
        //     geometry.clone(),
        //     new LineBasicMaterial(
        //     {
        //         color: 0xff0000,
        //         opacity: 0.35
        //     })
        // );
        // curve['mesh'].castShadow = true;
        // this.splines['uniform'] = curve;

        // curve = new CatmullRomCurve3(this.positions);
        // curve['curveType'] = 'centripetal';
        // curve['mesh'] = new Line(
        //     geometry.clone(),
        //     new LineBasicMaterial(
        //     {
        //         color: 0x00ff00,
        //         opacity: 0.35
        //     })
        // );
        // curve['mesh'].castShadow = true;
        // this.splines['centripetal'] = curve;

        curve = new CatmullRomCurve3(this.positions);
        curve['curveType'] = 'chordal';
        curve['mesh'] = new Line(
            geometry.clone(),
            new LineBasicMaterial(
            {
                color: 0x0000ff,
                opacity: 0.35
            })
        );
        // curve['mesh'].castShadow = true;
        this.splines['chordal'] = curve;

        for(var k in this.splines)
        {
            var spline = this.splines[k];
            this.scene.add(spline.mesh);
        }

        this.load([
            new Vector3(289.76843686945404, 452.51481137238443, 56.10018915737797),
            // new Vector3(-53.56300074753207, 171.49711742836848, -14.495472686253045),
            // new Vector3(-91.40118730204415, 176.4306956436485, -6.958271935582161),
            new Vector3(-383.785318791128, 491.1365363371675, 47.869296953772746)
        ]);
    };

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

    public cancelHideTransform()
    {
        if(this.hiding) clearTimeout(this.hiding);
    }

    public delayHideTransform()
    {
        this.cancelHideTransform();
        this.hideTransform();
    }

    public hideTransform()
    {
        this.hiding = setTimeout(() =>
        {
            this.transformControl.detach();
        }, 2500);
    }

    public addSplineObject(position ? )
    {
        let material = new MeshBasicMaterial(
        {
            color: Math.random() * 0xffffff
        });
        let object = new Mesh(new BoxBufferGeometry(10, 10, 10), material);

        if(position)
        {
            object.position.copy(position);
        }
        else
        {
            object.position.x = Math.random() * 1000 - 500;
            object.position.y = Math.random() * 600;
            object.position.z = Math.random() * 800 - 400;
        }

        // object.castShadow = true;
        // object.receiveShadow = true;
        this.scene.add(object);
        this.splineHelperObjects.push(object);
        return object;
    }

    public load(new_positions)
    {
        while(new_positions.length > this.positions.length)
        {
            this.addPoint();
        }

        while(new_positions.length < this.positions.length)
        {
            this.removePoint();
        }

        for(var i = 0; i < this.positions.length; i++)
        {
            this.positions[i].copy(new_positions[i]);
        }

        this.updateSplineOutline();
    }

    public addPoint()
    {
        this.splinePointsLength++;

        this.positions.push(this.addSplineObject().position);

        this.updateSplineOutline();
    }

    public updateSplineOutline()
    {
        for(let k in this.splines)
        {
            let spline = this.splines[k];

            let splineMesh = spline.mesh;
            let position = splineMesh.geometry.attributes.position;

            for(let i = 0; i < this.ARC_SEGMENTS; i++)
            {
                let t = i / (this.ARC_SEGMENTS - 1);
                spline.getPoint(t, this.point);
                position.setXYZ(i, this.point.x, this.point.y, this.point.z);
            }

            position.needsUpdate = true;
        }
    }

    public removePoint()
    {
        if(this.splinePointsLength <= 4)
        {
            return;
        }
        this.splinePointsLength--;
        this.positions.pop();
        this.scene.remove(this.splineHelperObjects.pop());

        this.updateSplineOutline();
    }
}
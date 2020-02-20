import { Geometries } from './Geometries';
import { Materials } from './Materials';
import { Mesh, LineSegments, EdgesGeometry, BoxBufferGeometry, Vector3, Box3, Material, TextGeometry, Object3D, BufferGeometry } from 'three';

export enum Orientation
{
    Horizontal = 'Horizontal',
        Vertical = 'Vertical'
}
export enum BoxType
{
    LineSegments = 'LineSegments',
        Mesh = 'Mesh'
}

export enum Position
{
    Left = -1,
        Right = 1
}

export interface ISocket
{
    Name: string;
    Occupied: boolean;
}

export interface IPowerStrip
{
    Name: string;
    Quantity: number;
    index ? : number;
    container ? : Mesh;
    Sockets ? : ISocket[];
    StartIndex: number;
}

export class PowerStrip implements IPowerStrip
{
    StartIndex = 0;

    constructor(public Name: string, public Quantity: number = 24, public index = 0, public Sockets ? : ISocket[])
    {
        if(!this.Sockets)
        {
            this.Sockets = PowerStrip.initializeSockets(Quantity, this.StartIndex);
        }
    }

    static initializeSockets = (Quantity, StartIndex: number): ISocket[] =>
    {
        const sockets = [];

        for(let i = 0; i < Quantity; i++)
        {
            sockets.push({ Name: `Socket ${StartIndex + sockets.length}`, Occupied: false });
        }
        return sockets;
    }

    static getIndex(Name: string)
    {

    }

    static create = (powerStrip: IPowerStrip, orientation: Orientation) =>
    {
        // Create Container
        const container = PowerStrip.createContainer(powerStrip, orientation);

        // Create sockets and add them
        PowerStrip.addSockets(container, powerStrip.Sockets, orientation);

        return container;
    };

    public static createContainer = (powerStrip: IPowerStrip, orientation: Orientation) =>
    {
        // Container Geometry
        let containerGeometry: BoxBufferGeometry;

        containerGeometry = new BoxBufferGeometry(
            Geometries.socketWidth * (powerStrip.Sockets?.length || 1) + 5,
            Geometries.socketWidth,
            Geometries.socketWidth
        );

        // If Mesh
        // const container = new Mesh(containerGeometry, Materials.meshSolidWhite);

        // If Line
        const containerEdgeGeo = new EdgesGeometry(containerGeometry, 10);
        const container = new LineSegments(containerEdgeGeo, Materials.lineBasicMaterial);

        let position = Position.Left;
        if(orientation === Orientation.Horizontal)
        {
            container.position.x -=
                Geometries.socketWidth * 4 -
                (Geometries.socketWidth * (24 - (powerStrip.Sockets?.length || 1))) / 2;
            container.position.y = Geometries.socketWidth * powerStrip.index * 2;
        }
        else
        {
            let factor = 1;
            if(powerStrip.index % 2 !== 0)
            {
                position = Position.Right;
                factor += (powerStrip.index - 1) * 0.1;
            }
            else
            {
                factor += powerStrip.index * 0.1;
            }
            container.position.x = Geometries.socketWidth * 8 * position * factor;
            container.position.y -= (Geometries.socketWidth * (24 - (powerStrip.Sockets?.length || 1))) / 2;
            container.rotateZ(Math.PI / 2);
        }

        // Add Custom Index Property
        container['CustomIndex'] = powerStrip.index;
        return container;
    }

    public static addSockets = (container: LineSegments, sockets: ISocket[], orientation: Orientation) =>
    {
        const box3 = new Box3();
        box3.setFromObject(container);
        const size = box3.getSize(new Vector3());
        const boxSize = orientation === Orientation.Vertical ? size.y : size.x;
        let curPosition = ((boxSize / 2) * -1) + (Geometries.socketWidth / 2) + 2;

        for(let i = 0; i < sockets.length; i++)
        {
            const box = PowerStrip.createSocket(sockets[i]);
            box.position.x = curPosition;
            // Add Custom Index
            box['CustomIndex'] = i;
            container.add(box);
            curPosition += Geometries.socketWidth;
        }
    };

    public static createSocket = (socket: ISocket) =>
    {
        if(socket.Occupied) return PowerStrip.createMeshBox(Materials.meshSocketMaterialBlue);
        else return PowerStrip.createMeshBox(Materials.meshSocketMaterialWhite);
    }

    public static createLineBox = (): LineSegments =>
    {
        const edgeBoxGeo = new EdgesGeometry(Geometries.socketGeometry, 10);
        return new LineSegments(edgeBoxGeo, Materials.lineBasicMaterial);
    }

    public static createMeshBox = (material: Material): Mesh =>
    {
        return new Mesh(Geometries.socketGeometry, material);
    }
}
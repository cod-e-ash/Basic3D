import { Orientation } from './PowerStrip';
import { Mesh, Vector3, Box3, LineSegments } from 'three';
import { Geometries } from './Geometries';
import { Materials } from './Materials';

export class Cabinet
{
    static noOfUnits: number = 42;

    public static create = (orientation: Orientation): Mesh =>
    {
        const cabinet = new Mesh(Geometries.cabinetGeometry, Materials.transparentMaterial);
        if(orientation === Orientation.Horizontal)
        {
            cabinet.position.x += Geometries.socketWidth * 15;
        }
        Cabinet.createRacks(cabinet);
        return cabinet;
    }

    public static createRacks = (cabinet: Mesh) =>
    {
        const box3 = new Box3();
        box3.setFromObject(cabinet);
        const size = box3.getSize(new Vector3());
        let curPosition = size.y / 2 * -1;
        for(let i = 0; i < Cabinet.noOfUnits; i++)
        {
            // const rack = new LineSegments(Geometries.rackGeometry, Materials.meshRack);
            const rack = new Mesh(Geometries.rackGeometry, Materials.meshRack);
            rack.position.y = curPosition;
            curPosition += Geometries.socketWidth / 2 + 2.3;
            cabinet.add(rack);
        }
    }
}
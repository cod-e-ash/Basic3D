import { Vector3, Vector2 } from "three";

export class PowerCable {

    constructor(public startPosition: Vector3, public endPosition: Vector3)
    {}

    get firstCurvePosition(): Vector3
    {   
        return this.getCurvePoint(20)
    }

    get secondCurvePosition(): Vector3
    {
        return this.getCurvePoint(80);
    }

    public getCurvePoint(curveAtPercent: number)
    {
        const curvePostion = this.startPosition.clone();
        let x = (Math.abs(this.startPosition.x) - Math.abs(this.endPosition.x)) * (curveAtPercent / 100);
        curvePostion.x += this.startPosition.x < this.endPosition.x ? x : -1 * x;
        let y = (Math.abs(this.startPosition.y) - Math.abs(this.endPosition.y)) * (curveAtPercent / 100);
        curvePostion.y += this.startPosition.y < this.endPosition.x ? y : -1 * y;
        return curvePostion;
    }
}
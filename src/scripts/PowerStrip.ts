export enum Orientation{
    Horizontal = 'Horizontal',
    Vertical = 'Vertical'
}
export class PowerStrip{
    constructor(public numberOfSockets: number = 24, public orientation: Orientation = Orientation.Vertical){}
}
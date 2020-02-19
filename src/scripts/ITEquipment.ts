export interface Power_Chord
{
    PowerSocket: string;
    PowerStrip: string;
}

export class ITEquipment
{
    Height: number;
    Width: number;
    Parent_Cabinet_Slot_Index: number;
    Power_Chords_List: Power_Chord[];

    constructor(){}


}
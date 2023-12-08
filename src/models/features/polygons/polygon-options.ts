export default class PolygonOptions {
    public path: number[][];
    public weight: number;
    public addToMap?: boolean;
    public color?: string;
    public opacity?: number;
    public fillColor?: string;
    public fillOpacity?: number;
    public draggable?: boolean;
    public editable?: boolean;
    public fitBounds?: boolean;
    public object?: object;
    public zIndex: number;

    constructor(path: number[][], weight: number, addToMap?: boolean, color?: string, opacity?: number,
        fillColor?: string, fillOpacity?: number, draggable?: boolean, editable?: boolean, fitBounds?: boolean,
        object?: object) {

        this.path = path;
        this.weight = weight;
        this.addToMap = addToMap;
        this.color = color;
        this.opacity = opacity;
        this.fillColor = fillColor;
        this.fillOpacity = fillOpacity;
        this.draggable = draggable;
        this.editable = editable;
        this.fitBounds = fitBounds;
        this.object = object;
        this.zIndex = 0
    }
}

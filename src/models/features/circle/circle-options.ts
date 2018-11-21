export default class CircleOptions {
    public center: number[];
    public radius: number;
    public weight: number;
    public addToMap?: boolean;
    public fillOpacity?: number;
    public fillColor?: string;
    public color?: string;
    public opacity?: number;
    public draggable?: boolean;
    public editable?: boolean;
    public fitBounds?: boolean;
    public object?: object;

    constructor(center: number[], radius: number, weight: number, addToMap?: boolean, fillOpacity?: number,
        fillColor?: string, color?: string, opacity?: number, draggable?: boolean, editable?: boolean,
        fitBounds?: boolean, object?: object) {

        this.center = center;
        this.radius = radius;
        this.weight = weight;
        this.addToMap = addToMap;
        this.fillOpacity = fillOpacity;
        this.fillColor = fillColor;
        this.color = color;
        this.opacity = opacity;
        this.draggable = draggable;
        this.editable = editable;
        this.fitBounds = fitBounds;
        this.object = object;
    }
}

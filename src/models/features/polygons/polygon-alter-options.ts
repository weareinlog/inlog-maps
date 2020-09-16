export default class PolygonAlterOptions {
    public weight: number;
    public color?: string;
    public opacity?: number;
    public fillColor?: string;
    public fillOpacity?: number;
    public addToMap: boolean;
    public editable?: boolean;
    public object: any;

    constructor(addToMap: boolean, color?: string, opacity?: number, fillColor?: string, fillOpacity?: number,
        weight?: number) {
        this.addToMap = addToMap;
        this.color = color;
        this.opacity = opacity;
        this.fillColor = fillColor;
        this.fillOpacity = fillOpacity;
        this.weight = weight;
    }
}

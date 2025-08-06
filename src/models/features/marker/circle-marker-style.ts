export default class CircleMarkerStyle {
    public radius: number;
    public weight?: number;
    public color?: string;
    public fillColor?: string;
    public fillOpacity?: number;
    public label?: any;
    public labelOrigin?: number[];

    constructor(radius: number, weight?: number, color?: string, fillColor?: string, fillOpacity?: number, label?: any, labelOrigin?: number[]) {
        this.radius = radius;
        this.weight = weight;
        this.color = color;
        this.fillColor = fillColor;
        this.fillOpacity = fillOpacity;
        this.label = label;
        this.labelOrigin = labelOrigin;
    }
}

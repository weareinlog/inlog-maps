export default class CircleMarkerStyle {
    public radius: number;
    public weight?: number;
    public color?: string;
    public fillColor?: string;
    public fillOpacity?: number;

    constructor(radius: number, weight?: number, color?: string, fillColor?: string, fillOpacity?: number) {
        this.radius = radius;
        this.weight = weight;
        this.color = color;
        this.fillColor = fillColor;
        this.fillOpacity = fillOpacity;
    }
}

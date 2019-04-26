export default class CircleAlterOptions {
    public center: number[];
    public radius: number;
    public weight: number;
    public fillOpacity?: number;
    public fillColor?: string;
    public color?: string;
    public opacity?: number;

    constructor(center: number[], radius: number, weight: number, fillOpacity?: number,
        fillColor?: string, color?: string, opacity?: number) {

        this.center = center;
        this.radius = radius;
        this.weight = weight;
        this.fillOpacity = fillOpacity;
        this.fillColor = fillColor;
        this.color = color;
        this.opacity = opacity;
    }
}

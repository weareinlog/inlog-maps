export default class CircleAlterOptions {
    public weight: number;
    public fillOpacity?: number;
    public fillColor?: string;
    public color?: string;
    public opacity?: number;

    constructor(weight: number, fillOpacity?: number, fillColor?: string, color?: string, opacity?: number) {
        this.weight = weight;
        this.fillOpacity = fillOpacity;
        this.fillColor = fillColor;
        this.color = color;
        this.opacity = opacity;
    }
}

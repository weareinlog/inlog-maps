export default class HeatMapOptions {
    public data: number[][];
    public addToMap?: boolean;
    public radius?: number;
    public maxIntensity?: number;
    public minOpacity?: number;
    public opacity?: number;
    public gradient?: string[] | { [key: number]: string };
    public blur?: number;
    public maxZoom?: number;
    public dissipating?: boolean;
    public scaleRadius?: boolean;
    public useLocalExtrema?: boolean;
    public fitBounds?: boolean;
    public object?: object;

    constructor(
        data: number[][],
        addToMap?: boolean,
        radius?: number,
        maxIntensity?: number,
        minOpacity?: number,
        opacity?: number,
        gradient?: string[] | { [key: number]: string },
        blur?: number,
        maxZoom?: number,
        dissipating?: boolean,
        scaleRadius?: boolean,
        useLocalExtrema?: boolean,
        fitBounds?: boolean,
        object?: object
    ) {
        this.data = data;
        this.addToMap = addToMap;
        this.radius = radius;
        this.maxIntensity = maxIntensity;
        this.minOpacity = minOpacity;
        this.opacity = opacity;
        this.gradient = gradient;
        this.blur = blur;
        this.maxZoom = maxZoom;
        this.dissipating = dissipating;
        this.scaleRadius = scaleRadius;
        this.useLocalExtrema = useLocalExtrema;
        this.fitBounds = fitBounds;
        this.object = object;
    }
} 
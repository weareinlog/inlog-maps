export default class OverlayOptions {
    public position: number[];
    public divElement: HTMLDivElement;
    public addToMap: boolean;
    public object: any;
    public polygon: string;
    public conditionPolygon: any;

    constructor(divElement: HTMLDivElement, addToMap: boolean, position?: number[], object?: any,
        polygon?: string, conditionPolygon?: any) {
        this.position = position;
        this.divElement = divElement;
        this.addToMap = addToMap;
        this.object = object;
        this.polygon = polygon;
        this.conditionPolygon = conditionPolygon;
    }
}

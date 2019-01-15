export default class OverlayOptions {
    public position: number[];
    public divElement: HTMLDivElement;
    public addToMap: boolean;
    public object: any;

    constructor(divElement: HTMLDivElement, addToMap: boolean, position?: number[], object?: any) {
        this.position = position;
        this.divElement = divElement;
        this.addToMap = addToMap;
        this.object = object;
    }
}

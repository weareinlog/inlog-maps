import NavigationOptions from './navigations-options';

export default class PolylineOptions {
    public path: number[][];
    public addToMap?: boolean;
    public fitBounds?: boolean;
    public editable?: boolean;
    public draggable?: boolean;
    public color?: string;
    public weight: number;
    public object?: object;
    public infowindows?: string[];
    public icons?: object;
    public opacity?: number;
    public dashArray?: string;
    public navigateOptions?: NavigationOptions;

    constructor(path?: number[][], addToMap?: boolean, fitBounds?: boolean,
        editable?: boolean, draggable?: boolean, color?: string, weight?: number,
        object?: object, opacity?: number, dashArray?: string, icons?: object,
        infowindows?: string[], navigateOptions?: NavigationOptions) {

        this.path = path;
        this.addToMap = addToMap;
        this.fitBounds = fitBounds;
        this.editable = editable;
        this.draggable = draggable;
        this.color = color;
        this.weight = weight;
        this.object = object;
        this.infowindows = infowindows;
        this.icons = icons;
        this.opacity = opacity;
        this.dashArray = dashArray;
        this.navigateOptions = navigateOptions;
    }
}

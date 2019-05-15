import NavigationOptions from './navigations-options';
import { PolylineType } from '../../dto/polyline-type';

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
    public style?: PolylineType;
    public navigateOptions?: NavigationOptions;
    public opacity: number;
    public zIndex: number;

    constructor(path?: number[][], addToMap?: boolean, fitBounds?: boolean,
        editable?: boolean, draggable?: boolean, color?: string, weight?: number,
        object?: object, infowindows?: string[], navigateOptions?: NavigationOptions, style?: PolylineType, opacity?: number, zIndex?: number) {

        this.path = path;
        this.addToMap = addToMap;
        this.fitBounds = fitBounds;
        this.editable = editable;
        this.draggable = draggable;
        this.color = color;
        this.weight = weight;
        this.object = object;
        this.infowindows = infowindows;
        this.navigateOptions = navigateOptions;
        this.style = style;
        this.opacity = opacity;
        this.zIndex = zIndex;
    }
}

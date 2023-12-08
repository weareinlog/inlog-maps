import NavigationOptions from "./navigations-options";
import { PolylineType } from "../../dto/polyline-type";

export default class PolylineOptions {
    public path?: number[][] | null;
    public weight?: number | null;
    public opacity?: number | null;
    public zIndex?: number | null;
    public addToMap?: boolean;
    public fitBounds?: boolean;
    public editable?: boolean;
    public draggable?: boolean;
    public color?: string;
    public object?: object;
    public infowindows?: string[];
    public style?: PolylineType;
    public navigateOptions?: NavigationOptions;

    constructor(
        path?: number[][] | null,
        weight?: number | null,
        opacity?: number | null,
        zIndex?: number,
        addToMap?: boolean,
        fitBounds?: boolean,
        editable?: boolean,
        draggable?: boolean,
        color?: string,
        object?: object,
        infowindows?: string[],
        navigateOptions?: NavigationOptions,
        style?: PolylineType
    ) {
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

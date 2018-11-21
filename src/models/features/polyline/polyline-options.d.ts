import NavigationOptions from './navigations-options';
export default class PolylineOptions {
    path: number[][];
    addToMap?: boolean;
    fitBounds?: boolean;
    editable?: boolean;
    draggable?: boolean;
    color?: string;
    weight: number;
    object?: object;
    infowindows?: string[];
    navigateOptions?: NavigationOptions;
    constructor(path?: number[][], addToMap?: boolean, fitBounds?: boolean, editable?: boolean, draggable?: boolean, color?: string, weight?: number, object?: object, infowindows?: string[], navigateOptions?: NavigationOptions);
}

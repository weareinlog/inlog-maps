export default class PolygonOptions {
    path: number[][];
    weight: number;
    addToMap?: boolean;
    color?: string;
    opacity?: number;
    fillColor?: string;
    fillOpacity?: number;
    draggable?: boolean;
    editable?: boolean;
    fitBounds?: boolean;
    object?: object;
    constructor(path: number[][], weight: number, addToMap?: boolean, color?: string, opacity?: number, fillColor?: string, fillOpacity?: number, draggable?: boolean, editable?: boolean, fitBounds?: boolean, object?: object);
}

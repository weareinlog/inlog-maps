export default class CircleOptions {
    center: number[];
    radius: number;
    weight: number;
    addToMap?: boolean;
    fillOpacity?: number;
    fillColor?: string;
    color?: string;
    opacity?: number;
    draggable?: boolean;
    editable?: boolean;
    fitBounds?: boolean;
    object?: object;
    constructor(center: number[], radius: number, weight: number, addToMap?: boolean, fillOpacity?: number, fillColor?: string, color?: string, opacity?: number, draggable?: boolean, editable?: boolean, fitBounds?: boolean, object?: object);
}

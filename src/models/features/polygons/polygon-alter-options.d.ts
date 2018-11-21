export default class PolygonAlterOptions {
    weight: number;
    color?: string;
    opacity?: number;
    fillColor?: string;
    fillOpacity?: number;
    addToMap: boolean;
    constructor(addToMap: boolean, color?: string, opacity?: number, fillColor?: string, fillOpacity?: number);
}

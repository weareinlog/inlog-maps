import CircleMarkerStyle from './circle-marker-style';
export default class CircleMarkerOptions {
    latlng: number[];
    addToMap?: boolean;
    style: CircleMarkerStyle;
    fitBounds?: boolean;
    object?: object;
    constructor(latlng: number[], style: CircleMarkerStyle, addToMap?: boolean, fitBounds?: boolean, object?: object);
}

import CircleMarkerStyle from './circle-marker-style';

export default class CircleMarkerOptions {
    public latlng: number[];
    public addToMap?: boolean;
    public style: CircleMarkerStyle;
    public fitBounds?: boolean;
    public object?: object;

    constructor(latlng: number[], style: CircleMarkerStyle, addToMap?: boolean, fitBounds?: boolean, object?: object) {
        this.latlng = latlng;
        this.addToMap = addToMap;
        this.style = style;
        this.fitBounds = fitBounds;
        this.object = object;
    }
}

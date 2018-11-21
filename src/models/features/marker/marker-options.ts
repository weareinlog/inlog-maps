import MarkerIcon from './marker-icon';

export default class MarkerOptions {
    public latlng: number[];
    public addToMap?: boolean;
    public draggable?: boolean;
    public icon?: MarkerIcon;
    public fitBounds?: boolean;
    public object?: object;

    constructor(latlng: number[], addToMap?: boolean, draggable?: boolean, icon?: MarkerIcon,
        fitBounds?: boolean, object?: object) {

        this.latlng = latlng;
        this.addToMap = addToMap;
        this.draggable = draggable;
        this.icon = icon;
        this.fitBounds = fitBounds;
        this.object = object;
    }
}

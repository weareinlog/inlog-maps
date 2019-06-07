import MarkerIcon from './marker-icon';

export default class MarkerOptions {
    public latlng: number[];
    public addToMap?: boolean;
    public draggable?: boolean;
    public icon?: MarkerIcon;
    public fitBounds?: boolean;
    public object?: object;
    public addClusterer?: boolean;

    constructor(latlng: number[], addToMap: boolean = false, draggable: boolean = false, icon?: MarkerIcon,
        fitBounds: boolean = false, object?: object, addClusterer = false) {

        this.latlng = latlng;
        this.addToMap = addToMap;
        this.draggable = draggable;
        this.icon = icon;
        this.fitBounds = fitBounds;
        this.object = object;
        this.addClusterer = addClusterer;
    }
}

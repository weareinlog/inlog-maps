export default class PopupOptions {
    public latlng: number[];
    public content: string;
    public marker?: string;
    public conditionMarker?: any;
    public notCalledByMap?: boolean; /* Property to set if open is called from map event or not, only used on leaflet */
    public object?: object;

    constructor(latlng: number[], content: string, marker?: string, conditionMarker?: any,
        notCalledByMap?: boolean, object?: object) {
        this.latlng = latlng;
        this.content = content;
        this.marker = marker;
        this.conditionMarker = conditionMarker;
        this.notCalledByMap = notCalledByMap;
        this.object = object;
    }
}

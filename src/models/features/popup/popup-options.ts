export default class PopupOptions {
    public latlng: number[];
    public content: string;
    public marker?: string;
    public conditionMarker?: any;
    public notCalledByMap?: boolean; /* Property to set if open ir called from map or not, only used on leaflet */

    constructor(latlng: number[], content: string, marker?: string, conditionMarker?: any, notCalledByMap?: boolean) {
        this.latlng = latlng;
        this.content = content;
        this.marker = marker;
        this.conditionMarker = conditionMarker;
        this.notCalledByMap = notCalledByMap;
    }
}

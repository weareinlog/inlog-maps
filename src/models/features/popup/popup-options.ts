export default class PopupOptions {
    public latlng: number[];
    public content: string;
    public marker?: string;
    public conditionMarker?: any;

    constructor(latlng: number[], content: string, marker?: string, conditionMarker?: any) {
        this.latlng = latlng;
        this.content = content;
        this.marker = marker;
        this.conditionMarker = conditionMarker;
    }
}

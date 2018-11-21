export default class PopupOptions {
    public latlng: number[];
    public content: string;
    public marker?: any;

    constructor(latlng: number[], content: string, marker?: any) {
        this.latlng = latlng;
        this.content = content;
        this.marker = marker;
    }
}

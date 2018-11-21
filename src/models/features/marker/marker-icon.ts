export default class MarkerIcon {
    public url: string;
    public size?: number[];

    constructor(url: string, size?: number[]) {
        this.url = url;
        this.size = size;
    }
}

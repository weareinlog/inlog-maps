export default class MarkerIcon {
    public url: string;
    public size?: number[];
    public scaledSize? : number[];

    constructor(url: string, size?: number[], scaledSize?: number[]) {
        this.url = url;
        this.size = size;
        this.scaledSize = scaledSize;
    }
}

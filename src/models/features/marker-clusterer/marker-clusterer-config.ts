export default class MarkerClustererConfig {
    public clusterZoomOnClick: boolean;
    public clusterMinSize: number;
    public clusterMaxZoom: number;

    constructor(clusterZoomOnClick: boolean, clusterMinSize: number, clusterMaxZoom: number) {
        this.clusterZoomOnClick = clusterZoomOnClick;
        this.clusterMinSize = clusterMinSize;
        this.clusterMaxZoom = clusterMaxZoom;
    }
}

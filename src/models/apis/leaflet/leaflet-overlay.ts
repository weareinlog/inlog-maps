import OverlayOptions from '../../features/overlay/overlay-options';
import LeafletPolygons from './leaflet-polygons';

export default class LeafletOverlay {
    private map = null;
    private leaflet = null;
    private leafletPolygons: LeafletPolygons;

    constructor(map: any, leaflet: any, leafletPolygons: LeafletPolygons) {
        this.map = map;
        this.leaflet = leaflet;
        this.leafletPolygons = leafletPolygons;
    }

    public drawOverlay(options: OverlayOptions, polygons: any) {
        const html: string = options.divElement.outerHTML;
        const myIcon = new this.leaflet.DivIcon({ html });

        const position = polygons && polygons.length > 0 ?
            this.leafletPolygons.getBoundsPolygons(polygons).getCenter() : options.position;

        const overlay = new this.leaflet.Marker(position, { icon: myIcon });

        if (options.addToMap) {
            overlay.addTo(this.map);
        }

        overlay.object = options.object;
        return overlay;
    }

    public toggleOverlay(overlays: any[], show: boolean) {
        const self = this;
        overlays.forEach((overlay) => show ? self.map.addLayer(overlay) : self.map.removeLayer(overlay));
    }
}

import OverlayOptions from "../../features/overlay/overlay-options";
import GooglePolygons from "./google-polygons";

export default class GoogleOverlays {
    private map = null;
    private google = null;
    private googlePolygons: GooglePolygons;
    private OverlayGoogle = null;

    constructor(map: any, google: any, googlePolygons: GooglePolygons) {
        this.map = map;
        this.google = google;
        this.googlePolygons = googlePolygons;

        OverlayGoogle.prototype = new this.google.maps.OverlayView();

        function OverlayGoogle(bounds, div, map) {
            this.bounds_ = bounds;
            this.div_ = div;
            this.setMap(map);
        }

        OverlayGoogle.prototype.onAdd = function () {
            const panes = this.getPanes();
            panes.overlayLayer.appendChild(this.div_);
            panes.overlayMouseTarget.appendChild(this.div_);

            google.maps.event.addDomListener(this.div_, 'click', function () {
                google.maps.event.trigger(this.div_, 'click');
            });
        };

        OverlayGoogle.prototype.draw = function () {
            const overlayProjection = this.getProjection();
            const center = overlayProjection.fromLatLngToDivPixel(this.bounds_.getCenter());
            const div = this.div_;

            div.style.left = center.x + 'px';
            div.style.top = center.y + 'px';
        };

        OverlayGoogle.prototype.onRemove = function () {
            this.div_.parentNode.removeChild(this.div_);
        };

        this.OverlayGoogle = OverlayGoogle;
    }

    public drawOverlay(options: OverlayOptions, polygons: any) {
        let bounds = null;

        if (polygons && polygons.length > 0) {
            bounds = this.googlePolygons.getPolygonsBounds(polygons);
        } else {
            bounds = new this.google.maps.LatLngBounds();
            bounds.extend(new this.google.maps.LatLng(options.position[0], options.position[1]));
        }

        const overlay = new this.OverlayGoogle(bounds, options.divElement);
        if (options.addToMap) {
            overlay.setMap(this.map);
        }

        overlay.object = options.object;
        return overlay;
    }

    public toggleOverlay(overlays: any[], show: boolean) {
        const self = this;
        overlays.forEach((overlay) => overlay.setMap(show ? self.map : null));
    }
}

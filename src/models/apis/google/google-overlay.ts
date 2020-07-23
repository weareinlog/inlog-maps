import EventReturn from '../../features/events/event-return';
import OverlayOptions from '../../features/overlay/overlay-options';
import GooglePolygons from './google-polygons';

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

        function OverlayGoogle(bounds: any, div: any, draggable: boolean, obj: any, afterDrag: any) {
            this.bounds_ = bounds;
            this.div_ = div;
            this.draggable = draggable;
            this.afterDragHandler = afterDrag;
            this.object = obj;
            this.setMap(map);
        }

        OverlayGoogle.prototype.onAdd = function () {
            const that = this;
            const panes = this.getPanes();
            panes.overlayLayer.appendChild(this.div_);
            panes.overlayMouseTarget.appendChild(this.div_);

            google.maps.event.addDomListener(this.div_, 'click', function () {
                google.maps.event.trigger(this.div_, 'click');
            });

            if (this.draggable) {
                google.maps.event.addDomListener(this.get('map').getDiv(), 'mouseleave', function () {
                    google.maps.event.trigger(this.div_, 'mouseup');
                });

                google.maps.event.addDomListener(this.div_, 'mousedown', function (e) {
                    this.style.cursor = 'move';
                    that.map.set('draggable', false);
                    that.set('origin', e);

                    that.moveHandler = google.maps.event.addDomListener(that.get('map').getDiv(),
                        'mousemove', function (e) {
                            const origin = that.get('origin');
                            const left = origin.clientX - e.clientX;
                            const top = origin.clientY - e.clientY;
                            const pos = that.getProjection().fromLatLngToDivPixel(that.bounds_.getCenter());
                            const latLng = that.getProjection()
                                .fromDivPixelToLatLng(new google.maps.Point(pos.x - left, pos.y - top));

                            that.set('origin', e);
                            that.bounds_ = new google.maps.LatLngBounds();
                            that.bounds_.extend(latLng);
                            that.draw();
                        });
                });

                google.maps.event.addDomListener(this.div_, 'mouseup', function () {
                    that.map.set('draggable', true);
                    this.style.cursor = 'default';
                    google.maps.event.removeListener(that.moveHandler);

                    if (that.afterDragHandler) {
                        const latLng = that.bounds_.getCenter();
                        const param = new EventReturn([latLng.lat(), latLng.lng()]);
                        that.afterDragHandler(param, that.object);
                    }
                });
            }
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

        const overlay = new this.OverlayGoogle(bounds, options.divElement,
            options.draggable, options.object, options.afterEventDragHandler);

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

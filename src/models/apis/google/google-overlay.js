// @ts-nocheck
import EventReturn from "../../features/events/event-return";
var GoogleOverlays = /** @class */ (function () {
    function GoogleOverlays(map, google, googlePolygons) {
        this.map = {};
        this.google = {};
        this.OverlayGoogle = null;
        this.map = map;
        this.google = google;
        this.googlePolygons = googlePolygons;
        OverlayGoogle.prototype = new this.google.maps.OverlayView();
        function OverlayGoogle(bounds, div, draggable, obj, afterDrag) {
            this.bounds_ = bounds;
            this.div_ = div;
            this.draggable = draggable;
            this.afterDragHandler = afterDrag;
            this.object = obj;
            this.setMap(map);
        }
        OverlayGoogle.prototype.onAdd = function () {
            var that = this;
            var panes = this.getPanes();
            panes.overlayLayer.appendChild(this.div_);
            panes.overlayMouseTarget.appendChild(this.div_);
            google.maps.event.addDomListener(this.div_, "click", function () {
                google.maps.event.trigger(this.div_, "click");
            });
            if (this.draggable) {
                google.maps.event.addDomListener(this.get("map").getDiv(), "mouseleave", function () {
                    google.maps.event.trigger(this.div_, "mouseup");
                });
                google.maps.event.addDomListener(this.div_, "mousedown", function (e) {
                    this.style.cursor = "move";
                    that.map.set("draggable", false);
                    that.set("origin", e);
                    that.moveHandler = google.maps.event.addDomListener(that.get("map").getDiv(), "mousemove", function (e) {
                        var origin = that.get("origin");
                        var left = origin.clientX - e.clientX;
                        var top = origin.clientY - e.clientY;
                        var pos = that
                            .getProjection()
                            .fromLatLngToDivPixel(that.bounds_.getCenter());
                        var latLng = that
                            .getProjection()
                            .fromDivPixelToLatLng(new google.maps.Point(pos.x - left, pos.y - top));
                        that.set("origin", e);
                        that.bounds_ = new google.maps.LatLngBounds();
                        that.bounds_.extend(latLng);
                        that.draw();
                    });
                });
                google.maps.event.addDomListener(this.div_, "mouseup", function () {
                    that.map.set("draggable", true);
                    this.style.cursor = "default";
                    google.maps.event.removeListener(that.moveHandler);
                    if (that.afterDragHandler) {
                        var latLng = that.bounds_.getCenter();
                        var param = new EventReturn([
                            latLng.lat(),
                            latLng.lng(),
                        ]);
                        that.afterDragHandler(param, that.object);
                    }
                });
            }
        };
        OverlayGoogle.prototype.draw = function () {
            var overlayProjection = this.getProjection();
            var center = overlayProjection.fromLatLngToDivPixel(this.bounds_.getCenter());
            var div = this.div_;
            div.style.left = center.x + "px";
            div.style.top = center.y + "px";
        };
        OverlayGoogle.prototype.onRemove = function () {
            this.div_.parentNode.removeChild(this.div_);
        };
        this.OverlayGoogle = OverlayGoogle;
    }
    GoogleOverlays.prototype.drawOverlay = function (options, polygons) {
        var bounds = null;
        if (polygons && polygons.length > 0) {
            bounds = this.googlePolygons.getPolygonsBounds(polygons);
        }
        else {
            bounds = new this.google.maps.LatLngBounds();
            bounds.extend(new this.google.maps.LatLng(options.position[0], options.position[1]));
        }
        var overlay = new this.OverlayGoogle(bounds, options.divElement, options.draggable, options.object, options.afterEventDragHandler);
        if (options.addToMap) {
            overlay.setMap(this.map);
        }
        overlay.object = options.object;
        return overlay;
    };
    GoogleOverlays.prototype.toggleOverlay = function (overlays, show) {
        var self = this;
        overlays.forEach(function (overlay) { return overlay.setMap(show ? self.map : null); });
    };
    return GoogleOverlays;
}());
export default GoogleOverlays;
//# sourceMappingURL=google-overlay.js.map
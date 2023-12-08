import EventReturn from '../../features/events/event-return';
var LeafletOverlay = /** @class */ (function () {
    function LeafletOverlay(map, leaflet, leafletPolygons) {
        this.map = {};
        this.leaflet = {};
        this.map = map;
        this.leaflet = leaflet;
        this.leafletPolygons = leafletPolygons;
    }
    LeafletOverlay.prototype.drawOverlay = function (options, polygons) {
        var html = options.divElement.outerHTML;
        var myIcon = new this.leaflet.DivIcon({ html: html });
        var position = polygons && polygons.length > 0 ?
            this.leafletPolygons.getBoundsPolygons(polygons).getCenter() : options.position;
        var overlay = new this.leaflet.Marker(position, { icon: myIcon, draggable: options.draggable });
        if (options.addToMap) {
            overlay.addTo(this.map);
        }
        overlay.object = options.object;
        if (options.draggable && options.afterEventDragHandler) {
            overlay.on('dragend', function (event) {
                var param = new EventReturn([event.target.getLatLng().lat, event.target.getLatLng().lng]);
                options.afterEventDragHandler(param, options.object);
            });
        }
        return overlay;
    };
    LeafletOverlay.prototype.toggleOverlay = function (overlays, show) {
        var self = this;
        overlays.forEach(function (overlay) { return show ? self.map.addLayer(overlay) : self.map.removeLayer(overlay); });
    };
    return LeafletOverlay;
}());
export default LeafletOverlay;
//# sourceMappingURL=leaflet-overlay.js.map
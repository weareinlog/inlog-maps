import EventReturn from "../../features/events/event-return";
var LeafletGeoJson = /** @class */ (function () {
    function LeafletGeoJson(map, leaflet) {
        this.map = {};
        this.leaflet = {};
        this.map = map;
        this.leaflet = leaflet;
    }
    LeafletGeoJson.prototype.loadGEOJson = function (data, options, eventClick) {
        var self = this;
        var objects = self.parseGeoJson(data, options);
        objects.forEach(function (elem) { return self.map.addLayer(elem); });
        if (self.map.options) {
            if (self.map.options.editable) {
                objects.forEach(function (obj) {
                    if (obj.enableEdit) {
                        obj.enableEdit();
                    }
                    if (eventClick) {
                        obj.on("click", function (event) {
                            var param = new EventReturn([
                                event.latlng.lat,
                                event.latlng.lng,
                            ]);
                            eventClick(param);
                        });
                    }
                });
            }
        }
    };
    LeafletGeoJson.prototype.parseGeoJson = function (data, options) {
        var self = this;
        var parsedFeatures = [];
        if (Array.isArray(data.features)) {
            for (var _i = 0, _a = data.features; _i < _a.length; _i++) {
                var feature = _a[_i];
                parsedFeatures.push(self.parseGeoJsonToObject(feature, options));
            }
        }
        else {
            parsedFeatures.push(self.parseGeoJsonToObject(data, options));
        }
        return parsedFeatures;
    };
    LeafletGeoJson.prototype.parseGeoJsonToObject = function (data, objectOptions) {
        var geometry = data.geometry;
        var parsedCoordinates = [];
        if (data.properties) {
            Object.assign(objectOptions, data.properties);
        }
        switch (geometry.type) {
            case "Point":
                parsedCoordinates = geometry.coordinates.reverse();
                return new this.leaflet.Marker(parsedCoordinates, objectOptions);
            case "Polygon":
                geometry.coordinates.forEach(function (polygon) {
                    return parsedCoordinates.push(polygon.map(function (elem) { return elem.reverse(); }));
                });
                return new this.leaflet.Polygon(parsedCoordinates, objectOptions);
            case "LineString":
                parsedCoordinates = geometry.coordinates.map(function (elem) {
                    return elem.reverse();
                });
                return new this.leaflet.Polyline(parsedCoordinates, objectOptions);
            default:
                throw new Error("Unknown object shape.");
        }
    };
    return LeafletGeoJson;
}());
export default LeafletGeoJson;
//# sourceMappingURL=leaflet-geojson.js.map
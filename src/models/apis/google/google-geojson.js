import EventReturn from "../../features/events/event-return";
var GoogleGeoJson = /** @class */ (function () {
    function GoogleGeoJson(map, google) {
        this.map = {};
        this.google = {};
        this.map = map;
        this.google = google;
    }
    GoogleGeoJson.prototype.loadGEOJson = function (data, options, eventClick) {
        var self = this;
        var objects = self.parseGeoJson(data, options);
        objects.forEach(function (elem) {
            if (eventClick) {
                elem.addListener("click", function (event) {
                    var param = new EventReturn([
                        event.latLng.lat(),
                        event.latLng.lng(),
                    ]);
                    eventClick(param);
                });
            }
            elem.setMap(self.map);
        });
    };
    GoogleGeoJson.prototype.parseGeoJson = function (data, options) {
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
    GoogleGeoJson.prototype.parseGeoJsonToObject = function (data, objectOptions) {
        var geometry = data.geometry;
        if (data.properties) {
            Object.assign(objectOptions, data.properties);
        }
        switch (geometry.type) {
            case "Point":
                objectOptions.position = {
                    lat: geometry.coordinates[1],
                    lng: geometry.coordinates[0],
                };
                return new this.google.maps.Marker(objectOptions);
            case "Polygon":
                objectOptions.paths = [];
                geometry.coordinates.forEach(function (polygon) {
                    return objectOptions.paths.push(polygon.map(function (elem) { return ({
                        lat: elem[1],
                        lng: elem[0],
                    }); }));
                });
                return new this.google.maps.Polygon(objectOptions);
            case "LineString":
                objectOptions.path = geometry.coordinates.map(function (elem) { return ({
                    lat: elem[1],
                    lng: elem[0],
                }); });
                return new this.google.maps.Polyline(objectOptions);
            default:
                throw new Error("Forma de objeto desconhecida.");
        }
    };
    return GoogleGeoJson;
}());
export default GoogleGeoJson;
//# sourceMappingURL=google-geojson.js.map
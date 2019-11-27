"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var googleMaps_1 = require("./models/apis/googleMaps");
var leaflet_1 = require("./models/apis/leaflet");
var map_type_1 = require("./models/dto/map-type");
var polyline_options_1 = require("./models/features/polyline/polyline-options");
var Map = /** @class */ (function () {
    function Map() {
        this.mapType = map_type_1.MapType;
        this.markersList = {};
        this.polygonsList = {};
        this.circlesList = {};
        this.polylinesList = {};
        this.infoWindowList = {};
    }
    /**
     * Use this to initialize map
     * @param mapType {inlogMaps.MapType}
     * @param options {any}
     */
    Map.prototype.initialize = function (mapType, options) {
        this.map = mapType === map_type_1.MapType.Google ? new googleMaps_1.default() : new leaflet_1.default();
        return this.map.initialize(mapType, options);
    };
    /* GEOJson */
    /**
     * Use this function to add GEOJSON to the currentMap
     * @param {object} data Geojson
     * @param {inlogMaps.GeoJsonOptions} options
     * @param {any} eventClick is a function callback on click
     */
    Map.prototype.loadGEOJson = function (data, options, eventClick) {
        this.map.loadGEOJson(data, options, eventClick);
    };
    /* Markers */
    /**
     * Use this function to draw markers in the currentMap
     * @param {string} type
     * @param {inlogMaps.MarkerOptions} options
     * @param {any} eventClick is a function callback on click
     */
    Map.prototype.drawMarker = function (type, options, eventClick) {
        var marker = this.map.drawMarker(options, eventClick);
        if (!this.markersList[type]) {
            this.markersList[type] = [];
        }
        marker.type = 'simple';
        this.markersList[type].push(marker);
    };
    /**
     * Use this function to fit bounds in the markers with the especified type
     * @param {string} type
     */
    Map.prototype.fitBoundsMarkers = function (type) {
        if (!this.markersList[type]) {
            this.markersList[type] = [];
        }
        this.map.fitBoundsPositions(this.markersList[type].filter(function (x) { return x.map !== null; }));
    };
    /**
     * Use this function to draw circle markers in the currentMap
     * @param {string} type
     * @param {inlogMaps.CircleMarkerOptions} options
     * @param {any} eventClick is a function callback on click
     */
    Map.prototype.drawCircleMarker = function (type, options, eventClick) {
        var marker = this.map.drawCircleMarker(options, eventClick);
        if (!this.markersList[type]) {
            this.markersList[type] = [];
        }
        marker.type = 'circle';
        this.markersList[type].push(marker);
    };
    /**
     * Use this function to show/hide markers from a specific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toogle markers with the condition
     */
    Map.prototype.toggleMarkers = function (show, type, condition) {
        var markers = condition ? this.getMarkers(type, condition) : this.markersList[type];
        if (markers) {
            this.map.toggleMarkers(markers, show);
        }
    };
    /**
     * Use this function to alter marker style
     * @param {string} type
     * @param {inlogMaps.MarkerAlterOptions} options
     * @param {any} condition alter markers with the condition
     */
    Map.prototype.alterMarkerOptions = function (type, options, condition) {
        var markers = condition ? this.getMarkers(type, condition) : this.markersList[type];
        if (markers && markers.length > 0) {
            this.map.alterMarkerOptions(markers, options);
        }
    };
    /**
     * Use this function to draw or modify markers in the map
     * @param {string} type
     * @param {inlogMaps.MarkerOptions} options
     * @param {any} eventClick is a function callback on click
     * @param {any} condition draw or alter markers with the condition
     */
    // public drawOrAlterMarkers(type: string, options: MarkerOptions, eventClick: any, condition?: any) {
    //     const markers = (this.markersList[type] || []).filter((marker) => condition(marker.object));
    //     if (markers) {
    //         this.map.alterMarkerOptions(markers, options);
    //     } else {
    //         this.drawMarker(type, options, eventClick);
    //     }
    // }
    /**
     * Remove markers from the map and from internal list
     * @param {string} type
     * @param {any} condition remove markers with the condition
     */
    Map.prototype.removeMarkers = function (type, condition) {
        if (!this.markersList[type]) {
            this.markersList[type] = [];
        }
        else {
            var markers = this.markersList[type].filter(function (marker) { return condition(marker.object); });
            // Hide markers with the condition
            this.map.toggleMarkers(markers, false);
            // Keep markers that doesn't have the condition
            this.markersList[type] = this.markersList[type].filter(function (marker) { return !condition(marker.object); });
        }
    };
    /* Polygons */
    /**
     * Use this function to draw polygons
     * @param {string} type
     * @param {inlogMaps.PolygonOptions} options
     * @param {any} eventClick
     */
    Map.prototype.drawPolygon = function (type, options, eventClick) {
        var polygon = this.map.drawPolygon(options, eventClick);
        if (!this.polygonsList[type]) {
            this.polygonsList[type] = [];
        }
        this.polygonsList[type].push(polygon);
    };
    /**
     * Use this function to fit bounds of a polygon
     * @param {string} type
     * @param {any} condition fit polygon bounds with the condition
     */
    Map.prototype.fitBoundsPolygon = function (type, condition) {
        var _this = this;
        var polygons = condition ? this.polygonsList[type] : this.getPolygons(type, condition);
        polygons.array.forEach(function (polygon) { return _this.map.fitBoundsPolygon(polygon); });
    };
    /**
     * Use this function to show/hide polygon from a especific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle polygon with the condition
     */
    Map.prototype.togglePolygons = function (show, type, condition) {
        var polygons = condition ? this.polygonsList[type] : this.getPolygons(type, condition);
        if (polygons) {
            this.map.togglePolygons(polygons, show);
        }
    };
    /**
     * Use this function to alter polygons options/style
     * @param {string} type
     * @param {inlogMaps.PolygonAlterOptions} options
     * @param {any} condition alter polygon with the condition
     */
    Map.prototype.alterPolygonOptions = function (type, options, condition) {
        var polygons = condition ? this.polygonsList[type] : this.getPolygons(type, condition);
        if (polygons) {
            this.map.alterPolygonOptions(polygons, options);
        }
    };
    /* Polylines */
    /**
     * Use this function to draw polylines on the currentMap
     * @param {string} type
     * @param {inlogMaps.PolylineOptions} options
     * @param {any} eventClick
     */
    Map.prototype.drawPolyline = function (type, options, eventClick) {
        var polyline = this.map.drawPolyline(options, eventClick);
        this.polylinesList[type] = polyline;
    };
    /**
     * Use this function to draw polylines with navigation on the currentMap
     * @param {string} type
     * @param {inlogMaps.PolylineOptions} options
     */
    Map.prototype.drawPolylineWithNavigation = function (type, options, eventClick) {
        var polyline = this.map.drawPolylineWithNavigation(options, eventClick);
        this.polylinesList[type] = polyline;
    };
    /**
     * Use this function to add more paths to a polyline
     * @param {string} type
     * @param {number[]} position
     */
    Map.prototype.addPolylinePath = function (type, position) {
        var options = new polyline_options_1.default();
        options.addToMap = true;
        if (!this.polylinesList[type]) {
            this.drawPolyline(type, options, null);
        }
        var polyline = this.polylinesList[type];
        if (polyline) {
            this.map.addPolylinePath(polyline, position);
        }
    };
    /**
     * Use this function to clear polyline selected from the currentMap
     */
    Map.prototype.removePolylineHighlight = function () {
        this.map.removePolylineHighlight();
    };
    /**
     * Use this function to toggle polylines
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle polyline with the condition
     */
    Map.prototype.togglePolyline = function (show, type, condition) {
        var polyline = condition ? this.polylinesList[type] : this.getPolylines(type, condition);
        if (polyline) {
            this.map.togglePolyline(polyline, show);
        }
    };
    /**
     * Use this function to remove polylines
     * @param {string} type
     * @param {any} condition remove polyline with the condition
     */
    Map.prototype.removePolyline = function (type, condition) {
        var polyline = condition ? this.polylinesList[type] : this.getPolylines(type, condition);
        if (polyline) {
            this.map.togglePolyline(polyline, false);
            this.map.clearListenersPolyline(polyline);
        }
        this.polygonsList[type] = null;
    };
    /**
     * Use this function to alter polyline options
     * @param {string} type
     * @param {inlogMaps.PolylineOptions} options
     * @param {any} condition alter polyline with the condition
     */
    Map.prototype.alterPolylineOptions = function (type, options, condition) {
        var polyline = condition ? this.polylinesList[type] : this.getPolylines(type, condition);
        if (polyline) {
            this.map.alterPolylineOptions(polyline, options);
        }
    };
    /* Circles */
    /**
     * Use this function to draw circles on the currentMap
     * @param {string} type
     * @param {inlogMaps.CircleOptions} options
     * @param {any} eventClick
     */
    Map.prototype.drawCircle = function (type, options, eventClick) {
        var circle = this.map.drawCircle(options, eventClick);
        if (!this.circlesList[type]) {
            this.circlesList[type] = [];
        }
        this.circlesList[type].push(circle);
    };
    /**
     * Use this function to show/hide circles from a especific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle circles with the condition
     */
    Map.prototype.toggleCircles = function (show, type, condition) {
        var circles = condition ? this.circlesList[type] : this.getCircles(type, condition);
        if (circles) {
            this.map.toggleCircles(circles, show);
        }
    };
    /**
     * Use this function to alter circle options
     * @param {string} type
     * @param {inlogMaps.CircleAlterOptions} options
     * @param {any} condition alter circle with the condition
     */
    Map.prototype.alterCircleOptions = function (type, options, condition) {
        var circles = condition ? this.circlesList[type] : this.getCircles(type, condition);
        if (circles) {
            this.map.alterCircleOptions(circles, options);
        }
    };
    /* Info Windows */
    /**
     * Use this function to draw popups on the currentMap
     * @param {string} type
     * @param {inlogMaps.PopupOptions} options
     */
    Map.prototype.drawPopup = function (type, options) {
        if (this.infoWindowList[type]) {
            this.map.alterPopup(this.infoWindowList[type], options);
        }
        else {
            var infoWindow = this.map.drawPopup(options);
            this.infoWindowList[type] = infoWindow;
        }
    };
    /**
     * Use this function to alter popups
     * @param {string} type
     * @param {inlogMaps.PopupOptions} options
     */
    Map.prototype.alterPopup = function (type, options) {
        var popups = this.infoWindowList[type];
        if (popups) {
            this.map.alterPopup(popups, options);
        }
    };
    /* Map */
    /**
     * Use this function to add event clicks on the currentMap
     * @param {any} eventClick
     */
    Map.prototype.addClickMap = function (eventClick) {
        this.map.addClickMap(eventClick);
    };
    /**
     * Use this function to remove event clicks from the currentMap
     */
    Map.prototype.removeClickMap = function () {
        this.map.removeClickMap();
    };
    Map.prototype.getMarkers = function (type, condition) {
        var markers = this.markersList[type];
        return markers.filter(function (marker) { return condition(marker.object); });
    };
    Map.prototype.getPolygons = function (type, condition) {
        var polygons = this.polygonsList[type];
        return polygons.filter(function (polygon) { return condition(polygon.object); });
    };
    Map.prototype.getCircles = function (type, condition) {
        var circles = this.circlesList[type];
        return circles.filter(function (circle) { return condition(circle.object); });
    };
    Map.prototype.getPolylines = function (type, condition) {
        var polylines = this.polylinesList[type];
        return polylines.filter(function (polyline) { return condition(polyline.object); });
    };
    return Map;
}());
exports.default = Map;
//# sourceMappingURL=map.js.map

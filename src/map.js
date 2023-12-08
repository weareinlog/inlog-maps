var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import GoogleMaps from "./models/apis/googleMaps";
import Leaflet from "./models/apis/leaflet";
import { MapType } from "./models/dto/map-type";
import MarkerClustererConfig from "./models/features/marker-clusterer/marker-clusterer-config";
import PolylineOptions from "./models/features/polyline/polyline-options";
var Map = /** @class */ (function () {
    function Map() {
        this.markersList = {};
        this.polygonsList = {};
        this.circlesList = {};
        this.polylinesList = {};
        this.infoWindowList = {};
        this.overlayList = {};
        this.map = {};
        this.markerClusterer = {};
        /**/
    }
    /**
     * Use this to initialize map
     * @param {InlogMaps.MapType} mapType
     * @param {any} options
     * @param {string} elementId default: 'inlog-map' [nullable]
     * @returns {Promisse<any>}
     */
    Map.prototype.initialize = function (mapType, options, elementId) {
        var _a;
        if (elementId === void 0) { elementId = "inlog-map"; }
        this.map =
            mapType === MapType.Google ? new GoogleMaps() : new Leaflet();
        return (_a = this.map) === null || _a === void 0 ? void 0 : _a.initialize(mapType, options, elementId);
    };
    /* GEOJson */
    /**
     * Use this function to add GEOJSON to the currentMap
     * @param {object} data Geojson
     * @param {InlogMaps.GeoJsonOptions} options
     * @param {any} eventClick is a function callback on click [nullable]
     */
    Map.prototype.loadGEOJson = function (data, options, eventClick) {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.loadGEOJson(data, options, eventClick);
    };
    /* Markers */
    /**
     * Use this function to draw markers in the currentMap
     * @param {string} type
     * @param {InlogMaps.MarkerOptions} options
     * @param {any} eventClick is a function callback on click [nullable]
     */
    Map.prototype.drawMarker = function (type, options, eventClick) {
        var _a, _b;
        var marker = (_a = this.map) === null || _a === void 0 ? void 0 : _a.drawMarker(options, eventClick);
        if (!this.markersList[type]) {
            this.markersList[type] = [];
        }
        marker.type = "simple";
        this.markersList[type].push(marker);
        if (options.addClusterer) {
            if (!this.markerClusterer[type]) {
                this.addMarkerClusterer(type, new MarkerClustererConfig(true, 1, 10));
            }
            (_b = this.map) === null || _b === void 0 ? void 0 : _b.addMarkerOnClusterer(marker, this.markerClusterer[type]);
        }
    };
    /**
     * Use this function to draw circle markers in the currentMap
     * @param {string} type
     * @param {InlogMaps.CircleMarkerOptions} options
     * @param {any} eventClick is a function callback on click [nullable]
     */
    Map.prototype.drawCircleMarker = function (type, options, eventClick) {
        var _a;
        var marker = (_a = this.map) === null || _a === void 0 ? void 0 : _a.drawCircleMarker(options, eventClick);
        if (!this.markersList[type]) {
            this.markersList[type] = [];
        }
        marker.type = "circle";
        this.markersList[type].push(marker);
    };
    /**
     * Use this function to show/hide markers from a specific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toogle markers with the condition [nullable]
     */
    Map.prototype.toggleMarkers = function (show, type, condition) {
        var _a;
        var markers = this.getMarkers(type, condition);
        if (markers && markers.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.toggleMarkers(markers, show, this.markerClusterer[type]);
        }
    };
    /**
     * Remove markers from the map and from internal list
     * @param {string} type
     * @param {any} condition remove markers with the condition [nullable]
     */
    Map.prototype.removeMarkers = function (type, condition) {
        var _a, _b;
        if (this.markersList[type] && condition) {
            var markers = this.getMarkers(type, condition);
            // Hide markers with the condition
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.toggleMarkers(markers, false, this.markerClusterer[type]);
            // Keep markers that doesn't have the condition
            this.markersList[type] = this.markersList[type].filter(function (marker) { return !condition(marker.object); });
        }
        else {
            if (this.markersList[type]) {
                (_b = this.map) === null || _b === void 0 ? void 0 : _b.toggleMarkers(this.markersList[type], false, this.markerClusterer[type]);
            }
            this.markersList[type] = [];
        }
        if (this.markersList[type].length === 0) {
            delete this.markersList[type];
        }
    };
    /**
     * Remove all markers from the map and from the internal list
     */
    Map.prototype.removeAllMarkers = function () {
        for (var type in this.markersList) {
            if (this.markersList.hasOwnProperty(type)) {
                this.removeMarkers(type);
            }
        }
    };
    /**
     * Use this function to alter marker style
     * @param {string} type
     * @param {InlogMaps.MarkerAlterOptions} options
     * @param {any} condition alter markers with the condition [nullable]
     */
    Map.prototype.alterMarkerOptions = function (type, options, condition) {
        var _a;
        var markers = this.getMarkers(type, condition);
        if (markers && markers.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.alterMarkerOptions(markers, options);
        }
    };
    /**
     * Use this functions to alterar marker position
     * @param {string } type
     * @param {number[]} position
     * @param {boolean} addTransition [nullable]
     * @param {any} condition [nullable]
     */
    Map.prototype.alterMarkerPosition = function (type, position, addTransition, condition) {
        var _a;
        var markers = this.getMarkers(type, condition);
        if (markers && markers.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.alterMarkerPosition(markers, position, addTransition !== null && addTransition !== void 0 ? addTransition : false);
        }
    };
    /**
     * Use this function to fit bounds in the markers with the especified type
     * @param {string} type
     * @param {any} condition [nullable]
     * @param {boolean} onlyMarkersOnMap default true
     */
    Map.prototype.fitBoundsMarkers = function (type, condition, onlyMarkersOnMap) {
        var _this = this;
        var _a;
        if (onlyMarkersOnMap === void 0) { onlyMarkersOnMap = true; }
        var markers = this.getMarkers(type, condition);
        if (onlyMarkersOnMap) {
            markers = markers.filter(function (x) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.isMarkerOnMap(x); });
        }
        if (markers && markers.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.fitBoundsPositions(markers);
        }
    };
    /**
     * Use this functions to set the center of the map on marker
     * @param {string} type
     * @param {any} condition center on marker with the condition [nullable]
     */
    Map.prototype.setCenterMarker = function (type, condition) {
        var _a, _b;
        if (this.markersList[type] && condition) {
            var marker = this.markersList[type].find(function (marker) {
                return condition(marker.object);
            });
            // Center on the marker with the condition
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.setCenterMarker(marker);
        }
        else {
            if (this.markersList[type] && this.markersList[type].length) {
                (_b = this.map) === null || _b === void 0 ? void 0 : _b.setCenterMarker(this.markersList[type][0]);
            }
        }
    };
    /**
     * This functions returns if marker exists
     * @param type
     * @param condition [nullable]
     * @returns {boolean}
     */
    Map.prototype.markerExists = function (type, condition) {
        var markers = this.getMarkers(type, condition);
        return markers && markers.length > 0;
    };
    /**
     * Use this function to count markers by type
     * @param {string} type
     * @param {boolean} onlyOnMap exclude hidden markers, default true
     * @param {any} condition
     * @returns {number}
     */
    Map.prototype.countMarkers = function (type, onlyOnMap, condition) {
        var _this = this;
        var _a, _b;
        if (onlyOnMap === void 0) { onlyOnMap = true; }
        if (this.markerClusterer[type]) {
            return ((_b = (_a = this.map) === null || _a === void 0 ? void 0 : _a.countMarkersOnCluster(this.markerClusterer[type])) !== null && _b !== void 0 ? _b : 0);
        }
        var markers = this.getMarkers(type, condition);
        if (onlyOnMap) {
            markers = markers.filter(function (x) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.isMarkerOnMap(x); });
        }
        return markers.length;
    };
    /**
     * This function add new events on marker
     * @param {string} type
     * @param {InlogMaps.MarkerEventType} event
     * @param {any} eventFunction
     * @param {any} condition [nullable]
     */
    Map.prototype.addMarkerEvent = function (type, event, eventFunction, condition) {
        var _a;
        var markers = this.getMarkers(type, condition);
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.addMarkerEvent(markers, event, eventFunction);
    };
    /**
     * This function remove events of marker
     * @param {string} type
     * @param {InlogMaps.MarkerEventType} event
     * @param {any} condition [nullable]
     */
    Map.prototype.removeMarkerEvent = function (type, event, condition) {
        var _a;
        var markers = this.getMarkers(type, condition);
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.removeMarkerEvent(markers, event);
    };
    /* Marker Clusterer */
    /**
     * Use this function to add MarkerClusterer on the map
     * @param {string} type same type of markers
     * @param {InlogMaps.MarkerClusterConfig} config
     */
    Map.prototype.addMarkerClusterer = function (type, config) {
        var _a;
        this.markerClusterer[type] = (_a = this.map) === null || _a === void 0 ? void 0 : _a.addMarkerClusterer(config);
    };
    /**
     * Use this function to alter clusterer options
     * @param type same type of markers
     * @param {InlogMaps.MarkerClusterConfig} config
     */
    Map.prototype.alterMarkerClustererConfig = function (type, config) {
        var _a;
        if (this.markerClusterer[type]) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.alterMarkerClustererConfig(this.markerClusterer[type], config);
        }
    };
    /**
     * Use this function to redraw marker clusterer
     * @param type same type of markers
     */
    Map.prototype.refreshClusterer = function (type) {
        var _a;
        if (this.markerClusterer[type]) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.refreshClusterer(this.markerClusterer[type]);
        }
    };
    /**
     * Use this to clear markers on clusterer
     * @param type same type of markers
     */
    Map.prototype.clearMarkersClusterer = function (type) {
        var _a;
        if (this.markerClusterer[type]) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.clearMarkersClusterer(this.markerClusterer[type]);
        }
    };
    /* Polygons */
    /**
     * Use this function to draw polygons
     * @param {string} type
     * @param {InlogMaps.PolygonOptions} options
     * @param {any} eventClick [nullable]
     */
    Map.prototype.drawPolygon = function (type, options, eventClick) {
        var _a;
        var polygon = (_a = this.map) === null || _a === void 0 ? void 0 : _a.drawPolygon(options, eventClick);
        if (!this.polygonsList[type]) {
            this.polygonsList[type] = [];
        }
        this.polygonsList[type].push(polygon);
    };
    /**
     * Use this function to show/hide polygon from a especific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle polygon with the condition [nullable]
     */
    Map.prototype.togglePolygons = function (show, type, condition) {
        var _a;
        var polygons = this.getPolygons(type, condition);
        if (polygons && polygons.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.togglePolygons(polygons, show);
        }
    };
    /**
     * Remove polygons from the map and from internal list
     * @param {string} type
     * @param {any} condition remove polygons with the condition [nullable]
     */
    Map.prototype.removePolygons = function (type, condition) {
        var _a, _b;
        if (this.polygonsList[type] && condition) {
            var polygons = this.getPolygons(type, condition);
            // Hide markers with the condition
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.togglePolygons(polygons, false);
            // Keep markers that doesn't have the condition
            this.polygonsList[type] = this.polygonsList[type].filter(function (polygon) { return !condition(polygon.object); });
        }
        else {
            if (this.polygonsList[type]) {
                (_b = this.map) === null || _b === void 0 ? void 0 : _b.togglePolygons(this.polygonsList[type], false);
            }
            this.polygonsList[type] = [];
        }
        if (this.polygonsList[type].length === 0) {
            delete this.polygonsList[type];
        }
    };
    /**
     * Remove all polygons from the map and from the internal list
     */
    Map.prototype.removeAllPolygons = function () {
        for (var type in this.polygonsList) {
            if (this.polygonsList.hasOwnProperty(type)) {
                this.removePolygons(type);
            }
        }
    };
    /**
     * Use this function to alter polygons options/style
     * @param {string} type
     * @param {InlogMaps.PolygonAlterOptions} options
     * @param {any} condition alter polygon with the condition [nullable]
     */
    Map.prototype.alterPolygonOptions = function (type, options, condition) {
        var _a;
        var polygons = this.getPolygons(type, condition);
        if (polygons && polygons.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.alterPolygonOptions(polygons, options);
        }
    };
    /**
     * Use this function to fit bounds of a polygon
     * @param {string} type
     * @param {any} condition fit polygon bounds with the condition [nullable]
     */
    Map.prototype.fitBoundsPolygons = function (type, condition) {
        var _this = this;
        var _a;
        var polygons = this.getPolygons(type, condition).filter(function (polygon) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.isPolygonOnMap(polygon); });
        if (polygons && polygons.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.fitBoundsPolygons(polygons);
        }
    };
    /**
     * Set center on polygon bounds
     * @param {string} type
     * @param {any} condition fit polygon bounds with the condition [nullable]
     */
    Map.prototype.setCenterPolygons = function (type, condition) {
        var _this = this;
        var _a;
        var polygons = this.getPolygons(type, condition).filter(function (polygon) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.isPolygonOnMap(polygon); });
        if (polygons && polygons.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.setCenterPolygons(polygons);
        }
    };
    /**
     * This functions returns if polygon exists
     * @param type
     * @param condition [nullable]
     * @returns {boolean}
     */
    Map.prototype.polygonExists = function (type, condition) {
        var polygons = this.getPolygons(type, condition);
        return polygons && polygons.length > 0;
    };
    /**
     * Use this function to get the path of some polygon
     * @param {string} type
     * @param {any} condition
     * @returns {number[]}
     */
    Map.prototype.getPolygonPath = function (type, condition) {
        var _a, _b;
        var polygon = this.getPolygons(type, condition);
        if (polygon && polygon.length) {
            return (_b = (_a = this.map) === null || _a === void 0 ? void 0 : _a.getPolygonPath(polygon[0])) !== null && _b !== void 0 ? _b : [];
        }
    };
    /**
     * This function add new events on polygon
     * @param {string} type
     * @param {InlogMaps.PolygonEventType} event
     * @param {any} eventFunction
     * @param {any} condition [nullable]
     */
    Map.prototype.addPolygonEvent = function (type, event, eventFunction, condition) {
        var _a;
        var polygons = this.getPolygons(type, condition);
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.addPolygonEvent(polygons, event, eventFunction);
    };
    /**
     * This function remove events of polygon
     * @param {string} type
     * @param {InlogMaps.PolygonEventType} event
     * @param {any} condition [nullable]
     */
    Map.prototype.removePolygonEvent = function (type, event, condition) {
        var _a;
        var polygons = this.getPolygons(type, condition);
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.removePolygonEvent(polygons, event);
    };
    /* Circles */
    /**
     * Use this function to draw circles on the currentMap
     * @param {string} type
     * @param {InlogMaps.CircleOptions} options
     * @param {any} eventClick [nullable]
     */
    Map.prototype.drawCircle = function (type, options, eventClick) {
        var _a;
        var circle = (_a = this.map) === null || _a === void 0 ? void 0 : _a.drawCircle(options, eventClick);
        if (!this.circlesList[type]) {
            this.circlesList[type] = [];
        }
        this.circlesList[type].push(circle);
    };
    /**
     * Use this function to show/hide circles from a especific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle circles with the condition [nullable]
     */
    Map.prototype.toggleCircles = function (show, type, condition) {
        var _a;
        var circles = this.getCircles(type, condition);
        if (circles && circles.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.toggleCircles(circles, show);
        }
    };
    /**
     * Remove circles from the map and from internal list
     * @param {string} type
     * @param {any} condition remove circles with the condition [nullable]
     */
    Map.prototype.removeCircles = function (type, condition) {
        var _a, _b;
        if (this.circlesList[type] && condition) {
            var circles = this.getCircles(type, condition);
            // Hide circles with the condition
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.toggleCircles(circles, false);
            // Keep circles that doesn't have the condition
            this.circlesList[type] = this.circlesList[type].filter(function (circle) { return !condition(circle.object); });
        }
        else {
            if (this.circlesList[type]) {
                (_b = this.map) === null || _b === void 0 ? void 0 : _b.toggleCircles(this.circlesList[type], false);
            }
            this.circlesList[type] = [];
        }
        if (this.circlesList[type].length === 0) {
            delete this.circlesList[type];
        }
    };
    /**
     * Remove all circles from the map and from the internal list
     */
    Map.prototype.removeAllCircles = function () {
        for (var type in this.circlesList) {
            if (this.circlesList.hasOwnProperty(type)) {
                this.removeCircles(type);
            }
        }
    };
    /**
     * Use this function to alter circle options
     * @param {string} type
     * @param {InlogMaps.CircleAlterOptions} options
     * @param {any} condition alter circle with the condition [nullable]
     */
    Map.prototype.alterCircleOptions = function (type, options, condition) {
        var _a;
        var circles = this.getCircles(type, condition);
        if (circles && circles.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.alterCircleOptions(circles, options);
        }
    };
    /**
     * Use this function to fit bounds of a polygon
     * @param {string} type
     * @param {any} condition fit polygon bounds with the condition [nullable]
     */
    Map.prototype.fitBoundsCircles = function (type, condition) {
        var _this = this;
        var _a;
        var circles = this.getCircles(type, condition).filter(function (circle) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.isCircleOnMap(circle); });
        if (circles && circles.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.fitBoundsCircles(circles);
        }
    };
    /**
     * This functions returns if circle exists
     * @param {string} type
     * @param {any} condition [nullable]
     * @returns {boolean}
     */
    Map.prototype.circleExists = function (type, condition) {
        var circles = this.getCircles(type, condition);
        return circles && circles.length > 0;
    };
    /**
     * This function return circle center
     * @param {string} type
     * @param {any} condition [nullable]
     * @returns {number[]}
     */
    Map.prototype.getCircleCenter = function (type, condition) {
        var _a;
        var circles = this.getCircles(type, condition);
        if (circles && circles.length) {
            return (_a = this.map) === null || _a === void 0 ? void 0 : _a.getCircleCenter(circles[0]);
        }
        return null;
    };
    /**
     * This function return circle center
     * @param {string} type
     * @param {any} condition [nullable]
     * @returns {number}
     */
    Map.prototype.getCircleRadius = function (type, condition) {
        var _a;
        var circles = this.getCircles(type, condition);
        if (circles && circles.length) {
            return (_a = this.map) === null || _a === void 0 ? void 0 : _a.getCircleRadius(circles[0]);
        }
        return null;
    };
    /**
     * This function add new events on circle
     * @param {string} type
     * @param {InlogMaps.CircleEventType} event
     * @param {any} eventFunction
     * @param {any} condition [nullable]
     */
    Map.prototype.addCircleEvent = function (type, event, eventFunction, condition) {
        var _a;
        var circles = this.getCircles(type, condition);
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.addCircleEvent(circles, event, eventFunction);
    };
    /**
     * This function remove events of circle
     * @param {string} type
     * @param {InlogMaps.CircleEventType} event
     * @param {any} condition [nullable]
     */
    Map.prototype.removeCircleEvent = function (type, event, condition) {
        var _a;
        var circles = this.getCircles(type, condition);
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.removeCircleEvent(circles, event);
    };
    /* Polylines */
    /**
     * Use this function to draw polylines on the currentMap
     * @param {string} type
     * @param {InlogMaps.PolylineOptions} options
     * @param {any} eventClick [nullable]
     */
    Map.prototype.drawPolyline = function (type, options, eventClick) {
        var _a;
        var polyline = (_a = this.map) === null || _a === void 0 ? void 0 : _a.drawPolyline(options, eventClick);
        if (!this.polylinesList[type]) {
            this.polylinesList[type] = [];
        }
        this.polylinesList[type].push(polyline);
    };
    /**
     * Use this function to draw polylines with navigation on the currentMap
     * @param {string} type
     * @param {InlogMaps.PolylineOptions} options
     */
    Map.prototype.drawPolylineWithNavigation = function (type, options, eventClick) {
        var _a;
        var polyline = (_a = this.map) === null || _a === void 0 ? void 0 : _a.drawPolylineWithNavigation(options, eventClick);
        if (!this.polylinesList[type]) {
            this.polylinesList[type] = [];
        }
        this.polylinesList[type].push(polyline);
    };
    /**
     * Use this function to toggle polylines
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle polyline with the condition [nullable]
     */
    Map.prototype.togglePolylines = function (show, type, condition) {
        var _a;
        var polyline = this.getPolylines(type, condition);
        if (polyline && polyline.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.togglePolylines(polyline, show);
        }
    };
    /**
     * Use this function to remove polylines
     * @param {string} type
     * @param {any} condition remove polyline with the condition [nullable]
     */
    Map.prototype.removePolylines = function (type, condition) {
        var _a, _b;
        if (this.polylinesList[type] && condition) {
            var polylines = this.getPolylines(type, condition);
            // Hide markers with the condition
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.togglePolylines(polylines, false);
            // Keep markers that doesn't have the condition
            this.polylinesList[type] = this.polylinesList[type].filter(function (polyline) { return !condition(polyline.object); });
        }
        else {
            if (this.polylinesList[type]) {
                (_b = this.map) === null || _b === void 0 ? void 0 : _b.togglePolylines(this.polylinesList[type], false);
            }
            this.polylinesList[type] = [];
        }
        if (this.polylinesList[type].length === 0) {
            delete this.polylinesList[type];
        }
    };
    /**
     * Remove all polylines from the map and from the internal list
     */
    Map.prototype.removeAllPolylines = function () {
        for (var type in this.polylinesList) {
            if (this.polylinesList.hasOwnProperty(type)) {
                this.removePolylines(type);
            }
        }
    };
    /**
     * Use this function to alter polyline options
     * @param {string} type
     * @param {InlogMaps.PolylineOptions} options
     * @param {any} condition alter polyline with the condition [nullable]
     */
    Map.prototype.alterPolylineOptions = function (type, options, condition) {
        var _a;
        var polyline = this.getPolylines(type, condition);
        if (polyline && polyline.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.alterPolylineOptions(polyline, options);
        }
    };
    /**
     * Use this functions to fit polylines bounds
     * @param {string} type
     * @param {any} condition [nullable]
     */
    Map.prototype.fitBoundsPolylines = function (type, condition) {
        var _this = this;
        var _a;
        var polylines = this.getPolylines(type, condition).filter(function (polyline) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.isPolylineOnMap(polyline); });
        if (polylines && polylines.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.fitBoundsPolylines(polylines);
        }
    };
    /**
     * This functions returns if polyline exists
     * @param {string} type
     * @param {any} condition [nullable]
     * @returns {boolean}
     */
    Map.prototype.polylineExists = function (type, condition) {
        var polylines = this.getPolylines(type, condition);
        return polylines && polylines.length > 0;
    };
    /**
     * Use this function to add more paths to a polyline
     * @param {string} type
     * @param {number[]} position
     * @param {any} condition [nullable]
     */
    Map.prototype.addPolylinePath = function (type, position, condition) {
        var _a;
        var polyline = this.getPolylines(type, condition);
        if (polyline && polyline.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.addPolylinePath(polyline, position);
        }
        else {
            var options = new PolylineOptions();
            options.addToMap = true;
            this.drawPolyline(type, options, null);
        }
    };
    /**
     * Use this function to get the path of some polyline
     * @param {string} type
     * @param {any} condition
     * @returns {number[]}
     */
    Map.prototype.getPolylinePath = function (type, condition) {
        var polyline = this.getPolylines(type, condition);
        if (polyline && polyline.length) {
            return this.map.getPolylinePath(polyline[0]);
        }
    };
    /**
     * Use this function to clear polyline selected from the currentMap
     */
    Map.prototype.removePolylineHighlight = function () {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.removePolylineHighlight();
    };
    /**
     * Use this function to add listeners on polyline
     * @param {string} type
     * @param {InlogMaps.PolylineEventType} event
     * @param {any} eventFunction
     * @param {any} condition [nullable]
     */
    Map.prototype.addPolylineEvent = function (type, event, eventFunction, condition) {
        var _a;
        var polyline = this.getPolylines(type, condition);
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.addPolylineEvent(polyline, event, eventFunction);
    };
    /**
     * Use this function to remove listeners of polyline
     * @param {string} type
     * @param {InlogMaps.PolylineEventType} event
     * @param {any} condition [nullable]
     */
    Map.prototype.removePolylineEvent = function (type, event, condition) {
        var _a;
        var polyline = this.getPolylines(type, condition);
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.removePolylineEvent(polyline, event);
    };
    /**
     * Use this function to set position of polyline highlight
     * @param {string} type
     * @param {number} initialIndex
     * @param {any} condition [nullable]
     */
    Map.prototype.setIndexPolylineHighlight = function (type, initialIndex, condition) {
        var _a;
        var polylines = this.getPolylines(type, condition);
        if (polylines && polylines.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.setIndexPolylineHighlight(polylines[0], initialIndex);
        }
    };
    /**
     * Use this function to get the object of a polyline
     * @param {string} type
     * @param {any} condition
     * @returns {object}
     */
    Map.prototype.getObjectPolyline = function (type, condition) {
        var _a;
        var polylines = this.getPolylines(type, condition);
        if (polylines && polylines.length) {
            return (_a = this.map) === null || _a === void 0 ? void 0 : _a.getObjectPolyline(polylines[0]);
        }
        else {
            return null;
        }
    };
    /**
     * Use this function to get the object of the polyline highligth
     * @returns {object}
     */
    Map.prototype.getObjectPolylineHighlight = function () {
        var _a;
        return (_a = this.map) === null || _a === void 0 ? void 0 : _a.getObjectPolylineHighlight();
    };
    /**
     * Use this function to add events on polyline highligtht / selected polyline
     * @param {InlogMaps.PolylineEventType} event
     * @param {any} eventFunction
     */
    Map.prototype.addPolylineHighlightEvent = function (event, eventFunction) {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.addPolylineHighlightEvent(event, eventFunction);
    };
    /**
     * Use this function to get initial and final index of the polyline highlight
     * @returns {number[]} returns an array with initial index and final index
     */
    Map.prototype.getPolylineHighlightIndex = function () {
        var _a;
        return (_a = this.map) === null || _a === void 0 ? void 0 : _a.getPolylineHighlightIndex();
    };
    /* Info Windows */
    /**
     * Use this function to draw popups on the currentMap
     * @param {string} type
     * @param {InlogMaps.PopupOptions} options
     */
    Map.prototype.drawPopup = function (type, options) {
        var _a, _b;
        var marker = null;
        if (options.marker) {
            var markers = this.getMarkers(options.marker, options.conditionMarker);
            marker = markers[0];
        }
        var popup;
        if (this.infoWindowList[type]) {
            popup = (_a = this.map) === null || _a === void 0 ? void 0 : _a.alterPopup(this.infoWindowList[type], options, marker);
        }
        else {
            popup = (_b = this.map) === null || _b === void 0 ? void 0 : _b.drawPopup(options, marker);
        }
        this.infoWindowList[type] = popup;
    };
    /**
     * Use this function to alter popups
     * @param {string} type
     * @param {InlogMaps.PopupOptions} options
     */
    Map.prototype.alterPopup = function (type, options) {
        var _a;
        var popups = this.infoWindowList[type];
        var markers;
        if (options.marker) {
            markers = this.getMarkers(options.marker, options.conditionMarker);
        }
        if (popups) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.alterPopupContent(popups, options, markers ? markers[0] : null);
        }
    };
    /**
     *
     * @param {string} type
     * @returns {object}
     */
    Map.prototype.getObjectOpenPopup = function (type) {
        return this.infoWindowList[type]
            ? this.infoWindowList[type].object
            : null;
    };
    /**
     * Use this function to close popup by type
     * @param {string} type
     */
    Map.prototype.closePopup = function (type) {
        var _a;
        if (this.infoWindowList[type]) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.closePopup(this.infoWindowList[type]);
        }
    };
    /**
     * Use this function to close all popups
     * @param {string} type
     */
    Map.prototype.closeAllPopups = function () {
        for (var type in this.infoWindowList) {
            if (this.infoWindowList.hasOwnProperty(type)) {
                this.closePopup(type);
            }
        }
    };
    /* Map */
    /**
     * Resize de map based on html size
     */
    Map.prototype.resizeMap = function () {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.resizeMap();
    };
    /**
     * Use this function to add event clicks on the currentMap
     * @param {InlogMaps.MapEventType} eventType
     * @param eventFunction function callback
     */
    Map.prototype.addEventMap = function (eventType, eventFunction) {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.addEventMap(eventType, eventFunction);
    };
    /**
     * Use this function to remove event clicks from the currentMap
     * @param {InlogMaps.MapEventType} eventType
     */
    Map.prototype.removeEventMap = function (eventType) {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.removeEventMap(eventType);
    };
    /**
     * Returns the current zoom level of the map view
     * @returns {number}
     */
    Map.prototype.getZoom = function () {
        var _a;
        return (_a = this.map) === null || _a === void 0 ? void 0 : _a.getZoom();
    };
    /**
     * Set the current zoom level of the map view
     * @param {number} zoom
     */
    Map.prototype.setZoom = function (zoom) {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.setZoom(zoom);
    };
    /**
     * Takes a screenshot with all the context included in it (visible area)
     * Returns the image as a base64 string or null
     * @returns {Promise<string | null>}
     */
    Map.prototype.takeMapScreenshot = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.map) === null || _a === void 0 ? void 0 : _a.takeMapScreenshot())];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     * Returns the center position of the map
     * @returns {number[]}
     */
    Map.prototype.getCenter = function () {
        var _a;
        return (_a = this.map) === null || _a === void 0 ? void 0 : _a.getCenter();
    };
    /**
     * Set the position center of the map
     * @param {number[]} position
     */
    Map.prototype.setCenter = function (position) {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.setCenter(position);
    };
    /**
     * Returns the coordinates from pixels
     * @param {number} offsetx
     * @param {number} offsety
     * @returns {number[]}
     */
    Map.prototype.pixelsToLatLng = function (offsetx, offsety) {
        var _a;
        return (_a = this.map) === null || _a === void 0 ? void 0 : _a.pixelsToLatLng(offsetx, offsety);
    };
    /**
     * Use this functions to fit bounds on elements with same type and condition
     * @param {string} type
     * @param {any} condition [nullable]
     */
    Map.prototype.fitBoundsElements = function (type, condition) {
        var _this = this;
        var _a;
        var markers = this.getMarkers(type, condition).filter(function (marker) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.isMarkerOnMap(marker); });
        var circles = this.getCircles(type, condition).filter(function (circle) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.isCircleOnMap(circle); });
        var polygons = this.getPolygons(type, condition).filter(function (polygon) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.isPolygonOnMap(polygon); });
        var polylines = this.getPolylines(type, condition).filter(function (polyline) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.isPolylineOnMap(polyline); });
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.fitBoundsElements(markers, circles, polygons, polylines);
    };
    /* Overlay */
    /**
     * Use this function to dray overlays on the current map
     * @param {string} type
     * @param {InlogMaps.OverlayOptions} options
     */
    Map.prototype.drawOverlay = function (type, options) {
        var _a, _b;
        var overlay = null;
        if (options.polygon) {
            var polygons = this.getPolygons(options.polygon, options.conditionPolygon);
            if (polygons && polygons.length) {
                overlay = (_a = this.map) === null || _a === void 0 ? void 0 : _a.drawOverlay(options, polygons);
            }
        }
        else {
            overlay = (_b = this.map) === null || _b === void 0 ? void 0 : _b.drawOverlay(options);
        }
        if (overlay != null) {
            if (!this.overlayList[type]) {
                this.overlayList[type] = [];
            }
            this.overlayList[type].push(overlay);
        }
    };
    /**
     * Use this function to show or hide overlay
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition [nullable]
     */
    Map.prototype.toggleOverlay = function (show, type, condition) {
        var _a;
        var overlays = this.getOverlays(type, condition);
        if (overlays && overlays.length) {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.toggleOverlay(overlays, show);
        }
    };
    /**
     * Remove overlays from the map and from internal list
     * @param {string} type
     * @param {any} condition remove overlays with the condition [nullable]
     */
    Map.prototype.removeOverlays = function (type, condition) {
        var _a, _b;
        if (this.overlayList[type] && condition) {
            var overlays = this.getOverlays(type, condition);
            // Hide markers with the condition
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.toggleOverlay(overlays, false);
            // Keep markers that doesn't have the condition
            this.overlayList[type] = this.overlayList[type].filter(function (overlay) { return !condition(overlay.object); });
        }
        else {
            if (this.overlayList[type]) {
                (_b = this.map) === null || _b === void 0 ? void 0 : _b.toggleOverlay(this.overlayList[type], false);
            }
            this.overlayList[type] = [];
        }
        if (this.overlayList[type].length === 0) {
            delete this.overlayList[type];
        }
    };
    /**
     * Remove all overlays from the map and from the internal list
     */
    Map.prototype.removeAllOverlays = function () {
        for (var type in this.overlayList) {
            if (this.overlayList.hasOwnProperty(type)) {
                this.removeOverlays(type);
            }
        }
    };
    /* Private Methods */
    Map.prototype.getMarkers = function (type, condition) {
        var markers = this.markersList[type];
        if (markers && markers.length) {
            return condition
                ? markers.filter(function (marker) { return condition(marker.object); })
                : markers;
        }
        else
            return [];
    };
    Map.prototype.getPolygons = function (type, condition) {
        var polygons = this.polygonsList[type];
        if (polygons && polygons.length) {
            return condition
                ? polygons.filter(function (polygon) { return condition(polygon.object); })
                : polygons;
        }
        else
            return [];
    };
    Map.prototype.getCircles = function (type, condition) {
        var circles = this.circlesList[type];
        if (circles && circles.length) {
            return condition
                ? circles.filter(function (circle) { return condition(circle.object); })
                : circles;
        }
        else
            return [];
    };
    Map.prototype.getPolylines = function (type, condition) {
        var polylines = this.polylinesList[type];
        if (polylines && polylines.length) {
            return condition
                ? polylines.filter(function (polyline) {
                    return condition(polyline.object);
                })
                : polylines;
        }
        else
            return [];
    };
    Map.prototype.getOverlays = function (type, condition) {
        var overlays = this.overlayList[type];
        if (overlays && overlays.length) {
            return condition
                ? overlays.filter(function (overlay) { return condition(overlay.object); })
                : overlays;
        }
        else
            return [];
    };
    return Map;
}());
export default Map;
//# sourceMappingURL=map.js.map
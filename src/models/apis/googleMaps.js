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
import { MapsApiLoaderService } from "../../utils/maps-api-loader.service";
import GoogleCircles from "./google/google-circles";
import GoogleGeoJson from "./google/google-geojson";
import GoogleMap from "./google/google-map";
import GoogleMarkers from "./google/google-markers";
import GoogleOverlays from "./google/google-overlay";
import GooglePolygons from "./google/google-polygons";
import GooglePolylines from "./google/google-polylines";
import GooglePopups from "./google/google-popup";
var GoogleMaps = /** @class */ (function () {
    function GoogleMaps() {
        this.elementId = "";
        this.googleMarkers = null;
        this.googlePolygons = null;
        this.googleCircles = null;
        this.googlePolylines = null;
        this.googlePopups = null;
        this.googleMap = null;
        this.googleOverlays = null;
        this.googleGeoJson = null;
        this.mapsApiLoader = new MapsApiLoaderService();
        /* */
    }
    GoogleMaps.prototype.initialize = function (mapType, params, elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var api, google_1, options, key, imageMapTypes_1, ids_1, map_1, trafficLayer, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.mapsApiLoader.loadApi(mapType, params)];
                    case 1:
                        api = _a.sent();
                        google_1 = api;
                        options = {
                            center: new google_1.maps.LatLng(-14, -54),
                            fullscreenControl: false,
                            keyboardShortcuts: false,
                            mapTypeControl: true,
                            minZoom: 4,
                            rotateControl: false,
                            scaleControl: false,
                            streetViewControl: false,
                            zoom: 4,
                            zoomControl: true,
                        };
                        if (params.gestureHandling) {
                            options.gestureHandling = "cooperative";
                        }
                        else {
                            options.gestureHandling = "greedy";
                        }
                        if (params.options) {
                            for (key in params.options) {
                                if (params.options.hasOwnProperty(key)) {
                                    options[key] = params.options[key];
                                }
                            }
                        }
                        imageMapTypes_1 = [];
                        if (params.mapTiles) {
                            ids_1 = [
                                google_1.maps.MapTypeId.ROADMAP,
                                google_1.maps.MapTypeId.SATELLITE,
                            ];
                            params.mapTiles.forEach(function (tile) {
                                ids_1.push(tile.name);
                                var mapTypeOptions = {
                                    getTileUrl: function (coord, zoom) {
                                        return "https://tile.openstreetmap.org/".concat(zoom, "/").concat(coord.x, "/").concat(coord.y, ".png");
                                    },
                                    isPng: true,
                                    maxZoom: 19,
                                    minZoom: 0,
                                    name: "OpenStreetMap",
                                    tileSize: new google_1.maps.Size(256, 256),
                                };
                                for (var key in tile) {
                                    if (tile.hasOwnProperty(key)) {
                                        mapTypeOptions[key] = tile[key];
                                    }
                                }
                                var imageMapType = new google_1.maps.ImageMapType(mapTypeOptions);
                                imageMapTypes_1.push({ id: tile.name, tile: imageMapType });
                            });
                            options.mapTypeControlOptions = {
                                mapTypeIds: ids_1,
                                style: google_1.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                            };
                        }
                        map_1 = new google_1.maps.Map(document.getElementById(elementId), options);
                        this.elementId = elementId;
                        this.googleMarkers = new GoogleMarkers(map_1, google_1);
                        this.googlePolygons = new GooglePolygons(map_1, google_1);
                        this.googleCircles = new GoogleCircles(map_1, google_1);
                        this.googlePopups = new GooglePopups(map_1, google_1);
                        this.googlePolylines = new GooglePolylines(map_1, google_1, this.googlePopups);
                        this.googleMap = new GoogleMap(map_1, google_1);
                        this.googleOverlays = new GoogleOverlays(map_1, google_1, this.googlePolygons);
                        this.googleGeoJson = new GoogleGeoJson(map_1, google_1);
                        if (imageMapTypes_1 && imageMapTypes_1.length) {
                            imageMapTypes_1.forEach(function (image) {
                                map_1.mapTypes.set(image.id, image.tile);
                            });
                        }
                        if (params.showTraffic) {
                            trafficLayer = new google_1.maps.TrafficLayer();
                            trafficLayer.setMap(map_1);
                        }
                        return [2 /*return*/, this];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, err_1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* GEOJson */
    GoogleMaps.prototype.loadGEOJson = function (data, options, eventClick) {
        var _a;
        (_a = this.googleGeoJson) === null || _a === void 0 ? void 0 : _a.loadGEOJson(data, options, eventClick);
    };
    /* Markers */
    GoogleMaps.prototype.drawMarker = function (options, eventClick) {
        var _a;
        return (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.drawMarker(options, eventClick);
    };
    GoogleMaps.prototype.drawCircleMarker = function (options, eventClick) {
        var _a;
        return (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.drawCircleMarker(options, eventClick);
    };
    GoogleMaps.prototype.toggleMarkers = function (markers, show, markerClusterer) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.toggleMarkers(markers, show, markerClusterer);
    };
    GoogleMaps.prototype.alterMarkerOptions = function (markers, options) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.alterMarkerOptions(markers, options);
    };
    GoogleMaps.prototype.alterMarkerPosition = function (markers, position, addTransition) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.alterMarkerPosition(markers, position, addTransition);
    };
    GoogleMaps.prototype.fitBoundsPositions = function (markers) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.fitBoundsPositions(markers);
    };
    GoogleMaps.prototype.isMarkerOnMap = function (marker) {
        var _a;
        return (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.isMarkerOnMap(marker);
    };
    GoogleMaps.prototype.setCenterMarker = function (marker) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.setCenterMarker(marker);
    };
    GoogleMaps.prototype.addMarkerEvent = function (markers, eventType, eventFunction) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.addMarkerEvent(markers, eventType, eventFunction);
    };
    GoogleMaps.prototype.removeMarkerEvent = function (markers, event) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.removeMarkerEvent(markers, event);
    };
    /* Marker Clusterer */
    GoogleMaps.prototype.addMarkerClusterer = function (config) {
        var _a;
        return (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.addMarkerClusterer(config);
    };
    GoogleMaps.prototype.alterMarkerClustererConfig = function (markerClusterer, config) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.alterMarkerClustererConfig(markerClusterer, config);
    };
    GoogleMaps.prototype.refreshClusterer = function (markerClusterer) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.refreshClusterer(markerClusterer);
    };
    GoogleMaps.prototype.addMarkerOnClusterer = function (marker, markerClusterer) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.addMarkerOnClusterer(marker, markerClusterer);
    };
    GoogleMaps.prototype.removeMarkerFromClusterer = function (marker, markerClusterer) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.removeMarkerFromClusterer(marker, markerClusterer);
    };
    GoogleMaps.prototype.clearMarkersClusterer = function (markerClusterer) {
        var _a;
        (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.clearMarkersClusterer(markerClusterer);
    };
    GoogleMaps.prototype.countMarkersOnCluster = function (markerClusterer) {
        var _a;
        return (_a = this.googleMarkers) === null || _a === void 0 ? void 0 : _a.countMarkersOnCluster(markerClusterer);
    };
    /* Polygons */
    GoogleMaps.prototype.drawPolygon = function (options, eventClick) {
        var _a;
        return (_a = this.googlePolygons) === null || _a === void 0 ? void 0 : _a.drawPolygon(options, eventClick);
    };
    GoogleMaps.prototype.togglePolygons = function (polygons, show) {
        var _a;
        (_a = this.googlePolygons) === null || _a === void 0 ? void 0 : _a.togglePolygons(polygons, show);
    };
    GoogleMaps.prototype.alterPolygonOptions = function (polygons, options) {
        var _a;
        (_a = this.googlePolygons) === null || _a === void 0 ? void 0 : _a.alterPolygonOptions(polygons, options);
    };
    GoogleMaps.prototype.fitBoundsPolygons = function (polygons) {
        var _a;
        (_a = this.googlePolygons) === null || _a === void 0 ? void 0 : _a.fitBoundsPolygons(polygons);
    };
    GoogleMaps.prototype.setCenterPolygons = function (polygons) {
        var _a;
        (_a = this.googlePolygons) === null || _a === void 0 ? void 0 : _a.setCenterPolygons(polygons);
    };
    GoogleMaps.prototype.isPolygonOnMap = function (polygon) {
        var _a;
        return (_a = this.googlePolygons) === null || _a === void 0 ? void 0 : _a.isPolygonOnMap(polygon);
    };
    GoogleMaps.prototype.getPolygonPath = function (polygon) {
        var _a;
        return (_a = this.googlePolygons) === null || _a === void 0 ? void 0 : _a.getPolygonPath(polygon);
    };
    GoogleMaps.prototype.addPolygonEvent = function (polygons, eventType, eventFunction) {
        var _a;
        return (_a = this.googlePolygons) === null || _a === void 0 ? void 0 : _a.addPolygonEvent(polygons, eventType, eventFunction);
    };
    GoogleMaps.prototype.removePolygonEvent = function (polygons, event) {
        var _a;
        (_a = this.googlePolygons) === null || _a === void 0 ? void 0 : _a.removePolygonEvent(polygons, event);
    };
    /* Circles */
    GoogleMaps.prototype.drawCircle = function (options, eventClick) {
        var _a;
        return (_a = this.googleCircles) === null || _a === void 0 ? void 0 : _a.drawCircle(options, eventClick);
    };
    GoogleMaps.prototype.toggleCircles = function (circles, show) {
        var _a;
        (_a = this.googleCircles) === null || _a === void 0 ? void 0 : _a.toggleCircles(circles, show);
    };
    GoogleMaps.prototype.alterCircleOptions = function (circles, options) {
        var _a;
        (_a = this.googleCircles) === null || _a === void 0 ? void 0 : _a.alterCircleOptions(circles, options);
    };
    GoogleMaps.prototype.fitBoundsCircles = function (circles) {
        var _a;
        (_a = this.googleCircles) === null || _a === void 0 ? void 0 : _a.fitBoundsCircles(circles);
    };
    GoogleMaps.prototype.isCircleOnMap = function (circle) {
        var _a;
        return (_a = this.googleCircles) === null || _a === void 0 ? void 0 : _a.isCircleOnMap(circle);
    };
    GoogleMaps.prototype.getCircleCenter = function (circle) {
        var _a;
        return (_a = this.googleCircles) === null || _a === void 0 ? void 0 : _a.getCircleCenter(circle);
    };
    GoogleMaps.prototype.getCircleRadius = function (circle) {
        var _a;
        return (_a = this.googleCircles) === null || _a === void 0 ? void 0 : _a.getCircleRadius(circle);
    };
    GoogleMaps.prototype.addCircleEvent = function (circles, eventType, eventFunction) {
        var _a;
        (_a = this.googleCircles) === null || _a === void 0 ? void 0 : _a.addCircleEvent(circles, eventType, eventFunction);
    };
    GoogleMaps.prototype.removeCircleEvent = function (circles, event) {
        var _a;
        (_a = this.googleCircles) === null || _a === void 0 ? void 0 : _a.removeCircleEvent(circles, event);
    };
    /* Polylines */
    GoogleMaps.prototype.drawPolyline = function (options, eventClick) {
        var _a;
        return (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.drawPolyline(options, eventClick);
    };
    GoogleMaps.prototype.drawPolylineWithNavigation = function (options, eventClick) {
        var _a;
        return (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.drawPolylineWithNavigation(options, eventClick);
    };
    GoogleMaps.prototype.togglePolylines = function (polylines, show) {
        var _a;
        (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.togglePolylines(polylines, show);
    };
    GoogleMaps.prototype.alterPolylineOptions = function (polylines, options) {
        var _a;
        (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.alterPolylineOptions(polylines, options);
    };
    GoogleMaps.prototype.fitBoundsPolylines = function (polylines) {
        var _a;
        (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.fitBoundsPolylines(polylines);
    };
    GoogleMaps.prototype.isPolylineOnMap = function (polyline) {
        var _a;
        return (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.isPolylineOnMap(polyline);
    };
    GoogleMaps.prototype.addPolylinePath = function (polylines, position) {
        var _a;
        (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.addPolylinePath(polylines, position);
    };
    GoogleMaps.prototype.getPolylinePath = function (polyline) {
        var _a;
        return (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.getPolylinePath(polyline);
    };
    GoogleMaps.prototype.removePolylineHighlight = function () {
        var _a;
        (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.removePolylineHighlight();
    };
    GoogleMaps.prototype.addPolylineEvent = function (polylines, eventType, eventFunction) {
        var _a;
        (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.addPolylineEvent(polylines, eventType, eventFunction);
    };
    GoogleMaps.prototype.removePolylineEvent = function (polylines, event) {
        var _a;
        (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.removePolylineEvent(polylines, event);
    };
    GoogleMaps.prototype.setIndexPolylineHighlight = function (polyline, index) {
        var _a;
        (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.setIndexPolylineHighlight(polyline, index);
    };
    GoogleMaps.prototype.getObjectPolyline = function (polyline) {
        var _a;
        return (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.getObjectPolyline(polyline);
    };
    GoogleMaps.prototype.getObjectPolylineHighlight = function () {
        var _a;
        return (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.getObjectPolylineHighlight();
    };
    GoogleMaps.prototype.addPolylineHighlightEvent = function (eventType, eventFunction) {
        var _a;
        (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.addPolylineHighlightEvent(eventType, eventFunction);
    };
    GoogleMaps.prototype.getPolylineHighlightIndex = function () {
        var _a;
        return (_a = this.googlePolylines) === null || _a === void 0 ? void 0 : _a.getPolylineHighlightIndex();
    };
    /* Info Windows */
    GoogleMaps.prototype.drawPopup = function (options, marker) {
        var _a;
        return (_a = this.googlePopups) === null || _a === void 0 ? void 0 : _a.drawPopup(options, marker);
    };
    GoogleMaps.prototype.alterPopup = function (popup, options, marker) {
        var _a;
        return (_a = this.googlePopups) === null || _a === void 0 ? void 0 : _a.alterPopup(popup, options, marker);
    };
    GoogleMaps.prototype.alterPopupContent = function (popup, options, marker) {
        var _a;
        (_a = this.googlePopups) === null || _a === void 0 ? void 0 : _a.alterPopupContent(popup, options, marker);
    };
    GoogleMaps.prototype.closePopup = function (popup) {
        var _a;
        (_a = this.googlePopups) === null || _a === void 0 ? void 0 : _a.closePopup(popup);
    };
    /* Map */
    GoogleMaps.prototype.resizeMap = function () {
        var _a;
        (_a = this.googleMap) === null || _a === void 0 ? void 0 : _a.resizeMap();
    };
    GoogleMaps.prototype.addEventMap = function (eventType, eventFunction) {
        var _a;
        (_a = this.googleMap) === null || _a === void 0 ? void 0 : _a.addEventMap(eventType, eventFunction);
    };
    GoogleMaps.prototype.removeEventMap = function (eventType) {
        var _a;
        (_a = this.googleMap) === null || _a === void 0 ? void 0 : _a.removeEventMap(eventType);
    };
    GoogleMaps.prototype.getZoom = function () {
        var _a;
        return (_a = this.googleMap) === null || _a === void 0 ? void 0 : _a.getZoom();
    };
    GoogleMaps.prototype.setZoom = function (zoom) {
        var _a;
        (_a = this.googleMap) === null || _a === void 0 ? void 0 : _a.setZoom(zoom);
    };
    GoogleMaps.prototype.takeMapScreenshot = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var image;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.googleMap) === null || _a === void 0 ? void 0 : _a.takeScreenShot(this.elementId))];
                    case 1:
                        image = _b.sent();
                        return [2 /*return*/, image];
                }
            });
        });
    };
    GoogleMaps.prototype.getCenter = function () {
        var _a;
        return (_a = this.googleMap) === null || _a === void 0 ? void 0 : _a.getCenter();
    };
    GoogleMaps.prototype.setCenter = function (position) {
        var _a;
        (_a = this.googleMap) === null || _a === void 0 ? void 0 : _a.setCenter(position);
    };
    GoogleMaps.prototype.pixelsToLatLng = function (offsetx, offsety) {
        var _a;
        return (_a = this.googleMap) === null || _a === void 0 ? void 0 : _a.pixelsToLatLng(offsetx, offsety);
    };
    GoogleMaps.prototype.fitBoundsElements = function (markers, circles, polygons, polylines) {
        var _a;
        (_a = this.googleMap) === null || _a === void 0 ? void 0 : _a.fitBoundsElements(markers, circles, polygons, polylines);
    };
    /* Overlay */
    GoogleMaps.prototype.drawOverlay = function (options, polygons) {
        var _a;
        return (_a = this.googleOverlays) === null || _a === void 0 ? void 0 : _a.drawOverlay(options, polygons);
    };
    GoogleMaps.prototype.toggleOverlay = function (overlays, show) {
        var _a;
        (_a = this.googleOverlays) === null || _a === void 0 ? void 0 : _a.toggleOverlay(overlays, show);
    };
    return GoogleMaps;
}());
export default GoogleMaps;
//# sourceMappingURL=googleMaps.js.map
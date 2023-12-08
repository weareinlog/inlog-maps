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
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import { MapsApiLoaderService } from "../../utils/maps-api-loader.service";
import LeafletCircles from "./leaflet/leaflet-circle";
import LeafletGeoJson from "./leaflet/leaflet-geojson";
import LeafletMap from "./leaflet/leaflet-map";
import LeafletMarkers from "./leaflet/leaflet-markers";
import LeafletOverlays from "./leaflet/leaflet-overlay";
import LeafletPolygons from "./leaflet/leaflet-polygons";
import LeafletPolylines from "./leaflet/leaflet-polylines";
import LeafletPopups from "./leaflet/leaflet-popup";
var Leaflet = /** @class */ (function () {
    function Leaflet() {
        this.leafletMarkers = null;
        this.leafletPolygons = null;
        this.leafletCircles = null;
        this.leafletPolylines = null;
        this.leafletPopups = null;
        this.leafletMap = null;
        this.leafletOverlays = null;
        this.leafletGeoJson = null;
        this.mapsApiLoader = new MapsApiLoaderService();
        /* */
    }
    Leaflet.prototype.initialize = function (mapType, params, elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var api, leaflet_1, mapOptions, osm, wikimedia, satelliteURL, satellite, map, baseLayers_1, snapshotOptions, screenshoter, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.mapsApiLoader.loadApi(mapType, params)];
                    case 1:
                        api = _a.sent();
                        leaflet_1 = api;
                        this.loadDependencies(params);
                        return [4 /*yield*/, this.mapTimeout(1000)];
                    case 2:
                        _a.sent();
                        mapOptions = {
                            center: new leaflet_1.LatLng(-14, -54),
                            editable: true,
                            keyboard: false,
                            maxZoom: params.wikimedia ? 18 : 19,
                            minZoom: 4,
                            zoom: 4,
                            zoomControl: false,
                        };
                        if (params.gestureHandling) {
                            mapOptions.gestureHandling = true;
                        }
                        return [4 /*yield*/, this.mapTimeout(200)];
                    case 3:
                        _a.sent();
                        osm = new leaflet_1.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", mapOptions);
                        wikimedia = new leaflet_1.tileLayer("https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png", {
                            attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
                        });
                        satelliteURL = "https://server.arcgisonline.com/ArcGIS/rest/services/" +
                            "World_Imagery/MapServer/tile/{z}/{y}/{x}";
                        satellite = L.tileLayer(satelliteURL, {
                            attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye," +
                                " Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
                            maxZoom: 18,
                        });
                        mapOptions.layers = [params.wikimedia ? wikimedia : osm];
                        map = new leaflet_1.Map(elementId, mapOptions);
                        baseLayers_1 = {
                            Map: params.wikimedia ? wikimedia : osm,
                            Satellite: satellite,
                        };
                        if (params.mapTiles && params.mapTiles.length) {
                            params.mapTiles.forEach(function (tile) {
                                var layer = new leaflet_1.tileLayer(tile.url, tile.options);
                                baseLayers_1[tile.name] = layer;
                            });
                        }
                        leaflet_1.control
                            .layers(baseLayers_1, null, { position: "topleft" })
                            .addTo(map);
                        leaflet_1.control.zoom({ position: "bottomright" }).addTo(map);
                        snapshotOptions = {
                            hideElementsWithSelectors: [
                                ".leaflet-control-container",
                                ".leaflet-dont-include-pane",
                                "#snapshot-button",
                            ],
                            hidden: true,
                        };
                        screenshoter = new SimpleMapScreenshoter(snapshotOptions);
                        this.leafletScreenshot = screenshoter.addTo(map);
                        this.leafletMarkers = new LeafletMarkers(map, leaflet_1);
                        this.leafletPolygons = new LeafletPolygons(map, leaflet_1);
                        this.leafletCircles = new LeafletCircles(map, leaflet_1);
                        this.leafletPopups = new LeafletPopups(map, leaflet_1);
                        this.leafletPolylines = new LeafletPolylines(map, leaflet_1, this.leafletPopups);
                        this.leafletMap = new LeafletMap(map, leaflet_1);
                        this.leafletOverlays = new LeafletOverlays(map, leaflet_1, this.leafletPolygons);
                        this.leafletGeoJson = new LeafletGeoJson(map, leaflet_1);
                        return [2 /*return*/, this];
                    case 4:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, err_1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /* GEOJson */
    Leaflet.prototype.loadGEOJson = function (data, options, eventClick) {
        var _a;
        (_a = this.leafletGeoJson) === null || _a === void 0 ? void 0 : _a.loadGEOJson(data, options, eventClick);
    };
    /* Markers */
    Leaflet.prototype.drawMarker = function (options, eventClick) {
        var _a;
        return (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.drawMarker(options, eventClick);
    };
    Leaflet.prototype.drawCircleMarker = function (options, eventClick) {
        var _a;
        return (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.drawCircleMarker(options, eventClick);
    };
    Leaflet.prototype.toggleMarkers = function (markers, show, markerClusterer) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.toggleMarkers(markers, show, markerClusterer);
    };
    Leaflet.prototype.alterMarkerOptions = function (markers, options) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.alterMarkerOptions(markers, options);
    };
    Leaflet.prototype.alterMarkerPosition = function (markers, position, addTransition) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.alterMarkerPosition(markers, position, addTransition);
    };
    Leaflet.prototype.fitBoundsPositions = function (markers) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.fitBoundsPositions(markers);
    };
    Leaflet.prototype.isMarkerOnMap = function (marker) {
        var _a;
        return (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.isMarkerOnMap(marker);
    };
    Leaflet.prototype.setCenterMarker = function (marker) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.setCenterMarker(marker);
    };
    Leaflet.prototype.addMarkerEvent = function (markers, eventType, eventFunction) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.addMarkerEvent(markers, eventType, eventFunction);
    };
    Leaflet.prototype.removeMarkerEvent = function (markers, event) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.removeMarkerEvent(markers, event);
    };
    /* Marker Clusterer */
    Leaflet.prototype.addMarkerClusterer = function (config) {
        var _a;
        return (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.addMarkerClusterer(config);
    };
    Leaflet.prototype.alterMarkerClustererConfig = function (markerClusterer, config) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.alterMarkerClustererConfig(markerClusterer, config);
    };
    Leaflet.prototype.refreshClusterer = function (markerClusterer) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.refreshClusterer(markerClusterer);
    };
    Leaflet.prototype.addMarkerOnClusterer = function (marker, markerClusterer) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.addMarkerOnClusterer(marker, markerClusterer);
    };
    Leaflet.prototype.removeMarkerFromClusterer = function (marker, markerClusterer) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.removeMarkerFromClusterer(marker, markerClusterer);
    };
    Leaflet.prototype.clearMarkersClusterer = function (markerClusterer) {
        var _a;
        (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.clearMarkersClusterer(markerClusterer);
    };
    Leaflet.prototype.countMarkersOnCluster = function (markerClusterer) {
        var _a;
        return (_a = this.leafletMarkers) === null || _a === void 0 ? void 0 : _a.countMarkersOnCluster(markerClusterer);
    };
    /* Polygons */
    Leaflet.prototype.drawPolygon = function (options, eventClick) {
        var _a;
        return (_a = this.leafletPolygons) === null || _a === void 0 ? void 0 : _a.drawPolygon(options, eventClick);
    };
    Leaflet.prototype.togglePolygons = function (polygons, show) {
        var _a;
        (_a = this.leafletPolygons) === null || _a === void 0 ? void 0 : _a.togglePolygons(polygons, show);
    };
    Leaflet.prototype.alterPolygonOptions = function (polygons, options) {
        var _a;
        (_a = this.leafletPolygons) === null || _a === void 0 ? void 0 : _a.alterPolygonOptions(polygons, options);
    };
    Leaflet.prototype.fitBoundsPolygons = function (polygons) {
        var _a;
        (_a = this.leafletPolygons) === null || _a === void 0 ? void 0 : _a.fitBoundsPolygons(polygons);
    };
    Leaflet.prototype.setCenterPolygons = function (polygons) {
        var _a;
        (_a = this.leafletPolygons) === null || _a === void 0 ? void 0 : _a.setCenterPolygons(polygons);
    };
    Leaflet.prototype.isPolygonOnMap = function (polygon) {
        var _a;
        return (_a = this.leafletPolygons) === null || _a === void 0 ? void 0 : _a.isPolygonOnMap(polygon);
    };
    Leaflet.prototype.getPolygonPath = function (polygon) {
        var _a;
        return (_a = this.leafletPolygons) === null || _a === void 0 ? void 0 : _a.getPolygonPath(polygon);
    };
    Leaflet.prototype.addPolygonEvent = function (polygons, eventType, eventFunction) {
        var _a;
        (_a = this.leafletPolygons) === null || _a === void 0 ? void 0 : _a.addPolygonEvent(polygons, eventType, eventFunction);
    };
    Leaflet.prototype.removePolygonEvent = function (polygons, event) {
        var _a;
        (_a = this.leafletPolygons) === null || _a === void 0 ? void 0 : _a.removePolygonEvent(polygons, event);
    };
    /* Circles */
    Leaflet.prototype.drawCircle = function (options, eventClick) {
        var _a;
        return (_a = this.leafletCircles) === null || _a === void 0 ? void 0 : _a.drawCircle(options, eventClick);
    };
    Leaflet.prototype.toggleCircles = function (circles, show) {
        var _a;
        (_a = this.leafletCircles) === null || _a === void 0 ? void 0 : _a.toggleCircles(circles, show);
    };
    Leaflet.prototype.alterCircleOptions = function (circles, options) {
        var _a;
        (_a = this.leafletCircles) === null || _a === void 0 ? void 0 : _a.alterCircleOptions(circles, options);
    };
    Leaflet.prototype.fitBoundsCircles = function (circles) {
        var _a;
        (_a = this.leafletCircles) === null || _a === void 0 ? void 0 : _a.fitBoundsCircles(circles);
    };
    Leaflet.prototype.isCircleOnMap = function (circle) {
        var _a;
        return (_a = this.leafletCircles) === null || _a === void 0 ? void 0 : _a.isCircleOnMap(circle);
    };
    Leaflet.prototype.getCircleCenter = function (circle) {
        var _a;
        return (_a = this.leafletCircles) === null || _a === void 0 ? void 0 : _a.getCircleCenter(circle);
    };
    Leaflet.prototype.getCircleRadius = function (circle) {
        var _a;
        return (_a = this.leafletCircles) === null || _a === void 0 ? void 0 : _a.getCircleRadius(circle);
    };
    Leaflet.prototype.addCircleEvent = function (circles, eventType, eventFunction) {
        var _a;
        (_a = this.leafletCircles) === null || _a === void 0 ? void 0 : _a.addCircleEvent(circles, eventType, eventFunction);
    };
    Leaflet.prototype.removeCircleEvent = function (circles, event) {
        var _a;
        (_a = this.leafletCircles) === null || _a === void 0 ? void 0 : _a.removeCircleEvent(circles, event);
    };
    /* Polylines */
    Leaflet.prototype.drawPolyline = function (options, eventClick) {
        var _a;
        return (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.drawPolyline(options, eventClick);
    };
    Leaflet.prototype.drawPolylineWithNavigation = function (options, eventClick) {
        var _a;
        return (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.drawPolylineWithNavigation(options, eventClick);
    };
    Leaflet.prototype.togglePolylines = function (polylines, show) {
        var _a;
        (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.togglePolylines(polylines, show);
    };
    Leaflet.prototype.alterPolylineOptions = function (polylines, options) {
        var _a;
        (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.alterPolylineOptions(polylines, options);
    };
    Leaflet.prototype.fitBoundsPolylines = function (polylines) {
        var _a;
        (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.fitBoundsPolylines(polylines);
    };
    Leaflet.prototype.isPolylineOnMap = function (polyline) {
        var _a;
        return (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.isPolylineOnMap(polyline);
    };
    Leaflet.prototype.addPolylinePath = function (polylines, position) {
        var _a;
        (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.addPolylinePath(polylines, position);
    };
    Leaflet.prototype.getPolylinePath = function (polyline) {
        var _a;
        return (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.getPolylinePath(polyline);
    };
    Leaflet.prototype.removePolylineHighlight = function () {
        var _a;
        (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.removePolylineHighlight();
    };
    Leaflet.prototype.addPolylineEvent = function (polylines, eventType, eventFunction) {
        var _a;
        (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.addPolylineEvent(polylines, eventType, eventFunction);
    };
    Leaflet.prototype.removePolylineEvent = function (polylines, event) {
        var _a;
        (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.removePolylineEvent(polylines, event);
    };
    Leaflet.prototype.setIndexPolylineHighlight = function (polyline, index) {
        var _a;
        (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.setIndexPolylineHighlight(polyline, index);
    };
    Leaflet.prototype.getObjectPolyline = function (polyline) {
        var _a;
        return (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.getObjectPolyline(polyline);
    };
    Leaflet.prototype.getObjectPolylineHighlight = function () {
        var _a;
        return (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.getObjectPolylineHighlight();
    };
    Leaflet.prototype.addPolylineHighlightEvent = function (eventType, eventFunction) {
        var _a;
        (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.addPolylineHighlightEvent(eventType, eventFunction);
    };
    Leaflet.prototype.getPolylineHighlightIndex = function () {
        var _a;
        return (_a = this.leafletPolylines) === null || _a === void 0 ? void 0 : _a.getPolylineHighlightIndex();
    };
    /* Popups */
    Leaflet.prototype.drawPopup = function (options, marker) {
        var _a;
        return (_a = this.leafletPopups) === null || _a === void 0 ? void 0 : _a.drawPopup(options, marker);
    };
    Leaflet.prototype.alterPopup = function (popup, options, marker) {
        var _a;
        return (_a = this.leafletPopups) === null || _a === void 0 ? void 0 : _a.alterPopup(popup, options, marker);
    };
    Leaflet.prototype.alterPopupContent = function (popup, options, marker) {
        var _a;
        (_a = this.leafletPopups) === null || _a === void 0 ? void 0 : _a.alterPopupContent(popup, options, marker);
    };
    Leaflet.prototype.closePopup = function (popup) {
        var _a;
        (_a = this.leafletPopups) === null || _a === void 0 ? void 0 : _a.closePopup(popup);
    };
    /* Map */
    Leaflet.prototype.resizeMap = function () {
        var _a;
        (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.resizeMap();
    };
    Leaflet.prototype.addEventMap = function (eventType, eventFunction) {
        var _a;
        (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.addEventMap(eventType, eventFunction);
    };
    Leaflet.prototype.removeEventMap = function (eventType) {
        var _a;
        (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.removeEventMap(eventType);
    };
    Leaflet.prototype.getZoom = function () {
        var _a;
        return (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.getZoom();
    };
    Leaflet.prototype.setZoom = function (zoom) {
        var _a;
        (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.setZoom(zoom);
    };
    Leaflet.prototype.takeMapScreenshot = function () {
        return __awaiter(this, void 0, void 0, function () {
            var image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.leafletScreenshot.takeScreen("image")];
                    case 1:
                        image = _a.sent();
                        return [2 /*return*/, image];
                }
            });
        });
    };
    Leaflet.prototype.getCenter = function () {
        var _a;
        return (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.getCenter();
    };
    Leaflet.prototype.setCenter = function (position) {
        var _a;
        (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.setCenter(position);
    };
    Leaflet.prototype.pixelsToLatLng = function (offsetx, offsety) {
        var _a;
        return (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.pixelsToLatLng(offsetx, offsety);
    };
    Leaflet.prototype.fitBoundsElements = function (markers, circles, polygons, polylines) {
        var _a;
        (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.fitBoundsElements(markers, circles, polygons, polylines);
    };
    /* Overlay */
    Leaflet.prototype.drawOverlay = function (options, polygons) {
        var _a;
        return (_a = this.leafletOverlays) === null || _a === void 0 ? void 0 : _a.drawOverlay(options, polygons);
    };
    Leaflet.prototype.toggleOverlay = function (overlays, show) {
        var _a;
        (_a = this.leafletOverlays) === null || _a === void 0 ? void 0 : _a.toggleOverlay(overlays, show);
    };
    /* Private Methods */
    Leaflet.prototype.mapTimeout = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    Leaflet.prototype.loadDependencies = function (params) {
        var styles = params.cssDependencies;
        if (styles && styles.length > 0) {
            styles.forEach(function (path) {
                var _a;
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = path;
                (_a = document === null || document === void 0 ? void 0 : document.querySelector("head")) === null || _a === void 0 ? void 0 : _a.appendChild(link);
            });
        }
        var scripts = params.scriptsDependencies;
        if (scripts && scripts.length > 0) {
            scripts.forEach(function (path) {
                var _a;
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = path;
                (_a = document.querySelector("head")) === null || _a === void 0 ? void 0 : _a.appendChild(script);
            });
        }
    };
    return Leaflet;
}());
export default Leaflet;
//# sourceMappingURL=leaflet.js.map
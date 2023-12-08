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
import { MapEventType } from "../../dto/event-type";
import EventReturn from "../../features/events/event-return";
var LeafletMap = /** @class */ (function () {
    function LeafletMap(map, leaflet) {
        this.map = {};
        this.leaflet = {};
        this.map = map;
        this.leaflet = leaflet;
    }
    LeafletMap.prototype.resizeMap = function () {
        this.map.invalidateSize();
    };
    LeafletMap.prototype.addEventMap = function (eventType, eventFunction) {
        var self = this;
        switch (eventType) {
            case MapEventType.Click:
                self.map.on("click", function (event) {
                    var param = new EventReturn([
                        event.latlng.lat,
                        event.latlng.lng,
                    ]);
                    eventFunction(param);
                });
                break;
            case MapEventType.ZoomChanged:
                self.map.on("zoomend", function (event) {
                    var param = new EventReturn([
                        event.target.getCenter().lat,
                        event.target.getCenter().lng,
                    ]);
                    eventFunction(param);
                });
                break;
            default:
                break;
        }
    };
    LeafletMap.prototype.removeEventMap = function (eventType) {
        var self = this;
        switch (eventType) {
            case MapEventType.Click:
                self.map.off("click");
                break;
            case MapEventType.ZoomChanged:
                self.map.off("zoomend");
                break;
            default:
                break;
        }
    };
    LeafletMap.prototype.getZoom = function () {
        return this.map.getZoom();
    };
    LeafletMap.prototype.setZoom = function (zoom) {
        this.map.setZoom(zoom);
    };
    LeafletMap.prototype.takeScreenShot = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.leaflet.takeMapScreenshot()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LeafletMap.prototype.getCenter = function () {
        var center = this.map.getCenter();
        return [center.lat, center.lng];
    };
    LeafletMap.prototype.setCenter = function (position) {
        this.map.panTo(position);
    };
    LeafletMap.prototype.pixelsToLatLng = function (offsetx, offsety) {
        var scale = Math.pow(2, this.map.getZoom());
        var worldCoordinateCenter = this.leaflet.CRS.Simple.project(this.map.getCenter());
        var pixelOffset = new this.leaflet.Point(offsetx / scale || 0, offsety / scale || 0);
        var worldCoordinateNewCenter = new this.leaflet.Point(worldCoordinateCenter.x - pixelOffset.x, worldCoordinateCenter.y + pixelOffset.y);
        var latlng = this.leaflet.CRS.Simple.unproject(worldCoordinateNewCenter);
        return [latlng.lat, latlng.lng];
    };
    LeafletMap.prototype.fitBoundsElements = function (markers, circles, polygons, polylines) {
        var group = [];
        if (markers && markers.length) {
            markers.forEach(function (marker) { return group.push(marker); });
        }
        if (circles && circles.length) {
            circles.forEach(function (circle) { return group.push(circle); });
        }
        if (polygons && polygons.length) {
            polygons.forEach(function (polygon) { return group.push(polygon); });
        }
        if (polylines && polylines.length) {
            polylines.forEach(function (polyline) { return group.push(polyline); });
        }
        if (group && group.length) {
            var bounds = this.leaflet.featureGroup(group).getBounds();
            this.map.fitBounds(bounds);
        }
    };
    return LeafletMap;
}());
export default LeafletMap;
//# sourceMappingURL=leaflet-map.js.map
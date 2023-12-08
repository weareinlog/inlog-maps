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
import html2canvas from "html2canvas";
import { MapEventType } from "../../dto/event-type";
import EventReturn from "../../features/events/event-return";
var GoogleMap = /** @class */ (function () {
    function GoogleMap(map, google) {
        this.map = null;
        this.google = null;
        this.map = map;
        this.google = google;
    }
    GoogleMap.prototype.resizeMap = function () {
        google.maps.event.trigger(this.map, "resize");
    };
    GoogleMap.prototype.addEventMap = function (eventType, eventFunction) {
        var self = this;
        switch (eventType) {
            case MapEventType.Click:
                this.google.maps.event.addListener(self.map, "click", function (event) {
                    var param = new EventReturn([
                        event.latLng.lat(),
                        event.latLng.lng(),
                    ]);
                    eventFunction(param);
                });
                break;
            case MapEventType.ZoomChanged:
                self.map.addListener("zoom_changed", function () {
                    var param = new EventReturn([
                        self.map.getCenter().lat(),
                        self.map.getCenter().lng(),
                    ]);
                    eventFunction(param);
                });
                break;
            default:
                break;
        }
    };
    GoogleMap.prototype.removeEventMap = function (eventType) {
        var self = this;
        switch (eventType) {
            case MapEventType.Click:
                this.google.maps.event.clearListeners(self.map, "click");
                break;
            case MapEventType.ZoomChanged:
                this.google.maps.event.clearListeners(self.map, "zoom_changed");
                break;
            default:
                break;
        }
    };
    GoogleMap.prototype.getZoom = function () {
        return this.map.getZoom();
    };
    GoogleMap.prototype.setZoom = function (zoom) {
        return this.map.setZoom(zoom);
    };
    GoogleMap.prototype.takeScreenShot = function (elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var image, element, canvas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        image = "";
                        element = document.getElementById(elementId);
                        if (!element) return [3 /*break*/, 2];
                        return [4 /*yield*/, html2canvas(element, {
                                useCORS: true,
                                allowTaint: true,
                            })];
                    case 1:
                        canvas = _a.sent();
                        image = canvas.toDataURL("image/png", 1.0);
                        _a.label = 2;
                    case 2: return [2 /*return*/, image];
                }
            });
        });
    };
    GoogleMap.prototype.getCenter = function () {
        var center = this.map.getCenter();
        return [center.lat(), center.lng()];
    };
    GoogleMap.prototype.setCenter = function (position) {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.setCenter(new google.maps.LatLng(position[0], position[1]));
    };
    GoogleMap.prototype.pixelsToLatLng = function (offsetx, offsety) {
        var scale = Math.pow(2, this.map.getZoom());
        var worldCoordinateCenter = this.map
            .getProjection()
            .fromLatLngToPoint(this.map.getCenter());
        var pixelOffset = new google.maps.Point(offsetx / scale || 0, offsety / scale || 0);
        var worldCoordinateNewCenter = new google.maps.Point(worldCoordinateCenter.x - pixelOffset.x, worldCoordinateCenter.y + pixelOffset.y);
        var latlng = this.map
            .getProjection()
            .fromPointToLatLng(worldCoordinateNewCenter);
        return [latlng.lat(), latlng.lng()];
    };
    GoogleMap.prototype.fitBoundsElements = function (markers, circles, polygons, polylines) {
        var bounds = new google.maps.LatLngBounds();
        if (markers && markers.length) {
            markers.forEach(function (marker) {
                return bounds.extend(marker.getPosition());
            });
            this.map.fitBounds(bounds);
        }
        if (circles && circles.length) {
            circles.forEach(function (circle) { return bounds.union(circle.getBounds()); });
            this.map.fitBounds(bounds);
        }
        if (polygons && polygons.length) {
            polygons.forEach(function (polygon) {
                return polygon
                    .getPaths()
                    .forEach(function (path) {
                    return path
                        .getArray()
                        .forEach(function (ponto) { return bounds.extend(ponto); });
                });
            });
            this.map.fitBounds(bounds);
        }
        if (polylines && polylines.length) {
            polylines.forEach(function (polyline) {
                return polyline
                    .getPath()
                    .forEach(function (path) {
                    return bounds.extend(new google.maps.LatLng(path.lat(), path.lng()));
                });
            });
            this.map.fitBounds(bounds);
        }
    };
    return GoogleMap;
}());
export default GoogleMap;
//# sourceMappingURL=google-map.js.map
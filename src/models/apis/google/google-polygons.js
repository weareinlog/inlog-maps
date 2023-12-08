import { PolygonEventType } from "../../dto/event-type";
import EventReturn from "../../features/events/event-return";
var GooglePolygons = /** @class */ (function () {
    function GooglePolygons(map, google) {
        this.map = {};
        this.google = {};
        this.map = map;
        this.google = google;
    }
    GooglePolygons.prototype.drawPolygon = function (options, eventClick) {
        var self = this;
        var paths = this.getPathRecursiveArray(options.path);
        paths = this.getPathPolylineArray(paths);
        var newOptions = {
            draggable: options.draggable,
            editable: options.editable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            object: options.object,
            paths: paths,
            strokeColor: options.color,
            strokeOpacity: options.opacity,
            strokeWeight: options.weight,
            suppressUndo: true,
            zIndex: options.zIndex,
        };
        var polygon = new this.google.maps.Polygon(newOptions);
        if (eventClick) {
            this.google.maps.event.addListener(polygon, "click", function (event) {
                var param = new EventReturn([
                    event.latLng.lat(),
                    event.latLng.lng(),
                ]);
                eventClick(param, options.object);
            });
        }
        if (options.addToMap) {
            polygon.setMap(self.map);
        }
        if (options.fitBounds) {
            self.map.fitBounds(self.getPolygonBounds(polygon));
        }
        return polygon;
    };
    GooglePolygons.prototype.togglePolygons = function (polygons, show) {
        var self = this;
        polygons.forEach(function (polygon) { return polygon.setMap(show ? self.map : null); });
    };
    GooglePolygons.prototype.alterPolygonOptions = function (polygons, options) {
        var newOptions = {};
        polygons.forEach(function (polygon) {
            newOptions = {
                editable: options.editable !== null && options.editable !== undefined
                    ? options.editable
                    : polygon.editable,
                fillColor: options.fillColor
                    ? options.fillColor
                    : polygon.fillColor,
                fillOpacity: options.fillOpacity
                    ? options.fillOpacity
                    : polygon.fillOpacity,
                strokeColor: options.color
                    ? options.color
                    : polygon.strokeColor,
                strokeOpacity: options.opacity
                    ? options.opacity
                    : polygon.strokeOpacity,
                strokeWeight: options.weight
                    ? options.weight
                    : polygon.strokeWeight,
                draggable: options.draggable !== null &&
                    options.draggable !== undefined
                    ? options.draggable
                    : polygon.draggable,
            };
            if (options.path) {
                var paths_1 = [];
                options.path.forEach(function (path) {
                    return paths_1.push({ lat: path[0], lng: path[1] });
                });
                polygon.setPath(paths_1);
            }
            polygon.setOptions(newOptions);
            if (options.object) {
                polygon.object = options.object;
            }
        });
    };
    GooglePolygons.prototype.fitBoundsPolygons = function (polygons) {
        this.map.fitBounds(this.getPolygonsBounds(polygons));
    };
    GooglePolygons.prototype.setCenterPolygons = function (polygons) {
        this.map.setCenter(this.getPolygonsBounds(polygons).getCenter());
    };
    GooglePolygons.prototype.isPolygonOnMap = function (polygon) {
        return !!polygon.map;
    };
    GooglePolygons.prototype.getPolygonPath = function (polygon) {
        return polygon
            .getPaths()
            .getArray()
            .map(function (x) {
            return x
                .getArray()
                .map(function (y) {
                return new EventReturn([y.lat(), y.lng()]);
            });
        });
    };
    GooglePolygons.prototype.addPolygonEvent = function (polygons, eventType, eventFunction) {
        var _this = this;
        polygons.forEach(function (polygon) {
            switch (eventType) {
                case PolygonEventType.SetAt:
                    _this.addPolygonEventMove(polygon, eventFunction);
                    break;
                case PolygonEventType.InsertAt:
                    _this.addPolygonEventInsertAt(polygon, eventFunction);
                    break;
                case PolygonEventType.RemoveAt:
                    _this.addPolygonEventRemoveAt(polygon, eventFunction);
                    break;
                case PolygonEventType.DragPolygon:
                    _this.addPolygonEventDragPolygon(polygon, eventFunction);
                    break;
                case PolygonEventType.Click:
                    _this.addPolygonEventClick(polygon, eventFunction);
                    break;
                default:
                    break;
            }
        });
    };
    GooglePolygons.prototype.removePolygonEvent = function (polygons, event) {
        var _this = this;
        polygons.forEach(function (polygon) {
            switch (event) {
                case PolygonEventType.SetAt:
                    _this.google.maps.event.clearListeners(polygon.getPaths(), "set_at");
                    break;
                case PolygonEventType.InsertAt:
                    _this.google.maps.event.clearListeners(polygon.getPaths(), "insert_at");
                    break;
                case PolygonEventType.RemoveAt:
                    _this.google.maps.event.clearListeners(polygon.getPaths(), "remove_at");
                    break;
                case PolygonEventType.DragPolygon:
                    _this.google.maps.event.clearListeners(polygon, "dragstart");
                    _this.google.maps.event.clearListeners(polygon, "dragend");
                    break;
                case PolygonEventType.Click:
                    _this.google.maps.event.clearListeners(polygon, "click");
                    break;
                default:
                    break;
            }
        });
    };
    GooglePolygons.prototype.getPolygonsBounds = function (polygons) {
        var bounds = new this.google.maps.LatLngBounds();
        polygons.forEach(function (polygon) {
            var paths = polygon.getPaths().getArray();
            paths.forEach(function (path) {
                return path.getArray().forEach(function (x) { return bounds.extend(x); });
            });
        });
        return bounds;
    };
    GooglePolygons.prototype.getPolygonBounds = function (polygon) {
        var bounds = new this.google.maps.LatLngBounds();
        var paths = polygon.getPaths().getArray();
        paths.forEach(function (path) {
            return path.getArray().forEach(function (x) { return bounds.extend(x); });
        });
        return bounds;
    };
    GooglePolygons.prototype.addPolygonEventMove = function (polygon, eventFunction) {
        var polygonPathIdx = polygon.getPaths().getLength();
        for (var index = 0; index < polygonPathIdx; index++) {
            this.addPolygonEventMoveAllPaths(polygon, polygon.getPaths().getAt(index), eventFunction);
        }
    };
    GooglePolygons.prototype.addPolygonEventMoveAllPaths = function (polygon, innerPolygon, eventFunction) {
        this.google.maps.event.addListener(innerPolygon, "set_at", function (newEvent, lastEvent) {
            if (polygon.dragging)
                return;
            var path = innerPolygon.getAt(newEvent);
            var newPosition = new EventReturn([path.lat(), path.lng()]);
            var lastPosition = new EventReturn([
                lastEvent.lat(),
                lastEvent.lng(),
            ]);
            eventFunction(newPosition, lastPosition, polygon.object, newEvent, polygon
                .getPaths()
                .getArray()
                .map(function (x) {
                return x
                    .getArray()
                    .map(function (y) { return new EventReturn([y.lat(), y.lng()]); });
            }));
        });
    };
    GooglePolygons.prototype.addPolygonEventInsertAt = function (polygon, eventFunction) {
        var polygonPathIdx = polygon.getPaths().getLength();
        for (var index = 0; index < polygonPathIdx; index++) {
            this.addPolygonEventInsertAtAllPaths(polygon, polygon.getPaths().getAt(index), eventFunction);
        }
    };
    GooglePolygons.prototype.addPolygonEventInsertAtAllPaths = function (polygon, innerPolygon, eventFunction) {
        this.google.maps.event.addListener(innerPolygon, "insert_at", function (event) {
            var newPath = innerPolygon.getAt(event);
            var newPoint = new EventReturn([
                newPath.lat(),
                newPath.lng(),
            ]);
            var previousPath = innerPolygon.getAt(event - 1);
            var previousPoint = previousPath
                ? new EventReturn([previousPath.lat(), previousPath.lng()])
                : null;
            eventFunction(newPoint, previousPoint, polygon.object, event, polygon
                .getPaths()
                .getArray()
                .map(function (x) {
                return x
                    .getArray()
                    .map(function (y) { return new EventReturn([y.lat(), y.lng()]); });
            }));
        });
    };
    GooglePolygons.prototype.addPolygonEventRemoveAt = function (polygon, eventFunction) {
        var polygonPathIdx = polygon.getPaths().getLength();
        for (var index = 0; index < polygonPathIdx; index++) {
            this.addPolygonEventRemoveAtAllPaths(polygon, polygon.getPaths().getAt(index), eventFunction);
        }
    };
    GooglePolygons.prototype.addPolygonEventRemoveAtAllPaths = function (polygon, innerPolygon, eventFunction) {
        this.google.maps.event.addListener(innerPolygon, "remove_at", function (event) {
            var param = new EventReturn([
                innerPolygon.getAt(event).lat(),
                innerPolygon.getAt(event).lng(),
            ]);
            eventFunction(param, polygon
                .getPaths()
                .getArray()
                .map(function (x) {
                return x
                    .getArray()
                    .map(function (y) { return new EventReturn([y.lat(), y.lng()]); });
            }), polygon.object);
        });
    };
    GooglePolygons.prototype.addPolygonEventDragPolygon = function (polygon, eventFunction) {
        this.google.maps.event.addListener(polygon, "dragstart", function (event) {
            polygon.dragging = true;
        });
        this.google.maps.event.addListener(polygon, "dragend", function (event) {
            polygon.dragging = false;
            eventFunction(polygon
                .getPaths()
                .getArray()
                .map(function (x) {
                return x
                    .getArray()
                    .map(function (y) {
                    return new EventReturn([y.lat(), y.lng()]);
                });
            }), polygon.object);
        });
    };
    GooglePolygons.prototype.addPolygonEventClick = function (polygon, eventFunction) {
        this.google.maps.event.addListener(polygon, "click", function (event) {
            var param = new EventReturn([
                event.latLng.lat(),
                event.latLng.lng(),
            ]);
            eventFunction(param, polygon.object);
        });
    };
    GooglePolygons.prototype.getPathRecursiveArray = function (path) {
        var _this = this;
        if (Array.isArray(path) && typeof path[0] !== "number") {
            return path.map(function (x) { return _this.getPathRecursiveArray(x); });
        }
        else
            return { lat: path[0], lng: path[1] };
    };
    GooglePolygons.prototype.getPathPolylineArray = function (path) {
        if (typeof path[0].lat === "number") {
            return path;
        }
        else if (typeof path[0][0].lat !== "number") {
            path = path[0];
            return this.getPathPolylineArray(path);
        }
        else
            return path;
    };
    return GooglePolygons;
}());
export default GooglePolygons;
//# sourceMappingURL=google-polygons.js.map
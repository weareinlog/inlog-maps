import { PolygonEventType } from '../../dto/event-type';
import EventReturn from '../../features/events/event-return';
var LeafletPolygons = /** @class */ (function () {
    function LeafletPolygons(map, leaflet) {
        this.map = {};
        this.leaflet = {};
        this.map = map;
        this.leaflet = leaflet;
    }
    LeafletPolygons.prototype.drawPolygon = function (options, eventClick) {
        var self = this;
        var newOptions = {
            color: options.color || '#000',
            draggable: options.draggable,
            fillColor: options.fillColor || '#fff',
            fillOpacity: options.fillOpacity || 1,
            opacity: options.opacity || 1,
            weight: options.weight || 2
        };
        var polygon = new this.leaflet.Polygon(options.path, newOptions);
        if (eventClick) {
            polygon.on('click', function (event) {
                self.leaflet.DomEvent.stopPropagation(event);
                var param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, event.target.object);
            });
        }
        if (options.addToMap) {
            polygon.addTo(self.map);
            if (options.editable) {
                polygon.enableEdit();
            }
        }
        if (options.object) {
            polygon.object = options.object;
        }
        if (options.fitBounds) {
            self.map.fitBounds(polygon.getBounds());
        }
        return polygon;
    };
    LeafletPolygons.prototype.togglePolygons = function (polygons, show) {
        var self = this;
        polygons.forEach(function (polygon) { return show ? self.map.addLayer(polygon) : self.map.removeLayer(polygon); });
    };
    LeafletPolygons.prototype.alterPolygonOptions = function (polygons, options) {
        polygons.forEach(function (polygon) {
            var style = {
                color: options.color ? options.color : polygon.options.color,
                draggable: options.draggable ? options.draggable : polygon.options.draggable,
                fillColor: options.fillColor ? options.fillColor : polygon.options.fillColor,
                fillOpacity: options.fillOpacity ? options.fillOpacity : polygon.options.fillOpacity,
                opacity: options.opacity ? options.opacity : polygon.options.opacity,
                weight: options.weight ? options.weight : polygon.options.weight
            };
            if (options.path) {
                polygon.setLatLngs(options.path);
            }
            polygon.setStyle(style);
            if (options.editable !== null && options.editable !== undefined) {
                polygon.disableEdit();
                if (options.editable) {
                    polygon.enableEdit();
                }
            }
            if (options.object) {
                polygon.object = options.object;
            }
        });
    };
    LeafletPolygons.prototype.fitBoundsPolygons = function (polygons) {
        this.map.fitBounds(this.getBoundsPolygons(polygons));
    };
    LeafletPolygons.prototype.setCenterPolygons = function (polygons) {
        this.map.panTo(this.getBoundsPolygons(polygons).getCenter());
    };
    LeafletPolygons.prototype.isPolygonOnMap = function (polygon) {
        return this.map.hasLayer(polygon);
    };
    LeafletPolygons.prototype.getPolygonPath = function (polygon) {
        return polygon.getLatLngs()[0].map(function (x) { return [x.lat, x.lng]; });
    };
    LeafletPolygons.prototype.addPolygonEvent = function (polygons, eventType, eventFunction) {
        var _this = this;
        var self = this;
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
                    _this.addPolygonEventClick(polygon, eventFunction, self);
                    break;
                default:
                    break;
            }
        });
    };
    LeafletPolygons.prototype.removePolygonEvent = function (polygons, event) {
        polygons.forEach(function (polygon) {
            switch (event) {
                case PolygonEventType.SetAt:
                    polygon.off('editable:vertex:dragstart');
                    break;
                case PolygonEventType.InsertAt:
                    polygon.off('editable:vertex:new');
                    break;
                case PolygonEventType.RemoveAt:
                    polygon.off('editable:vertex:clicked');
                    polygon.off('editable:vertex:deleted');
                    break;
                case PolygonEventType.DragPolygon:
                    polygon.off('dragend');
                    break;
                case PolygonEventType.Click:
                    polygon.off('click');
                    break;
            }
        });
    };
    LeafletPolygons.prototype.getBoundsPolygons = function (polygons) {
        var group = new this.leaflet.FeatureGroup(polygons);
        return group.getBounds();
    };
    LeafletPolygons.prototype.addPolygonEventMove = function (polygon, eventFunction) {
        polygon.on('editable:vertex:dragstart', function (eventStart) {
            var lastPosition = new EventReturn([eventStart.vertex.latlng.lat, eventStart.vertex.latlng.lng]);
            polygon.on('editable:vertex:dragend', function (eventEnd) {
                var newPosition = new EventReturn([eventEnd.vertex.latlng.lat, eventEnd.vertex.latlng.lng]);
                var path = polygon.getLatLngs().map(function (x) {
                    if (Array.isArray(x[0])) {
                        return x.map(function (y) { return y.map(function (z) { return new EventReturn([z.lat, z.lng]); }); });
                    }
                    else {
                        return [x.map(function (y) { return new EventReturn([y.lat, y.lng]); })];
                    }
                });
                eventFunction(newPosition, lastPosition, eventEnd.target.object, eventEnd.vertex.getIndex(), path[0]);
                polygon.off('editable:vertex:dragend');
            });
        });
    };
    LeafletPolygons.prototype.addPolygonEventInsertAt = function (polygon, eventFunction) {
        polygon.on('editable:vertex:new', function (eventNew) {
            var latlngs = eventNew.vertex.latlngs;
            var previous = latlngs[latlngs.findIndex(function (x) { return x === eventNew.vertex.latlng; }) - 1];
            if (previous) {
                var previousPoint_1 = new EventReturn([previous.lat, previous.lng]);
                polygon.on('editable:vertex:dragend', function (event) {
                    var newPoint = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                    var path = polygon.getLatLngs().map(function (x) {
                        if (Array.isArray(x[0])) {
                            return x.map(function (y) { return y.map(function (z) { return new EventReturn([z.lat, z.lng]); }); });
                        }
                        else {
                            return [x.map(function (y) { return new EventReturn([y.lat, y.lng]); })];
                        }
                    });
                    eventFunction(newPoint, previousPoint_1, event.target.object, event.vertex.getIndex(), path[0]);
                    polygon.off('editable:vertex:dragend');
                });
            }
        });
    };
    LeafletPolygons.prototype.addPolygonEventRemoveAt = function (polygon, eventFunction) {
        polygon.on('editable:vertex:deleted', function (event) {
            var param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
            var path = polygon.getLatLngs().map(function (x) {
                if (Array.isArray(x[0])) {
                    return x.map(function (y) { return y.map(function (z) { return new EventReturn([z.lat, z.lng]); }); });
                }
                else {
                    return [x.map(function (y) { return new EventReturn([y.lat, y.lng]); })];
                }
            });
            eventFunction(param, path[0], event.target.object);
        });
    };
    LeafletPolygons.prototype.addPolygonEventDragPolygon = function (polygon, eventFunction) {
        polygon.on('dragend', function (event) {
            var path = polygon.getLatLngs().map(function (x) {
                if (Array.isArray(x[0])) {
                    return x.map(function (y) { return y.map(function (z) { return new EventReturn([z.lat, z.lng]); }); });
                }
                else {
                    return [x.map(function (y) { return new EventReturn([y.lat, y.lng]); })];
                }
            });
            eventFunction(path[0], event.target.object);
        });
    };
    LeafletPolygons.prototype.addPolygonEventClick = function (polygon, eventFunction, self) {
        polygon.on('click', function (event) {
            self.leaflet.DomEvent.stopPropagation(event);
            var param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            eventFunction(param, event.target.object);
        });
    };
    return LeafletPolygons;
}());
export default LeafletPolygons;
//# sourceMappingURL=leaflet-polygons.js.map
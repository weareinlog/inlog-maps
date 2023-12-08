import { CircleEventType } from "../../dto/event-type";
import EventReturn from "../../features/events/event-return";
var LeafletCircles = /** @class */ (function () {
    function LeafletCircles(map, leaflet) {
        this.map = {};
        this.leaflet = {};
        this.map = map;
        this.leaflet = leaflet;
    }
    LeafletCircles.prototype.drawCircle = function (options, eventClick) {
        var self = this;
        var newOptions = {
            color: options.color,
            draggable: options.draggable,
            editable: options.editable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            opacity: options.opacity,
            radius: options.radius,
            weight: options.weight,
        };
        var circle = new this.leaflet.Circle(options.center, newOptions);
        if (eventClick) {
            circle.on("click", function (event) {
                self.leaflet.DomEvent.stopPropagation(event);
                var param = new EventReturn([
                    event.latlng.lat,
                    event.latlng.lng,
                ]);
                eventClick(param, event.target.object);
            });
        }
        if (options.addToMap) {
            circle.addTo(self.map);
            if (options.editable) {
                circle.enableEdit();
            }
        }
        if (options.object) {
            circle.object = options.object;
        }
        if (options.fitBounds) {
            self.map.fitBounds(circle.getBounds());
        }
        return circle;
    };
    LeafletCircles.prototype.toggleCircles = function (circles, show) {
        var self = this;
        circles.forEach(function (circle) {
            return show ? self.map.addLayer(circle) : self.map.removeLayer(circle);
        });
    };
    LeafletCircles.prototype.alterCircleOptions = function (circles, options) {
        circles.forEach(function (circle) {
            var style = {
                color: options.color ? options.color : circle.options.color,
                draggable: options.draggable
                    ? options.draggable
                    : circle.options.draggable,
                editable: options.editable
                    ? options.editable
                    : circle.options.editable,
                fillColor: options.fillColor
                    ? options.fillColor
                    : circle.options.fillColor,
                fillOpacity: options.fillOpacity
                    ? options.fillOpacity
                    : circle.options.fillOpacity,
                opacity: options.opacity
                    ? options.opacity
                    : circle.options.opacity,
                weight: options.weight ? options.weight : circle.options.weight,
            };
            circle.setStyle(style);
            if (options.radius) {
                circle.setRadius(options.radius);
            }
            if (options.center) {
                circle.setLatLng(options.center);
            }
            if (options.editable !== null && options.editable !== undefined) {
                if (options.editable) {
                    circle.enableEdit();
                }
                else {
                    circle.disableEdit();
                }
            }
        });
    };
    LeafletCircles.prototype.fitBoundsCircles = function (circles) {
        this.map.fitBounds(this.getBoundsCircles(circles));
    };
    LeafletCircles.prototype.isCircleOnMap = function (circle) {
        return this.map.hasLayer(circle);
    };
    LeafletCircles.prototype.getCircleCenter = function (circle) {
        var center = circle.getLatLng();
        return [center.lat, center.lng];
    };
    LeafletCircles.prototype.getCircleRadius = function (circle) {
        return circle.getRadius();
    };
    LeafletCircles.prototype.addCircleEvent = function (circles, eventType, eventFunction) {
        circles.forEach(function (circle) {
            switch (eventType) {
                case CircleEventType.Click:
                    circle.on("click", function (event) {
                        var param = new EventReturn([
                            event.latlng.lat,
                            event.latlng.lng,
                        ]);
                        eventFunction(param, circle.object);
                    });
                    break;
                case CircleEventType.CenterChanged:
                    circle.on("dragend", function (event) {
                        var param = new EventReturn([
                            event.target.getLatLng().lat,
                            event.target.getLatLng().lng,
                        ]);
                        eventFunction(param, circle.object);
                    });
                    break;
                case CircleEventType.RadiusChanged:
                    circle.on("editable:vertex:dragend", function (event) {
                        var param = new EventReturn([
                            event.vertex.latlng.lat,
                            event.vertex.latlng.lng,
                        ]);
                        eventFunction(param, circle.object, circle.getRadius());
                    });
                    break;
                default:
                    break;
            }
        });
    };
    LeafletCircles.prototype.removeCircleEvent = function (circles, event) {
        circles.forEach(function (circle) {
            switch (event) {
                case CircleEventType.Click:
                    circle.off("click");
                    break;
                case CircleEventType.CenterChanged:
                    circle.off("dragend");
                    break;
                case CircleEventType.RadiusChanged:
                    circle.off("editable:vertex:dragend");
                    break;
                default:
                    break;
            }
        });
    };
    LeafletCircles.prototype.getBoundsCircles = function (circles) {
        var group = new this.leaflet.FeatureGroup(circles);
        return group.getBounds();
    };
    return LeafletCircles;
}());
export default LeafletCircles;
//# sourceMappingURL=leaflet-circle.js.map
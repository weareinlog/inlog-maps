import { CircleEventType } from '../../dto/event-type';
import EventReturn from '../../features/events/event-return';
var GoogleCircles = /** @class */ (function () {
    function GoogleCircles(map, google) {
        this.map = {};
        this.google = {};
        this.map = map;
        this.google = google;
    }
    GoogleCircles.prototype.drawCircle = function (options, eventClick) {
        var self = this;
        var latlng = {
            lat: options.center[0],
            lng: options.center[1]
        };
        var newOptions = {
            center: latlng,
            draggable: options.draggable,
            editable: options.editable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            object: options.object,
            radius: options.radius,
            strokeColor: options.color,
            strokeOpacity: options.opacity,
            strokeWeight: options.weight,
            suppressUndo: true
        };
        var circle = new this.google.maps.Circle(newOptions);
        if (eventClick) {
            this.google.maps.event.addListener(circle, 'click', function (event) {
                var param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                eventClick(param, options.object);
            });
        }
        if (options.addToMap) {
            circle.setMap(self.map);
        }
        if (options.fitBounds) {
            self.map.fitBounds(circle.getBounds());
        }
        return circle;
    };
    GoogleCircles.prototype.toggleCircles = function (circles, show) {
        var self = this;
        circles.forEach(function (circle) { return circle.setMap(show ? self.map : null); });
    };
    GoogleCircles.prototype.alterCircleOptions = function (circles, options) {
        circles.forEach(function (circle) {
            var latlng = options.center && options.center.length > 0 ?
                { lat: options.center[0], lng: options.center[1] } : circle.getCenter();
            var newOptions = {
                center: latlng,
                fillColor: options.fillColor ? options.fillColor : circle.fillColor,
                fillOpacity: options.fillOpacity ? options.fillOpacity : circle.fillOpacity,
                radius: options.radius ? options.radius : circle.radius,
                strokeColor: options.color ? options.color : circle.strokeColor,
                strokeOpacity: options.opacity ? options.opacity : circle.strokeOpacity,
                strokeWeight: options.weight ? options.weight : circle.strokeWeight,
                editable: options.editable !== null && options.editable !== undefined ?
                    options.editable : circle.editable,
                draggable: options.draggable !== null && options.draggable !== undefined ?
                    options.draggable : circle.draggable
            };
            circle.setOptions(newOptions);
        });
    };
    GoogleCircles.prototype.fitBoundsCircles = function (circles) {
        this.map.fitBounds(this.getCirclesBounds(circles));
    };
    GoogleCircles.prototype.isCircleOnMap = function (circle) {
        return !!circle.map;
    };
    GoogleCircles.prototype.getCircleCenter = function (circle) {
        var center = circle.getCenter();
        return [center.lat(), center.lng()];
    };
    GoogleCircles.prototype.getCircleRadius = function (circle) {
        return circle.getRadius();
    };
    GoogleCircles.prototype.addCircleEvent = function (circles, eventType, eventFunction) {
        var _this = this;
        circles.forEach(function (circle) {
            switch (eventType) {
                case CircleEventType.Click:
                    _this.google.maps.event.addListener(circle, 'click', function (event) {
                        var param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                        eventFunction(param, circle.object);
                    });
                    break;
                case CircleEventType.CenterChanged:
                    _this.google.maps.event.addListener(circle, 'center_changed', function () {
                        var param = new EventReturn([circle.getCenter().lat(), circle.getCenter().lng()]);
                        eventFunction(param, circle.object);
                    });
                    break;
                case CircleEventType.RadiusChanged:
                    _this.google.maps.event.addListener(circle, 'radius_changed', function (event) {
                        var param = new EventReturn([circle.getCenter().lat(), circle.getCenter().lng()]);
                        eventFunction(param, circle.object, circle.getRadius());
                    });
                    break;
                default:
                    break;
            }
        });
    };
    GoogleCircles.prototype.removeCircleEvent = function (circles, event) {
        var _this = this;
        circles.forEach(function (circle) {
            switch (event) {
                case CircleEventType.Click:
                    _this.google.maps.event.clearListeners(circle, 'click');
                    break;
                case CircleEventType.CenterChanged:
                    _this.google.maps.event.clearListeners(circle, 'center_changed');
                    break;
                case CircleEventType.RadiusChanged:
                    _this.google.maps.event.clearListeners(circle, 'radius_changed');
                    break;
                default:
                    break;
            }
        });
    };
    GoogleCircles.prototype.getCirclesBounds = function (circles) {
        var bounds = new this.google.maps.LatLngBounds();
        circles.forEach(function (circulo) { return bounds.union(circulo.getBounds()); });
        return bounds;
    };
    return GoogleCircles;
}());
export default GoogleCircles;
//# sourceMappingURL=google-circles.js.map
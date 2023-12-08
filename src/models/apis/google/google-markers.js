import { MarkerEventType } from "../../dto/event-type";
import EventReturn from "../../features/events/event-return";
var MarkerClusterer = require("@google/markerclustererplus");
var GoogleMarkers = /** @class */ (function () {
    function GoogleMarkers(map, google) {
        this.map = null;
        this.google = null;
        this.map = map;
        this.google = google;
    }
    GoogleMarkers.prototype.drawMarker = function (options, eventClick) {
        var newOptions = {
            draggable: options.draggable,
            icon: null,
            object: options.object,
            position: {
                lat: options.latlng[0],
                lng: options.latlng[1],
            },
        };
        if (options.icon) {
            newOptions.icon = {
                url: options.icon.url,
            };
            if (options.icon.size) {
                newOptions.icon.size = new this.google.maps.Size(options.icon.size[0], options.icon.size[1]);
            }
        }
        var marker = new this.google.maps.Marker(newOptions);
        if (eventClick) {
            this.google.maps.event.addListener(marker, "click", function (event) {
                var param = new EventReturn([
                    event.latLng.lat(),
                    event.latLng.lng(),
                ]);
                eventClick(param, options.object);
            });
        }
        if (options.addToMap) {
            marker.setMap(this.map);
        }
        if (options.fitBounds) {
            var bounds = new this.google.maps.LatLngBounds();
            bounds.extend(marker.getPosition());
            this.map.fitBounds(bounds);
        }
        return marker;
    };
    GoogleMarkers.prototype.drawCircleMarker = function (options, eventClick) {
        var self = this;
        var newOptions = {
            icon: {
                fillColor: options.style.fillColor,
                fillOpacity: options.style.fillOpacity,
                path: this.google.maps.SymbolPath.CIRCLE,
                scale: options.style.radius,
                strokeColor: options.style.color,
                strokeWeight: options.style.weight,
            },
            object: options.object,
            position: {
                lat: options.latlng[0],
                lng: options.latlng[1],
            },
        };
        var marker = new this.google.maps.Marker(newOptions);
        if (eventClick) {
            this.google.maps.event.addListener(marker, "click", function (event) {
                var param = new EventReturn([
                    event.latLng.lat(),
                    event.latLng.lng(),
                ]);
                eventClick(param, options.object);
            });
        }
        if (options.addToMap) {
            marker.setMap(self.map);
        }
        if (options.fitBounds) {
            var bounds = new this.google.maps.LatLngBounds();
            bounds.extend(marker.getPosition());
            self.map.fitBounds(bounds);
        }
        return marker;
    };
    GoogleMarkers.prototype.toggleMarkers = function (markers, show, markerClusterer) {
        var self = this;
        markers.forEach(function (marker) {
            marker.setMap(show ? self.map : null);
            if (markerClusterer) {
                if (show) {
                    self.addMarkerOnClusterer(marker, markerClusterer);
                }
                else {
                    self.removeMarkerFromClusterer(marker, markerClusterer);
                }
            }
        });
    };
    GoogleMarkers.prototype.alterMarkerOptions = function (markers, options) {
        var _this = this;
        var icon = null;
        var position = null;
        if (options.latlng) {
            position = {
                lat: options.latlng[0],
                lng: options.latlng[1],
            };
        }
        if (options.icon) {
            icon = options.icon;
            if (options.icon.size) {
                icon.size = new this.google.maps.Size(options.icon.size[0], options.icon.size[1]);
            }
        }
        markers.forEach(function (marker) {
            if (options.style) {
                icon = {
                    fillColor: options.style.fillColor
                        ? options.style.fillColor
                        : marker.icon.fillColor,
                    fillOpacity: options.style.fillOpacity
                        ? options.style.fillOpacity
                        : marker.icon.fillOpacity,
                    path: _this.google.maps.SymbolPath.CIRCLE,
                    scale: options.style.radius
                        ? options.style.radius
                        : marker.icon.scale,
                    strokeColor: options.style.color
                        ? options.style.color
                        : marker.icon.strokeColor,
                    strokeWeight: options.style.weight
                        ? options.style.weight
                        : marker.icon.strokeWeight,
                };
            }
            var newOptions = null;
            if (position && icon) {
                newOptions = { icon: icon, position: position };
            }
            else if (position) {
                newOptions = { position: position };
            }
            else {
                newOptions = { icon: icon };
            }
            marker.setOptions(newOptions);
        });
    };
    GoogleMarkers.prototype.alterMarkerPosition = function (markers, position, addTransition) {
        var _this = this;
        var newPosition = {
            lat: position[0],
            lng: position[1],
        };
        markers.forEach(function (marker) {
            if (addTransition) {
                _this.moveTransitionMarker(newPosition, marker);
            }
            else {
                marker.setPosition(newPosition);
            }
        });
    };
    GoogleMarkers.prototype.fitBoundsPositions = function (markers) {
        var bounds = new this.google.maps.LatLngBounds();
        markers
            .map(function (marker) { return marker.position; })
            .forEach(function (position) { return bounds.extend(position); });
        this.map.fitBounds(bounds);
    };
    GoogleMarkers.prototype.isMarkerOnMap = function (marker) {
        return !!marker.map;
    };
    GoogleMarkers.prototype.setCenterMarker = function (marker) {
        this.map.setCenter(marker.getPosition());
    };
    GoogleMarkers.prototype.addMarkerEvent = function (markers, eventType, eventFunction) {
        var _this = this;
        markers.forEach(function (marker) {
            switch (eventType) {
                case MarkerEventType.Click:
                    _this.google.maps.event.addListener(marker, "click", function (event) {
                        var param = new EventReturn([
                            event.latLng.lat(),
                            event.latLng.lng(),
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.RightClick:
                    _this.google.maps.event.addListener(marker, "rightclick", function (event) {
                        var param = new EventReturn([
                            event.latLng.lat(),
                            event.latLng.lng(),
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.AfterDrag:
                    _this.google.maps.event.addListener(marker, "dragend", function (event) {
                        var param = new EventReturn([
                            event.latLng.lat(),
                            event.latLng.lng(),
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.MouseOver:
                    _this.google.maps.event.addListener(marker, "mouseover", function (event) {
                        var param = new EventReturn([
                            event.latLng.lat(),
                            event.latLng.lng(),
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.MouseOut:
                    _this.google.maps.event.addListener(marker, "mouseout", function (event) {
                        var param = new EventReturn([
                            event.latLng.lat(),
                            event.latLng.lng(),
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.BeforeDrag:
                    _this.google.maps.event.addListener(marker, "dragstart", function (event) {
                        var param = new EventReturn([
                            event.latLng.lat(),
                            event.latLng.lng(),
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                default:
                    break;
            }
        });
    };
    GoogleMarkers.prototype.removeMarkerEvent = function (markers, event) {
        var _this = this;
        markers.forEach(function (marker) {
            switch (event) {
                case MarkerEventType.Click:
                    _this.google.maps.event.clearListeners(marker, "click");
                    break;
                case MarkerEventType.RightClick:
                    _this.google.maps.event.clearListeners(marker, "rightclick");
                    break;
                case MarkerEventType.AfterDrag:
                    _this.google.maps.event.clearListeners(marker, "dragend");
                    break;
                case MarkerEventType.MouseOver:
                    _this.google.maps.event.clearListeners(marker, "mouseover");
                    break;
                case MarkerEventType.MouseOut:
                    _this.google.maps.event.clearListeners(marker, "mouseout");
                    break;
                case MarkerEventType.BeforeDrag:
                    _this.google.maps.event.clearListeners(marker, "dragstart");
                    break;
                default:
                    break;
            }
        });
    };
    /* Marker Clusterer */
    GoogleMarkers.prototype.addMarkerClusterer = function (config) {
        return new MarkerClusterer(this.map, [], {
            maxZoom: config.clusterMaxZoom,
            minimumClusterSize: config.clusterMinSize,
            zoomOnClick: config.clusterZoomOnClick,
        });
    };
    GoogleMarkers.prototype.alterMarkerClustererConfig = function (markerClusterer, config) {
        markerClusterer.setZoomOnClick(config.clusterZoomOnClick);
        markerClusterer.setMinimumClusterSize(config.clusterMinSize);
        markerClusterer.setMaxZoom(config.clusterMaxZoom);
    };
    GoogleMarkers.prototype.refreshClusterer = function (markerClusterer) {
        markerClusterer.repaint();
    };
    GoogleMarkers.prototype.addMarkerOnClusterer = function (marker, markerClusterer) {
        if (markerClusterer.getMarkers().indexOf(marker) === -1) {
            markerClusterer.addMarker(marker, true);
        }
    };
    GoogleMarkers.prototype.removeMarkerFromClusterer = function (marker, markerClusterer) {
        markerClusterer.removeMarker(marker);
    };
    GoogleMarkers.prototype.clearMarkersClusterer = function (markerClusterer) {
        markerClusterer.clearMarkers();
    };
    GoogleMarkers.prototype.countMarkersOnCluster = function (markerClusterer) {
        return markerClusterer.getMarkers().length;
    };
    GoogleMarkers.prototype.moveTransitionMarker = function (position, marker) {
        var numDeltas = 5;
        var reference = {
            deltaLat: (position.lat - marker.getPosition().lat()) / numDeltas,
            deltaLng: (position.lng - marker.getPosition().lng()) / numDeltas,
            i: 0,
            position: [marker.getPosition().lat(), marker.getPosition().lng()],
            lastPosition: position,
        };
        this.moveMarker(marker, reference, numDeltas);
    };
    GoogleMarkers.prototype.moveMarker = function (marker, reference, numDeltas) {
        var _this = this;
        reference.position[0] += reference.deltaLat;
        reference.position[1] += reference.deltaLng;
        marker.setPosition(new google.maps.LatLng(reference.position[0], reference.position[1]));
        if (reference.i < numDeltas) {
            reference.i++;
            setTimeout(function () { return _this.moveMarker(marker, reference, numDeltas); }, 20);
        }
        else if (reference.i === numDeltas) {
            setTimeout(function () { return marker.setPosition(reference.lastPosition); }, 20);
        }
    };
    return GoogleMarkers;
}());
export default GoogleMarkers;
//# sourceMappingURL=google-markers.js.map
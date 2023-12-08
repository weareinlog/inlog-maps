import { MarkerEventType } from "../../dto/event-type";
import EventReturn from "../../features/events/event-return";
var LeafletMarkers = /** @class */ (function () {
    function LeafletMarkers(map, leaflet) {
        this.map = {};
        this.leaflet = {};
        this.map = map;
        this.leaflet = leaflet;
    }
    /* Markers */
    LeafletMarkers.prototype.drawMarker = function (options, eventClick) {
        var newOptions = {
            draggable: options.draggable,
        };
        if (options.icon) {
            newOptions.icon = new this.leaflet.Icon({
                iconUrl: options.icon.url,
            });
            var size = options.icon.size;
            if (size) {
                newOptions.icon.options.iconSize = size;
                newOptions.icon.options.iconAnchor = [size[0] / 2, size[1]];
                newOptions.icon.options.popupAnchor = [0, -size[1]];
            }
        }
        var marker = new this.leaflet.Marker(options.latlng, newOptions);
        if (options.object) {
            marker.object = options.object;
        }
        if (eventClick) {
            marker.on("click", function (event) {
                var param = new EventReturn([
                    event.latlng.lat,
                    event.latlng.lng,
                ]);
                eventClick(param, event.target.object);
            });
        }
        if (options.addToMap && !options.addClusterer) {
            marker.addTo(this.map);
        }
        if (options.fitBounds) {
            var group = new this.leaflet.FeatureGroup([marker]);
            this.map.fitBounds(group.getBounds());
        }
        return marker;
    };
    LeafletMarkers.prototype.drawCircleMarker = function (options, eventClick) {
        var self = this;
        var marker = new this.leaflet.circleMarker(options.latlng, options.style);
        if (eventClick) {
            marker.on("click", function (event) {
                var param = new EventReturn([
                    event.latlng.lat,
                    event.latlng.lng,
                ]);
                eventClick(param, event.target.object);
            });
        }
        if (options.addToMap) {
            marker.addTo(self.map);
        }
        if (options.fitBounds) {
            var group = new this.leaflet.FeatureGroup([marker]);
            self.map.fitBounds(group.getBounds());
        }
        marker.object = options.object;
        return marker;
    };
    LeafletMarkers.prototype.toggleMarkers = function (markers, show, markerClusterer) {
        var self = this;
        markers.forEach(function (marker) {
            if (markerClusterer) {
                if (show) {
                    self.addMarkerOnClusterer(marker, markerClusterer);
                }
                else {
                    self.removeMarkerFromClusterer(marker, markerClusterer);
                }
            }
            else {
                if (show) {
                    self.map.addLayer(marker);
                }
                else {
                    self.map.removeLayer(marker);
                }
            }
        });
    };
    LeafletMarkers.prototype.alterMarkerOptions = function (markers, options) {
        var _this = this;
        markers.forEach(function (marker) {
            if (marker.type === "circle" && options.style) {
                var style = {
                    fillColor: options.style.fillColor
                        ? options.style.fillColor
                        : marker.options.fillColor,
                    fillOpacity: options.style.fillOpacity
                        ? options.style.fillOpacity
                        : marker.options.fillOpacity,
                    radius: options.style.radius
                        ? options.style.radius
                        : marker.options.radius,
                    strokeColor: options.style.color
                        ? options.style.color
                        : marker.options.strokeColor,
                    strokeWeight: options.style.weight
                        ? options.style.weight
                        : marker.options.strokeWeight,
                };
                marker.setStyle(style);
            }
            if (options.icon) {
                var icon = new _this.leaflet.icon({
                    iconUrl: options.icon.url,
                });
                var size = options.icon.size;
                if (size) {
                    icon.options.iconSize = size;
                    icon.options.iconAnchor = [size[0] / 2, size[1]];
                }
                marker.setIcon(icon);
            }
            if (options.latlng) {
                marker.setLatLng(options.latlng);
            }
        });
    };
    LeafletMarkers.prototype.alterMarkerPosition = function (markers, position, addTransition) {
        var _this = this;
        markers.forEach(function (marker) {
            if (addTransition) {
                _this.moveTransitionMarker(position, marker);
            }
            else {
                marker.setLatLng(position);
            }
        });
    };
    LeafletMarkers.prototype.fitBoundsPositions = function (markers) {
        var group = new this.leaflet.featureGroup(markers);
        this.map.fitBounds(group.getBounds());
    };
    LeafletMarkers.prototype.isMarkerOnMap = function (marker) {
        return this.map.hasLayer(marker);
    };
    LeafletMarkers.prototype.setCenterMarker = function (marker) {
        this.map.panTo(marker.getLatLng());
    };
    LeafletMarkers.prototype.addMarkerEvent = function (markers, eventType, eventFunction) {
        markers.forEach(function (marker) {
            switch (eventType) {
                case MarkerEventType.Click:
                    marker.on("click", function (event) {
                        var param = new EventReturn([
                            event.latlng.lat,
                            event.latlng.lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.RightClick:
                    marker.on("contextmenu", function (event) {
                        var param = new EventReturn([
                            event.latlng.lat,
                            event.latlng.lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.AfterDrag:
                    marker.on("dragend", function (event) {
                        var param = new EventReturn([
                            event.target.getLatLng().lat,
                            event.target.getLatLng().lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.MouseOver:
                    marker.on("mouseover", function (event) {
                        var param = new EventReturn([
                            event.latlng.lat,
                            event.latlng.lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.MouseOut:
                    marker.on("mouseout", function (event) {
                        var param = new EventReturn([
                            event.latlng.lat,
                            event.latlng.lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.BeforeDrag:
                    marker.on("dragstart", function (event) {
                        var param = new EventReturn([
                            event.target.getLatLng().lat,
                            event.target.getLatLng().lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                default:
                    break;
            }
        });
    };
    LeafletMarkers.prototype.removeMarkerEvent = function (markers, event) {
        markers.forEach(function (marker) {
            switch (event) {
                case MarkerEventType.Click:
                    marker.off("click");
                    break;
                case MarkerEventType.RightClick:
                    marker.off("contextmenu");
                    break;
                case MarkerEventType.AfterDrag:
                    marker.off("dragend");
                    break;
                case MarkerEventType.MouseOver:
                    marker.off("mouseover");
                    break;
                case MarkerEventType.MouseOut:
                    marker.off("mouseout");
                    break;
                case MarkerEventType.BeforeDrag:
                    marker.off("dragstart");
                    break;
                default:
                    break;
            }
        });
    };
    /* Marker Clusterer */
    LeafletMarkers.prototype.addMarkerClusterer = function (config) {
        var layer = this.leaflet.markerClusterGroup({
            maxClusterRadius: 50,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: config.clusterZoomOnClick,
        });
        this.map.addLayer(layer);
        return layer;
    };
    LeafletMarkers.prototype.alterMarkerClustererConfig = function (markerClusterer, config) {
        markerClusterer.options.zoomToBoundsOnClick = config.clusterZoomOnClick;
    };
    LeafletMarkers.prototype.refreshClusterer = function (markerClusterer) {
        markerClusterer.refreshClusters();
    };
    LeafletMarkers.prototype.addMarkerOnClusterer = function (marker, markerClusterer) {
        markerClusterer.addLayer(marker);
    };
    LeafletMarkers.prototype.removeMarkerFromClusterer = function (marker, markerClusterer) {
        markerClusterer.removeLayer(marker);
    };
    LeafletMarkers.prototype.clearMarkersClusterer = function (markerClusterer) {
        markerClusterer.clearLayers();
    };
    LeafletMarkers.prototype.countMarkersOnCluster = function (markerClusterer) {
        return markerClusterer.getLayers().length;
    };
    LeafletMarkers.prototype.moveTransitionMarker = function (position, marker) {
        var numDeltas = 5;
        var reference = {
            deltaLat: (position[0] - marker.getLatLng().lat) / numDeltas,
            deltaLng: (position[1] - marker.getLatLng().lng) / numDeltas,
            i: 0,
            position: [marker.getLatLng().lat, marker.getLatLng().lng],
            lastPosition: position,
        };
        this.moveMarker(marker, reference, numDeltas);
    };
    LeafletMarkers.prototype.moveMarker = function (marker, reference, numDeltas) {
        var _this = this;
        reference.position[0] += reference.deltaLat;
        reference.position[1] += reference.deltaLng;
        marker.setLatLng(reference.position);
        if (reference.i < numDeltas) {
            reference.i++;
            setTimeout(function () { return _this.moveMarker(marker, reference, numDeltas); }, 20);
        }
        else if (reference.i === numDeltas) {
            setTimeout(function () { return marker.setLatLng(reference.lastPosition); }, 20);
        }
    };
    return LeafletMarkers;
}());
export default LeafletMarkers;
//# sourceMappingURL=leaflet-markers.js.map
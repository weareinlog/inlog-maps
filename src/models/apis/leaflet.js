"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maps_api_loader_service_1 = require("../../utils/maps-api-loader.service");
var Leaflet = /** @class */ (function () {
    function Leaflet() {
        this.map = null;
        this.leaflet = null;
        this.position = null;
        this.mapsApiLoader = new maps_api_loader_service_1.MapsApiLoaderService();
        this.selectedPolyline = null;
        this.selectedPath = null;
        this.navigateInfoWindow = null;
        this.directionForward = false;
        this.multiSelectionForward = false;
        this.multiSelection = false;
    }
    Leaflet.prototype.initialize = function (mapType, params) {
        var _this = this;
        return this.mapsApiLoader.loadApi(mapType, params)
            .then(function (api) {
            _this.leaflet = api;
            var mapOptions = {
                center: new _this.leaflet.LatLng(-14, -54),
                editable: true,
                maxZoom: 20,
                minZoom: 4,
                zoom: 4
            };
            _this.map = new _this.leaflet.Map('inlog-map', mapOptions);
            new _this.leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', mapOptions)
                .addTo(_this.map);
            return _this;
        })
            .catch(function (err) { return err; });
    };
    /* GEOJson */
    Leaflet.prototype.loadGEOJson = function (data, options, eventClick) {
        var self = this;
        var objects = self.parseGeoJson(data, options);
        objects.forEach(function (elem) { return self.map.addLayer(elem); });
        if (self.map.options) {
            if (self.map.options.editable) {
                objects.forEach(function (obj) {
                    if (obj.enableEdit) {
                        obj.enableEdit();
                    }
                    if (eventClick) {
                        obj.on('click', function (event) {
                            var param = { latlng: [event.latlng.lat, event.latlng.lng] };
                            eventClick(param);
                        });
                    }
                });
            }
        }
    };
    /* Markers */
    Leaflet.prototype.drawMarker = function (options, eventClick) {
        var newOptions = null;
        if (options.icon) {
            newOptions = {
                draggable: options.draggable,
                icon: new this.leaflet.Icon({
                    iconSize: options.icon.size,
                    iconUrl: options.icon.url
                })
            };
        }
        else {
            newOptions = { draggable: options.draggable };
        }
        var marker = new this.leaflet.Marker(options.latlng, newOptions);
        if (eventClick) {
            marker.on('click', function (event) {
                var param = { latlng: [event.latlng.lat, event.latlng.lng] };
                eventClick(marker, param, options.object);
            });
        }
        if (options.addToMap) {
            marker.addTo(this.map);
        }
        if (options.fitBounds) {
            var group = new this.leaflet.FeatureGroup([marker]);
            this.map.fitBounds(group.getBounds());
        }
        return marker;
    };
    Leaflet.prototype.fitBoundsPositions = function (markers) {
        var group = new this.leaflet.featureGroup(markers);
        this.map.fitBounds(group.getBounds());
    };
    Leaflet.prototype.drawCircleMarker = function (options, eventClick) {
        var self = this;
        var marker = new this.leaflet.circleMarker(options.latlng, options.style);
        if (eventClick) {
            marker.on('click', function (event) {
                var param = { latlng: [event.latlng.lat, event.latlng.lng] };
                eventClick(marker, param);
            }, options.object);
        }
        if (options.addToMap) {
            marker.addTo(self.map);
        }
        if (options.fitBounds) {
            var group = new this.leaflet.FeatureGroup([marker]);
            self.map.fitBounds(group.getBounds());
        }
        return marker;
    };
    Leaflet.prototype.toggleMarkers = function (markers, show) {
        var self = this;
        markers.forEach(function (marker) { return show ? self.map.addLayer(marker) : self.map.removeLayer(marker); });
    };
    Leaflet.prototype.alterMarkerOptions = function (markers, options) {
        var _this = this;
        markers.forEach(function (marker) {
            if (marker.type === 'circle' && options.style) {
                var style = {
                    fillColor: options.style.fillColor !== null && options.style.fillColor !== undefined ?
                        options.style.fillColor : marker.options.fillColor,
                    fillOpacity: options.style.fillOpacity !== null && options.style.fillOpacity !== undefined ?
                        options.style.fillOpacity : marker.options.fillOpacity,
                    radius: options.style.radius !== null && options.style.radius !== undefined ?
                        options.style.radius : marker.options.radius,
                    strokeColor: options.style.color !== null && options.style.color !== undefined ?
                        options.style.color : marker.options.strokeColor,
                    strokeWeight: options.style.weight !== null && options.style.weight !== undefined ?
                        options.style.weight : marker.options.strokeWeight
                };
                marker.setStyle(style);
            }
            if (options.icon) {
                marker.setIcon(new _this.leaflet.icon({
                    iconSize: options.icon.size,
                    iconUrl: options.icon.url
                }));
            }
            if (options.latlng) {
                marker.setLatLng(options.latlng);
            }
        });
    };
    /* Polygons */
    Leaflet.prototype.drawPolygon = function (options, eventClick) {
        var self = this;
        var newOptions = {
            color: options.color,
            draggable: options.draggable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            opacity: options.opacity,
            weight: options.weight
        };
        var polygon = new this.leaflet.Polygon(options.path, newOptions);
        if (eventClick) {
            polygon.on('click', function (event) {
                var param = { latlng: [event.latlng.lat, event.latlng.lng] };
                eventClick(polygon, param, options.object);
            });
        }
        if (options.addToMap) {
            polygon.addTo(self.map);
            if (options.editable) {
                polygon.enableEdit();
            }
        }
        if (options.fitBounds) {
            self.map.fitBounds(polygon.getBounds());
        }
        return polygon;
    };
    Leaflet.prototype.fitBoundsPolygon = function (polygon) {
        var self = this;
        self.map.fitBounds(polygon.getBounds());
    };
    Leaflet.prototype.togglePolygons = function (polygons, show) {
        var self = this;
        polygons.forEach(function (polygon) { return show ? self.map.addLayer(polygon) : self.map.removeLayer(polygon); });
    };
    Leaflet.prototype.alterPolygonOptions = function (polygons, options) {
        polygons.forEach(function (polygon) {
            var style = {
                color: options.color !== null && options.color !== undefined ?
                    options.color : polygon.options.color,
                fillColor: options.fillColor !== null && options.fillColor !== undefined ?
                    options.fillColor : polygon.options.fillColor,
                fillOpacity: options.fillOpacity !== null && options.fillOpacity !== undefined ?
                    options.fillOpacity : polygon.options.fillOpacity,
                opacity: options.opacity !== null && options.opacity !== undefined ?
                    options.opacity : polygon.options.opacity,
                weight: options.weight !== null && options.weight !== undefined ?
                    options.weight : polygon.options.weight
            };
            polygon.setStyle(style);
        });
    };
    /* Circles */
    Leaflet.prototype.drawCircle = function (options, eventClick) {
        var self = this;
        var newOptions = {
            color: options.color,
            draggable: options.draggable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            opacity: options.opacity,
            radius: options.radius,
            weight: options.weight
        };
        var circle = new this.leaflet.Circle(options.center, newOptions);
        if (eventClick) {
            circle.on('click', function (event) {
                var param = { latlng: [event.latlng.lat, event.latlng.lng] };
                eventClick(circle, param, options.object);
            });
        }
        if (options.addToMap) {
            circle.addTo(self.map);
            if (options.editable) {
                circle.enableEdit();
            }
        }
        if (options.fitBounds) {
            self.map.fitBounds(circle.getBounds());
        }
        return circle;
    };
    Leaflet.prototype.toggleCircles = function (circles, show) {
        var self = this;
        circles.forEach(function (circle) { return show ? self.map.addLayer(circle) : self.map.removeLayer(circle); });
    };
    Leaflet.prototype.alterCircleOptions = function (circles, options) {
        circles.forEach(function (circle) {
            var style = {
                color: options.color !== null && options.color !== undefined ?
                    options.color : circle.options.color,
                fillColor: options.fillColor !== null && options.fillColor !== undefined ?
                    options.fillColor : circle.options.fillColor,
                fillOpacity: options.fillOpacity !== null && options.fillOpacity !== undefined ?
                    options.fillOpacity : circle.options.fillOpacity,
                opacity: options.opacity !== null && options.opacity !== undefined ?
                    options.opacity : circle.options.opacity,
                weight: options.weight !== null && options.weight !== undefined ?
                    options.weight : circle.options.weight
            };
            circle.setStyle(style);
        });
    };
    /* Polylines */
    Leaflet.prototype.drawPolyline = function (options, eventClick) {
        var self = this;
        var newOptions = {
            color: options.color || '#000000',
            draggable: options.draggable,
            editable: options.editable,
            infowindows: options.infowindows,
            object: options.object,
            weight: options.weight || 3
        };
        var polyline = new this.leaflet.Polyline(options.path || [], newOptions);
        if (eventClick) {
            polyline.on('click', function (event) {
                var param = { latlng: [event.latlng.lat, event.latlng.lng] };
                eventClick(polyline, param, polyline.options.object);
            });
        }
        if (options.addToMap) {
            polyline.addTo(self.map);
            if (options.editable) {
                polyline.enableEdit();
            }
        }
        if (options.fitBounds) {
            self.map.fitBounds(polyline.getBounds());
        }
        return polyline;
    };
    Leaflet.prototype.togglePolyline = function (polyline, show) {
        var self = this;
        if (show) {
            self.map.addLayer(polyline);
        }
        else {
            self.map.removeLayer(polyline);
        }
    };
    Leaflet.prototype.drawPolylineWithNavigation = function (options) {
        var polyline = this.drawPolyline(options, null);
        this.addNavigation(polyline, options.navigateOptions);
        return polyline;
    };
    Leaflet.prototype.clearListenersPolyline = function (polyline) {
        polyline.clearAllEventListeners();
    };
    Leaflet.prototype.addPolylinePath = function (polyline, position) {
        var path = polyline.getLatLngs();
        path.push(new this.leaflet.LatLng(position[0], position[1]));
        polyline.setLatLngs(path);
    };
    Leaflet.prototype.removePolylineHighlight = function () {
        var self = this;
        if (self.selectedPath) {
            self.clearPolylinePath(self.selectedPath);
        }
        if (self.navigateInfoWindow) {
            self.navigateInfoWindow.remove();
        }
        document.onkeyup = null;
    };
    Leaflet.prototype.alterPolylineOptions = function (polyline, options) {
        var style = {
            color: options.color !== null && options.color !== undefined ?
                options.color : polyline.options.color,
            draggable: options.draggable !== null && options.draggable !== undefined ?
                options.draggable : polyline.options.draggable,
            object: options.object !== null && options.object !== undefined ?
                options.object : polyline.options.object,
            weight: options.weight !== null && options.weight !== undefined ?
                options.weight : polyline.options.weight
        };
        polyline.setStyle(style);
        if (options.editable) {
            polyline.enableEdit();
        }
    };
    /* Popups */
    Leaflet.prototype.drawPopup = function (options) {
        var self = this;
        var popup = null;
        if (options.marker) {
            options.marker.bindPopup(options.content);
            popup = options.marker.getPopup();
            options.marker.openPopup();
            popup.marker = true;
        }
        else {
            popup = new this.leaflet.Popup();
            popup.setLatLng(options.latlng);
            popup.setContent(options.content);
            popup.openOn(self.map);
        }
        return popup;
    };
    Leaflet.prototype.alterPopup = function (popup, options) {
        var self = this;
        if (options.content) {
            popup.setContent(options.content);
        }
        if (options.latlng) {
            popup.setLatLng(options.latlng);
        }
        if (!popup.isOpen() && !popup.marker) {
            popup.openOn(self.map);
        }
    };
    /* Map */
    Leaflet.prototype.addClickMap = function (eventClick) {
        var self = this;
        self.map.on('click', function (event) {
            var param = { latlng: [event.latlng.lat, event.latlng.lng] };
            eventClick(param);
        });
    };
    Leaflet.prototype.removeClickMap = function () {
        var self = this;
        self.map.off('click');
    };
    /* Private Methods */
    Leaflet.prototype.addNavigation = function (polyline, options) {
        polyline.clearAllEventListeners();
        polyline.on('click', this.onClickPolyline.bind(this, polyline, options));
    };
    Leaflet.prototype.onClickPolyline = function (polyline, options, event) {
        var index = this.checkIdx(polyline, event.latlng);
        polyline.idxInicial = index;
        polyline.idxFinal = index + 1;
        this.moveSelectedPath(polyline, options);
        this.selectedPolyline = polyline;
        document.onkeyup = this.onKeyUp.bind(this);
    };
    Leaflet.prototype.onKeyUp = function (event) {
        var self = this;
        if (self.selectedPath && event.ctrlKey) {
            switch (event.which ? event.which : event.keyCode) {
                // seta para cima ou seta para direita ou W ou D
                case 38:
                case 39:
                    self.moveFowards(event.shiftKey);
                    break; // seta para esquerda ou seta para baixo ou S ou A
                case 37:
                case 40:
                    self.moveBackwards(event.shiftKey);
                    break;
            }
        }
    };
    Leaflet.prototype.moveFowards = function (multiselection) {
        var polyline = this.selectedPolyline;
        if (this.directionForward && polyline.idxFinal < polyline.getLatLngs().length - 1) {
            this.navigateFoward(multiselection, polyline);
        }
        this.directionForward = true;
        this.moveSelectedPath(polyline, null);
    };
    Leaflet.prototype.navigateFoward = function (multiSelection, polyline) {
        if (!multiSelection) {
            polyline.idxFinal++;
            polyline.idxInicial = this.multiSelection ? polyline.idxFinal - 1 : polyline.idxInicial + 1;
            this.multiSelection = false;
        }
        else {
            this.multiSelection = true;
            if (this.multiSelectionForward) {
                polyline.idxFinal++;
            }
            this.multiSelectionForward = true;
        }
    };
    Leaflet.prototype.moveBackwards = function (multiSelection) {
        var polyline = this.selectedPolyline;
        if (!this.directionForward && polyline.idxInicial > 0) {
            this.navigateBackward(multiSelection, polyline);
        }
        this.directionForward = false;
        this.moveSelectedPath(polyline, null);
    };
    Leaflet.prototype.navigateBackward = function (multiSelection, polyline) {
        var self = this;
        if (!multiSelection) {
            polyline.idxInicial--;
            polyline.idxFinal = !self.multiSelection ? polyline.idxFinal - 1 : polyline.idxInicial + 1;
            self.multiSelection = false;
        }
        else {
            self.multiSelection = true;
            if (!self.multiSelectionForward) {
                polyline.idxInicial--;
            }
            self.multiSelectionForward = false;
        }
    };
    Leaflet.prototype.moveSelectedPath = function (polyline, options) {
        var self = this;
        var pathSelected = polyline.getLatLngs().slice(polyline.idxInicial, polyline.idxFinal + 1);
        if (self.selectedPath) {
            self.selectedPath.setLatLngs(pathSelected);
        }
        else {
            var newOptions = {
                color: options && options.color || '#FF0000',
                weight: options && options.weight || 10,
                zIndex: 9999
            };
            self.selectedPath = new this.leaflet.Polyline(pathSelected, newOptions);
            self.selectedPath.addTo(self.map);
        }
        var idx = self.directionForward ? polyline.idxFinal : polyline.idxInicial;
        var infowindow = polyline.options.infowindows ? polyline.options.infowindows[idx] : null;
        if (infowindow) {
            var point = polyline.getLatLngs()[idx];
            if (self.navigateInfoWindow) {
                self.alterPopup(self.navigateInfoWindow, {
                    content: infowindow,
                    latlng: [point.lat, point.lng]
                });
            }
            else {
                self.navigateInfoWindow = self.drawPopup({
                    content: infowindow,
                    latlng: [point.lat, point.lng]
                });
            }
        }
    };
    Leaflet.prototype.checkIdx = function (polyline, point) {
        var self = this;
        var path = polyline.getLatLngs();
        var distance = 0;
        var minDistance = Number.MAX_VALUE;
        var returnValue = -1;
        for (var i = 0; i < path.length - 1; i++) {
            distance = self.distanceToLine(path[i], path[i + 1], point);
            if (distance < minDistance) {
                minDistance = distance;
                returnValue = i;
            }
        }
        return returnValue;
    };
    Leaflet.prototype.distanceToLine = function (pt1, pt2, pt) {
        var self = this;
        var deltaX = pt2.lng - pt1.lng;
        var deltaY = pt2.lat - pt1.lat;
        var incIntersect = (pt.lng - pt1.lng) * deltaX;
        var deltaSum = (deltaX * deltaX) + (deltaY * deltaY);
        incIntersect += (pt.lat - pt1.lat) * deltaY;
        if (deltaSum > 0) {
            incIntersect /= deltaSum;
        }
        else {
            incIntersect = -1;
        }
        // A interseção ocorre fora do segmento de reta, "antes" do pt1.
        if (incIntersect < 0) {
            return self.kmTo(pt, pt1);
        }
        else if (incIntersect > 1) {
            return self.kmTo(pt, pt2);
        }
        // Cálculo do ponto de interseção.
        var intersect = new this.leaflet.LatLng(pt1.lat + incIntersect * deltaY, pt1.lng + incIntersect * deltaX);
        return self.kmTo(pt, intersect);
    };
    Leaflet.prototype.kmTo = function (pt1, pt2) {
        var e = Math;
        var ra = e.PI / 180;
        var b = pt1.lat * ra;
        var c = pt2.lat * ra;
        var d = b - c;
        var g = pt1.lng * ra - pt2.lng * ra;
        var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));
        return f * 6378.137 * 1000;
    };
    Leaflet.prototype.parseGeoJson = function (data, options) {
        var self = this;
        var parsedFeatures = [];
        if (Array.isArray(data.features)) {
            for (var _i = 0, _a = data.features; _i < _a.length; _i++) {
                var feature = _a[_i];
                parsedFeatures.push(self.parseGeoJsonToObject(feature, options));
            }
        }
        else {
            parsedFeatures.push(self.parseGeoJsonToObject(data, options));
        }
        return parsedFeatures;
    };
    Leaflet.prototype.parseGeoJsonToObject = function (data, objectOptions) {
        var geometry = data.geometry;
        var parsedCoordinates = [];
        if (data.properties) {
            Object.assign(objectOptions, data.properties);
        }
        switch (geometry.type) {
            case 'Point':
                parsedCoordinates = geometry.coordinates.reverse();
                return new this.leaflet.Marker(parsedCoordinates, objectOptions);
            case 'Polygon':
                geometry.coordinates
                    .forEach(function (polygon) { return parsedCoordinates.push(polygon.map(function (elem) { return elem.reverse(); })); });
                return new this.leaflet.Polygon(parsedCoordinates, objectOptions);
            case 'LineString':
                parsedCoordinates = geometry.coordinates.map(function (elem) { return elem.reverse(); });
                return new this.leaflet.Polyline(parsedCoordinates, objectOptions);
            default:
                throw new Error('Forma de objeto desconhecida.');
        }
    };
    Leaflet.prototype.clearPolylinePath = function (polyline) {
        polyline.setLatLngs([]);
    };
    return Leaflet;
}());
exports.default = Leaflet;
//# sourceMappingURL=leaflet.js.map
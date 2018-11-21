"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maps_api_loader_service_1 = require("../../utils/maps-api-loader.service");
var GoogleMaps = /** @class */ (function () {
    function GoogleMaps() {
        this.map = null;
        this.google = null;
        this.mapsApiLoader = new maps_api_loader_service_1.MapsApiLoaderService();
        this.selectedPolyline = null;
        this.selectedPath = null;
        this.navigateInfoWindow = null;
        this.directionForward = false;
        this.multiSelectionForward = false;
        this.multiSelection = false;
    }
    GoogleMaps.prototype.initialize = function (mapType, params) {
        var _this = this;
        return this.mapsApiLoader.loadApi(mapType, params)
            .then(function (api) {
            _this.google = api;
            _this.map = new _this.google.maps.Map(document.getElementById('inlog-map'), {
                center: new _this.google.maps.LatLng(-14, -54),
                fullscreenControl: false,
                keyboardShortcuts: false,
                mapTypeControl: true,
                minZoom: 4,
                rotateControl: false,
                scaleControl: false,
                streetViewControl: false,
                zoom: 4,
                zoomControl: true
            });
            return _this;
        })
            .catch(function (err) { return err; });
    };
    /* GEOJson */
    GoogleMaps.prototype.loadGEOJson = function (data, options, eventClick) {
        var self = this;
        var objects = self.parseGeoJson(data, options);
        objects.forEach(function (elem) {
            if (eventClick) {
                elem.addListener('click', function (event) {
                    var param = { latlng: [event.latLng.lat(), event.latLng.lng()] };
                    eventClick(param);
                });
            }
            elem.setMap(self.map);
        });
    };
    /* Markers */
    GoogleMaps.prototype.drawMarker = function (options, eventClick) {
        var newOptions = {
            draggable: options.draggable,
            icon: null,
            object: options.object,
            position: {
                lat: options.latlng[0],
                lng: options.latlng[1]
            }
        };
        if (options.icon) {
            newOptions.icon = {
                url: options.icon.url
            };
            if (options.icon.size) {
                newOptions.icon.size = new this.google.maps.Size(options.icon.size[0], options.icon.size[1]);
            }
        }
        var marker = new this.google.maps.Marker(newOptions);
        if (eventClick) {
            this.google.maps.event.addListener(marker, 'click', function (event) {
                var param = { latlng: [event.latLng.lat(), event.latLng.lng()] };
                eventClick(marker, param, options.object);
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
    GoogleMaps.prototype.fitBoundsPositions = function (markers) {
        var bounds = new this.google.maps.LatLngBounds();
        markers.map(function (marker) { return marker.position; }).forEach(function (position) { return bounds.extend(position); });
        this.map.fitBounds(bounds);
    };
    GoogleMaps.prototype.drawCircleMarker = function (options, eventClick) {
        var self = this;
        var newOptions = {
            icon: {
                fillColor: options.style.fillColor,
                fillOpacity: options.style.fillOpacity,
                path: this.google.maps.SymbolPath.CIRCLE,
                scale: options.style.radius,
                strokeColor: options.style.color,
                strokeWeight: options.style.weight
            },
            position: {
                lat: options.latlng[0],
                lng: options.latlng[1]
            }
        };
        var marker = new this.google.maps.Marker(newOptions);
        if (eventClick) {
            this.google.maps.event.addListener(marker, 'click', function (event) {
                var param = { latlng: [event.latLng.lat(), event.latLng.lng()] };
                eventClick(marker, param, options.object);
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
    GoogleMaps.prototype.toggleMarkers = function (markers, show) {
        var self = this;
        markers.forEach(function (marker) { return marker.setMap(show ? self.map : null); });
    };
    GoogleMaps.prototype.alterMarkerOptions = function (markers, options) {
        var _this = this;
        var icon = null;
        var position = null;
        if (options.latlng) {
            position = {
                lat: options.latlng[0],
                lng: options.latlng[1]
            };
        }
        if (options.icon) {
            icon = options.icon;
        }
        markers.forEach(function (marker) {
            if (options.style) {
                icon = {
                    fillColor: options.style.fillColor !== null && options.style.fillColor !== undefined ?
                        options.style.fillColor : marker.icon.fillColor,
                    fillOpacity: options.style.fillOpacity !== null && options.style.fillOpacity !== undefined ?
                        options.style.fillOpacity : marker.icon.fillOpacity,
                    path: _this.google.maps.SymbolPath.CIRCLE,
                    scale: options.style.radius !== null && options.style.radius !== undefined ?
                        options.style.radius : marker.icon.scale,
                    strokeColor: options.style.color !== null && options.style.color !== undefined ?
                        options.style.color : marker.icon.strokeColor,
                    strokeWeight: options.style.weight !== null && options.style.weight !== undefined ?
                        options.style.weight : marker.icon.strokeWeight
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
    /* Polygons */
    GoogleMaps.prototype.drawPolygon = function (options, eventClick) {
        var self = this;
        var paths = [];
        options.path.forEach(function (path) {
            paths.push({
                lat: path[0],
                lng: path[1]
            });
        });
        var newOptions = {
            draggable: options.draggable,
            editable: options.editable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            paths: paths,
            strokeColor: options.color,
            strokeOpacity: options.opacity,
            strokeWeight: options.weight
        };
        var polygon = new this.google.maps.Polygon(newOptions);
        if (eventClick) {
            this.google.maps.event.addListener(polygon, 'click', function (event) {
                var param = { latlng: [event.latLng.lat(), event.latLng.lng()] };
                eventClick(polygon, param, options.object);
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
    GoogleMaps.prototype.fitBoundsPolygon = function (polygon) {
        var self = this;
        self.map.fitBounds(self.getPolygonBounds(polygon));
    };
    GoogleMaps.prototype.togglePolygons = function (polygons, show) {
        var self = this;
        polygons.forEach(function (polygon) { return polygon.setMap(show ? self.map : null); });
    };
    GoogleMaps.prototype.alterPolygonOptions = function (polygons, options) {
        var newOptions = {};
        polygons.forEach(function (polygon) {
            newOptions = {
                fillColor: options.fillColor !== null && options.fillColor !== undefined ?
                    options.fillColor : polygon.fillColor,
                fillOpacity: options.fillOpacity !== null && options.fillOpacity !== undefined ?
                    options.fillOpacity : polygon.fillOpacity,
                strokeColor: options.color !== null && options.color !== undefined ?
                    options.color : polygon.strokeColor,
                strokeOpacity: options.opacity !== null && options.opacity !== undefined ?
                    options.opacity : polygon.strokeOpacity,
                strokeWeight: options.weight !== null && options.weight !== undefined ?
                    options.weight : polygon.strokeWeight
            };
            polygon.setOptions(newOptions);
        });
    };
    /* Circles */
    GoogleMaps.prototype.drawCircle = function (options, eventClick) {
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
            radius: options.radius,
            strokeColor: options.color,
            strokeOpacity: options.opacity,
            strokeWeight: options.weight
        };
        var circle = new this.google.maps.Circle(newOptions);
        if (eventClick) {
            this.google.maps.event.addListener(circle, 'click', function (event) {
                var param = { latlng: [event.latLng.lat(), event.latLng.lng()] };
                eventClick(circle, param, options.object);
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
    GoogleMaps.prototype.toggleCircles = function (circles, show) {
        var self = this;
        circles.forEach(function (circle) { return circle.setMap(show ? self.map : null); });
    };
    GoogleMaps.prototype.alterCircleOptions = function (circles, options) {
        var newOptions = {};
        circles.forEach(function (circle) {
            newOptions = {
                fillColor: options.fillColor !== null && options.fillColor !== undefined ?
                    options.fillColor : circle.fillColor,
                fillOpacity: options.fillOpacity !== null && options.fillOpacity !== undefined ?
                    options.fillOpacity : circle.fillOpacity,
                strokeColor: options.color !== null && options.color !== undefined ? options.color : circle.strokeColor,
                strokeOpacity: options.opacity !== null && options.opacity !== undefined ?
                    options.opacity : circle.strokeOpacity,
                strokeWeight: options.weight !== null && options.weight !== undefined ?
                    options.weight : circle.strokeWeight
            };
            circle.setOptions(newOptions);
        });
    };
    /* Polylines */
    GoogleMaps.prototype.drawPolyline = function (options, eventClick) {
        var self = this;
        var newOptions = {
            draggable: options.draggable,
            editable: options.editable,
            infowindows: options.infowindows,
            object: options.object,
            path: null,
            strokeColor: options.color,
            strokeWeight: options.weight
        };
        newOptions.path = options.path ? options.path.map(function (x) {
            return {
                lat: x[0],
                lng: x[1]
            };
        }) : [];
        var polyline = new this.google.maps.Polyline(newOptions);
        if (eventClick) {
            this.google.maps.event.addListener(polyline, 'click', function (event) {
                var param = { latlng: [event.latLng.lat(), event.latLng.lng()] };
                eventClick(polyline, param, polyline.object);
            });
        }
        if (options.addToMap) {
            polyline.setMap(self.map);
        }
        if (options.fitBounds) {
            self.map.fitBounds(self.getPolylineBounds(polyline));
        }
        return polyline;
    };
    GoogleMaps.prototype.togglePolyline = function (polyline, show) {
        var self = this;
        polyline.setMap(show ? self.map : null);
    };
    GoogleMaps.prototype.drawPolylineWithNavigation = function (options) {
        var self = this;
        var polyline = self.drawPolyline(options, null);
        self.addNavigation(polyline, options.navigateOptions);
        return polyline;
    };
    GoogleMaps.prototype.clearListenersPolyline = function (polyline) {
        this.google.maps.event.clearListeners(polyline, 'click');
    };
    GoogleMaps.prototype.addPolylinePath = function (polyline, position) {
        var path = polyline.getPath();
        path.push(new this.google.maps.LatLng(position[0], position[1]));
        polyline.setPath(path);
    };
    GoogleMaps.prototype.removePolylineHighlight = function () {
        this.google.maps.event.clearListeners(document, 'keyup');
        if (this.selectedPath) {
            this.clearPolylinePath(this.selectedPath);
        }
        if (this.navigateInfoWindow) {
            this.navigateInfoWindow.close();
        }
    };
    GoogleMaps.prototype.alterPolylineOptions = function (polyline, options) {
        var newOptions = {
            draggable: options.draggable !== null && options.draggable !== undefined ?
                options.draggable : polyline.draggable,
            editable: options.editable !== null && options.editable !== undefined ?
                options.editable : polyline.editable,
            infowindows: options.infowindows !== null && options.infowindows !== undefined ?
                options.infowindows : polyline.infowindows,
            object: options.object !== null && options.object !== undefined ?
                options.object : polyline.object,
            strokeColor: options.color !== null && options.color !== undefined ?
                options.color : polyline.strokeColor,
            strokeWeight: options.weight !== null && options.weight !== undefined ?
                options.weight : polyline.strokeWeight
        };
        polyline.setOptions(newOptions);
    };
    /* Info Windows */
    GoogleMaps.prototype.drawPopup = function (options) {
        var self = this;
        var infowindow = new this.google.maps.InfoWindow({
            content: options.content
        });
        infowindow.setPosition({
            lat: options.latlng[0],
            lng: options.latlng[1]
        });
        infowindow.open(self.map, options.marker || null);
        return infowindow;
    };
    GoogleMaps.prototype.alterPopup = function (popup, options) {
        var self = this;
        if (options.content) {
            popup.setContent(options.content);
        }
        if (options.latlng) {
            popup.setPosition({
                lat: options.latlng[0],
                lng: options.latlng[1]
            });
        }
        if (!popup.getMap()) {
            popup.open(self.map, options.marker || null);
        }
    };
    /* Map */
    GoogleMaps.prototype.addClickMap = function (eventClick) {
        var self = this;
        this.google.maps.event.addListener(self.map, 'click', function (event) {
            var param = { latlng: [event.latLng.lat(), event.latLng.lng()] };
            eventClick(param);
        });
    };
    GoogleMaps.prototype.removeClickMap = function () {
        var self = this;
        this.google.maps.event.clearListeners(self.map, 'click');
    };
    /* Private Methods */
    GoogleMaps.prototype.addNavigation = function (polyline, options) {
        var self = this;
        this.google.maps.event.clearListeners(polyline, 'click');
        this.google.maps.event.addListener(polyline, 'click', self.onClickPolyline.bind(self, polyline, options));
    };
    GoogleMaps.prototype.onClickPolyline = function (polyline, options, event) {
        var self = this;
        var index = self.checkIdx(polyline, event.latLng);
        polyline.idxInicial = index;
        polyline.idxFinal = index + 1;
        self.moveSelectedPath(polyline, options);
        self.selectedPolyline = polyline;
        this.google.maps.event.clearListeners(document, 'keyup');
        this.google.maps.event.addDomListener(document, 'keyup', self.onKeyUp.bind(self));
    };
    GoogleMaps.prototype.onKeyUp = function (event) {
        var self = this;
        if (self.selectedPath) {
            switch (event.which ? event.which : event.keyCode) {
                // seta para cima ou seta para direita ou W ou D
                case 38:
                case 39:
                    self.moveForwards(event.shiftKey);
                    break; // seta para esquerda ou seta para baixo ou S ou A
                case 37:
                case 40:
                    self.moveBackwards(event.shiftKey);
                    break;
            }
        }
    };
    GoogleMaps.prototype.moveForwards = function (multiSelection) {
        var self = this;
        var polyline = self.selectedPolyline;
        if (self.directionForward && polyline.idxFinal < polyline.getPath().getArray().length - 1) {
            self.navigateForward(multiSelection, polyline);
        }
        self.directionForward = true;
        self.moveSelectedPath(polyline, null);
    };
    GoogleMaps.prototype.navigateForward = function (multiSelection, polyline) {
        var self = this;
        if (!multiSelection) {
            polyline.idxFinal++;
            polyline.idxInicial = self.multiSelection ? polyline.idxFinal - 1 : polyline.idxInicial + 1;
            self.multiSelection = false;
        }
        else {
            self.multiSelection = true;
            if (self.multiSelectionForward) {
                polyline.idxFinal++;
            }
            self.multiSelectionForward = true;
        }
    };
    GoogleMaps.prototype.moveBackwards = function (multiSelection) {
        var self = this;
        var polyline = self.selectedPolyline;
        if (!self.directionForward && polyline.idxInicial > 0) {
            self.navigateBackward(multiSelection, polyline);
        }
        self.directionForward = false;
        self.moveSelectedPath(polyline, null);
    };
    GoogleMaps.prototype.navigateBackward = function (multiSelection, polyline) {
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
    GoogleMaps.prototype.moveSelectedPath = function (polyline, options) {
        var pathSelected = polyline.getPath().getArray().slice(polyline.idxInicial, polyline.idxFinal + 1);
        if (this.selectedPath) {
            this.selectedPath.setPath(pathSelected);
        }
        else {
            var newOptions = {
                map: this.map,
                path: pathSelected,
                strokeColor: options && options.color || '#FF0000',
                strokeWeight: options && options.weight || 10,
                zIndex: 9999
            };
            this.selectedPath = new this.google.maps.Polyline(newOptions);
        }
        this.drawPopupNavigation(polyline);
    };
    GoogleMaps.prototype.drawPopupNavigation = function (polyline) {
        var self = this;
        var idx = self.directionForward ? polyline.idxFinal : polyline.idxInicial;
        var infowindow = polyline.infowindows ? polyline.infowindows[idx] : null;
        if (infowindow) {
            var point = polyline.getPath().getArray()[idx];
            if (self.navigateInfoWindow) {
                self.alterPopup(self.navigateInfoWindow, {
                    content: infowindow,
                    latlng: [point.lat(), point.lng()]
                });
            }
            else {
                self.navigateInfoWindow = self.drawPopup({
                    content: infowindow,
                    latlng: [point.lat(), point.lng()]
                });
            }
        }
    };
    GoogleMaps.prototype.checkIdx = function (polyline, point) {
        var self = this;
        var path = polyline.getPath();
        var distance = 0;
        var minDistance = Number.MAX_VALUE;
        var returnValue = -1;
        for (var i = 0; i < path.length - 1; i++) {
            distance = self.distanceToLine(path.getAt(i), path.getAt(i + 1), point);
            if (distance < minDistance) {
                minDistance = distance;
                returnValue = i;
            }
        }
        return returnValue;
    };
    GoogleMaps.prototype.distanceToLine = function (pt1, pt2, pt) {
        var self = this;
        var deltaX = pt2.lng() - pt1.lng();
        var deltaY = pt2.lat() - pt1.lat();
        var incIntersect = (pt.lng() - pt1.lng()) * deltaX;
        var deltaSum = (deltaX * deltaX) + (deltaY * deltaY);
        incIntersect += (pt.lat() - pt1.lat()) * deltaY;
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
        var intersect = new this.google.maps
            .LatLng(pt1.lat() + incIntersect * deltaY, pt1.lng() + incIntersect * deltaX);
        return self.kmTo(pt, intersect);
    };
    GoogleMaps.prototype.kmTo = function (pt1, pt2) {
        var e = Math;
        var ra = e.PI / 180;
        var b = pt1.lat() * ra;
        var c = pt2.lat() * ra;
        var d = b - c;
        var g = pt1.lng() * ra - pt2.lng() * ra;
        var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));
        return f * 6378.137 * 1000;
    };
    GoogleMaps.prototype.parseGeoJson = function (data, options) {
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
    GoogleMaps.prototype.parseGeoJsonToObject = function (data, objectOptions) {
        var geometry = data.geometry;
        if (data.properties) {
            Object.assign(objectOptions, data.properties);
        }
        switch (geometry.type) {
            case 'Point':
                objectOptions.position = {
                    lat: geometry.coordinates[1],
                    lng: geometry.coordinates[0]
                };
                return new this.google.maps.Marker(objectOptions);
            case 'Polygon':
                objectOptions.paths = [];
                geometry.coordinates.forEach(function (polygon) {
                    return objectOptions.paths.push(polygon.map(function (elem) { return ({
                        lat: elem[1],
                        lng: elem[0]
                    }); }));
                });
                return new this.google.maps.Polygon(objectOptions);
            case 'LineString':
                objectOptions.path = geometry.coordinates.map(function (elem) { return ({
                    lat: elem[1],
                    lng: elem[0]
                }); });
                return new this.google.maps.Polyline(objectOptions);
            default:
                throw new Error('Forma de objeto desconhecida.');
        }
    };
    // --------------- HELPER FUNCTIONS
    GoogleMaps.prototype.getPolygonBounds = function (polygon) {
        var bounds = new this.google.maps.LatLngBounds();
        var paths = polygon.getPaths().getArray();
        paths.forEach(function (path) {
            path.getArray().forEach(function (x) { return bounds.extend(x); });
        });
        return bounds;
    };
    GoogleMaps.prototype.getPolylineBounds = function (polyline) {
        var bounds = new this.google.maps.LatLngBounds();
        var paths = polyline.getPath().getArray();
        paths.forEach(function (path) { return bounds.extend(path); });
        return bounds;
    };
    GoogleMaps.prototype.getPolygonsBounds = function (polygons) {
        var bounds = new this.google.maps.LatLngBounds();
        polygons.forEach(function (polygon) {
            var paths = polygon.getPaths().getArray();
            paths.forEach(function (path) {
                path.getArray().forEach(function (x) { return bounds.extend(x); });
            });
        });
        return bounds;
    };
    GoogleMaps.prototype.clearPolylinePath = function (polyline) {
        polyline.setPath([]);
    };
    return GoogleMaps;
}());
exports.default = GoogleMaps;
//# sourceMappingURL=googleMaps.js.map
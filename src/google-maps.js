export default class GoogleMaps {
    constructor() {
        // Set map options
        let mapOptions = {
            zoom: 4,
            minZoom: 4,
            center: new google.maps.LatLng(-14, -54),
            keyboardShortcuts: false,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
        };

        // initialize the map
        let map = new google.maps.Map(document.getElementById('map'), mapOptions);

        this.map = map;
        this.selectedPolyline = null;
        this.selectedPath = null;
        this.navigateInfoWindow = null;
        this.directionForward = false;
        this.multiSelectionForward = false;
        this.multiSelection = false;
    }

    /* GEOJson */
    _loadGEOJson(data, options, eventClick) {
        let self = this;
        let objects = self._parseGeoJson(data, options);

        objects.forEach(elem => {
            if (eventClick) {
                elem.addListener('click', (event) => {
                    let param = new inlogMaps.EventReturn([event.latLng.lat(), event.latLng.lng()]);

                    eventClick(param);
                });
            }
            elem.setMap(self.map);
        });
    }

    _parseGeoJson(data, options) {
        let self = this;
        let parsedFeatures = [];

        if (Array.isArray(data.features)) {
            for (let feature of data.features) {
                parsedFeatures.push(self._parseGeoJsonToObject(feature, options));
            }
        } else {
            parsedFeatures.push(self._parseGeoJsonToObject(data, options));
        }

        return parsedFeatures;
    }

    _parseGeoJsonToObject(data, objectOptions) {
        let geometry = data.geometry;

        if (data.properties) {
            Object.assign(objectOptions, data.properties);
        }

        switch (geometry.type) {
            case 'Point':
                objectOptions.position = {
                    lat: geometry.coordinates[1],
                    lng: geometry.coordinates[0]
                };
                return new google.maps.Marker(objectOptions);
            case 'Polygon':
                objectOptions.paths = [];
                geometry.coordinates.forEach(polygon =>
                    objectOptions.paths.push(polygon.map((elem) => ({
                        lat: elem[1],
                        lng: elem[0]
                    })))
                );
                return new google.maps.Polygon(objectOptions);
            case 'LineString':
                objectOptions.path = geometry.coordinates.map((elem) => ({
                    lat: elem[1],
                    lng: elem[0]
                }));
                return new google.maps.Polyline(objectOptions);
            default:
                throw new Error('Forma de objeto desconhecida.');
        }
    }

    /* Markers */
    _drawMarker(options, eventClick) {
        let self = this;
        let newOptions = {
            position: {
                lat: options.latlng[0],
                lng: options.latlng[1]
            },
            draggable: options.draggable,
            object: options.object
        };

        if (options.icon) {
            newOptions.icon = {
                url: options.icon.url
            };

            if (options.icon.size) {
                newOptions.icon.size = new google.maps.Size(options.icon.size[0], options.icon.size[1]);
            }
        }

        let marker = new google.maps.Marker(newOptions);

        if (eventClick) {
            google.maps.event.addListener(marker, 'click', (event) => {
                let param = new inlogMaps.EventReturn([event.latLng.lat(), event.latLng.lng()]);

                eventClick(marker, param, options.object);
            });
        }

        if (options.addToMap) {
            marker.setMap(self.map);
        }

        if (options.fitBounds) {
            let bounds = new google.maps.LatLngBounds();

            bounds.extend(marker.getPosition());
            self.map.fitBounds(bounds);
        }

        return marker;
    }

    _drawCircleMarker(options, eventClick) {
        let self = this;
        let newOptions = {
            position: {
                lat: options.latlng[0],
                lng: options.latlng[1]
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: options.style.radius,
                fillColor: options.style.fillColor,
                fillOpacity: options.style.fillOpacity,
                strokeWeight: options.style.weight,
                strokeColor: options.style.color
            }
        };

        let marker = new google.maps.Marker(newOptions);

        if (eventClick) {
            google.maps.event.addListener(marker, 'click', (event) => {
                let param = new inlogMaps.EventReturn([event.latLng.lat(), event.latLng.lng()]);

                eventClick(marker, param, options.object);
            });
        }

        if (options.addToMap) {
            marker.setMap(self.map);
        }

        if (options.fitBounds) {
            let bounds = new google.maps.LatLngBounds();

            bounds.extend(marker.getPosition());
            self.map.fitBounds(bounds);
        }

        return marker;
    }

    _showMarkers(markers, show) {
        let self = this;

        markers.forEach(marker => marker.setMap(show ? self.map : null));
    }

    _alterMarkerOptions(markers, options) {
        let newOptions = {};

        if (options.latlng) {
            newOptions.position = {
                lat: options.latlng[0],
                lng: options.latlng[1]
            };
        }

        if (options.icon) {
            newOptions.icon = options.icon;
        }

        markers.forEach(marker => {
            if (options.style) {
                newOptions.icon = {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: options.style.radius !== null && options.style.radius !== undefined ?
                        options.style.radius : marker.icon.scale,
                    fillColor: options.style.fillColor !== null && options.style.fillColor !== undefined ?
                        options.style.fillColor : marker.icon.fillColor,
                    fillOpacity: options.style.fillOpacity !== null && options.style.fillOpacity !== undefined ?
                        options.style.fillOpacity : marker.icon.fillOpacity,
                    strokeWeight: options.style.weight !== null && options.style.weight !== undefined ?
                        options.style.weight : marker.icon.strokeWeight,
                    strokeColor: options.style.color !== null && options.style.color !== undefined ?
                        options.style.color : marker.icon.strokeColor
                };
            }

            marker.setOptions(newOptions);
        });
    }

    /* Polygons */
    _drawPolygon(options, eventClick) {
        let self = this;
        let paths = [];

        options.path.forEach(path => {
            paths.push({
                lat: path[0],
                lng: path[1]
            });
        });

        let newOptions = {
            paths: paths,
            strokeColor: options.color,
            strokeOpacity: options.opacity,
            strokeWeight: options.weight,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            draggable: options.draggable,
            editable: options.editable
        };

        let polygon = new google.maps.Polygon(newOptions);

        if (eventClick) {
            google.maps.event.addListener(polygon, 'click', (event) => {
                let param = new inlogMaps.EventReturn([event.latLng.lat(), event.latLng.lng()]);

                eventClick(polygon, param, options.object);
            });
        }

        if (options.addToMap) {
            polygon.setMap(self.map);
        }

        if (options.fitBounds) {
            self.map.fitBounds(self._getPolygonBounds(polygon));
        }

        return polygon;
    }

    _showPolygons(polygons, show) {
        let self = this;

        polygons.forEach(polygon => polygon.setMap(show ? self.map : null));
    }

    _alterPolygonOptions(polygons, options) {
        let newOptions = {};

        polygons.forEach(polygon => {
            newOptions = {
                strokeColor: options.color !== null && options.color !== undefined ?
                    options.color : polygon.strokeColor,
                strokeOpacity: options.opacity !== null && options.opacity !== undefined ?
                    options.opacity : polygon.strokeOpacity,
                strokeWeight: options.weight !== null && options.weight !== undefined ?
                    options.weight : polygon.strokeWeight,
                fillColor: options.fillColor !== null && options.fillColor !== undefined ?
                    options.fillColor : polygon.fillColor,
                fillOpacity: options.fillOpacity !== null && options.fillOpacity !== undefined ?
                    options.fillOpacity : polygon.fillOpacity
            };

            polygon.setOptions(newOptions);
        });
    }

    // --------------- HELPER FUNCTIONS
    _getPolygonBounds(polygon) {
        let bounds = new google.maps.LatLngBounds();
        let paths = polygon.getPaths().getArray();

        paths.forEach(path => {
            path.getArray().forEach(x => bounds.extend(x));
        });
        return bounds;
    }

    _getPolylineBounds(polyline) {
        let bounds = new google.maps.LatLngBounds();
        let paths = polyline.getPath().getArray();

        paths.forEach(path => bounds.extend(path));
        return bounds;
    }

    _getPolygonsBounds(polygons) {
        let bounds = new google.maps.LatLngBounds();

        polygons.forEach(polygon => {
            let paths = polygon.getPaths().getArray();

            paths.forEach(path => {
                path.getArray().forEach(x => bounds.extend(x));
            });
        });

        return bounds;
    }

    /* Circles */
    _drawCircle(options, eventClick) {
        let self = this;
        let latlng = {
            lat: options.center[0],
            lng: options.center[1]
        };
        let newOptions = {
            center: latlng,
            radius: options.radius,
            fillOpacity: options.fillOpacity,
            fillColor: options.fillColor,
            strokeOpacity: options.opacity,
            strokeWeight: options.weight,
            strokeColor: options.color,
            draggable: options.draggable,
            editable: options.editable
        };

        let circle = new google.maps.Circle(newOptions);

        if (eventClick) {
            google.maps.event.addListener(circle, 'click', (event) => {
                let param = new inlogMaps.EventReturn([event.latLng.lat(), event.latLng.lng()]);

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
    }

    _showCircles(circles, show) {
        let self = this;

        circles.forEach(circle => circle.setMap(show ? self.map : null));
    }

    _alterCircleOptions(circles, options) {
        let newOptions = {};

        circles.forEach(circle => {
            newOptions = {
                strokeColor: options.color !== null && options.color !== undefined ? options.color : circle.strokeColor,
                strokeOpacity: options.opacity !== null && options.opacity !== undefined ?
                    options.opacity : circle.strokeOpacity,
                strokeWeight: options.weight !== null && options.weight !== undefined ?
                    options.weight : circle.strokeWeight,
                fillColor: options.fillColor !== null && options.fillColor !== undefined ?
                    options.fillColor : circle.fillColor,
                fillOpacity: options.fillOpacity !== null && options.fillOpacity !== undefined ?
                    options.fillOpacity : circle.fillOpacity
            };

            circle.setOptions(newOptions);
        });
    }

    /* Polylines */
    _drawPolyline(options, eventClick) {
        let self = this;
        let newOptions = {
            draggable: options.draggable,
            editable: options.editable,
            strokeColor: options.color,
            strokeWeight: options.weight,
            infowindows: options.infowindows,
            object: options.object
        };

        newOptions.path = options.path ? options.path.map(x => {
            return {
                lat: x[0],
                lng: x[1]
            };
        }) : [];

        let polyline = new google.maps.Polyline(newOptions);

        if (eventClick) {
            google.maps.event.addListener(polyline, 'click', (event) => {
                let param = new inlogMaps.EventReturn([event.latLng.lat(), event.latLng.lng()]);

                eventClick(polyline, param, polyline.object);
            });
        }

        if (options.addToMap) {
            polyline.setMap(self.map);
        }

        if (options.fitBounds) {
            self.map.fitBounds(self._getPolylineBounds(polyline));
        }

        return polyline;
    }

    _showPolyline(polyline, show) {
        let self = this;

        polyline.setMap(show ? self.map : null);
    }

    _drawPolylineWithNavigation(options) {
        let self = this;
        let polyline = self._drawPolyline(options);

        self._addNavigation(polyline, options.navigateOptions);
        return polyline;
    }

    _addNavigation(polyline, options) {
        let self = this;

        google.maps.event.clearListeners(polyline, 'click');
        google.maps.event.addListener(polyline, 'click', self._onClickPolyline.bind(self, polyline, options));
    }

    _onClickPolyline(polyline, options, event) {
        let self = this;
        let index = self._checkIdx(polyline, event.latLng);

        polyline.idxInicial = index;
        polyline.idxFinal = index + 1;

        self._moveSelectedPath(polyline, options);
        self.selectedPolyline = polyline;

        google.maps.event.clearListeners(document, 'keyup');
        google.maps.event.addDomListener(document, 'keyup', self._onKeyUp.bind(self));
    }

    _onKeyUp(event) {
        let self = this;

        if (self.selectedPath) {
            switch (event.which ? event.which : event.keyCode) {
                // seta para cima ou seta para direita ou W ou D
                case 38:
                case 39:
                    self._moveFowards(event.shiftKey);
                    break; // seta para esquerda ou seta para baixo ou S ou A
                case 37:
                case 40:
                    self._moveBackwards(event.shiftKey);
                    break;
            }
        }
    }

    _moveFowards(multiselection) {
        let self = this;
        let polyline = self.selectedPolyline;

        if (self.directionForward && polyline.idxFinal < polyline.getPath().getArray().length - 1) {
            self._navigateFoward(multiselection, polyline);
        }
        self.directionForward = true;
        self._moveSelectedPath(polyline);
    }

    _navigateFoward(multiselection, polyline) {
        if (!multiselection) {
            polyline.idxFinal++;
            polyline.idxInicial = self.multiSelection ? polyline.idxFinal - 1 : polyline.idxInicial + 1;
            self.multiSelection = false;
        } else {
            self.multiSelection = true;
            if (self.multiSelectionForward) {
                polyline.idxFinal++;
            }
            self.multiSelectionForward = true;
        }
    }

    _moveBackwards(multiselection) {
        let self = this;
        let polyline = self.selectedPolyline;

        if (!self.directionForward && polyline.idxInicial > 0) {
            self._navigateBackward(multiselection, polyline);
        }
        self.directionForward = false;
        self._moveSelectedPath(polyline);
    }

    _navigateBackward(multiselection, polyline) {
        if (!multiselection) {
            polyline.idxInicial--;
            polyline.idxFinal = !self.multiSelection ? polyline.idxFinal - 1 : polyline.idxInicial + 1;
            self.multiSelection = false;
        } else {
            self.multiSelection = true;
            if (!self.multiSelectionForward) {
                polyline.idxInicial--;
            }
            self.multiSelectionForward = false;
        }
    }

    _moveSelectedPath(polyline, options) {
        let self = this;
        let pathSelected = polyline.getPath().getArray().slice(polyline.idxInicial, polyline.idxFinal + 1);

        if (self.selectedPath) {
            self.selectedPath.setPath(pathSelected);
        } else {
            let newOptions = {
                map: self.map,
                strokeColor: options && options.color || '#FF0000',
                strokeWeight: options && options.weight || 10,
                zIndex: 9999,
                path: pathSelected
            };

            self.selectedPath = new google.maps.Polyline(newOptions);
        }

        self._drawPopupNavigation(polyline);
    }

    _drawPopupNavigation(polyline) {
        let self = this;

        let idx = self.directionForward ? polyline.idxFinal : polyline.idxInicial;
        let infowindow = polyline.infowindows ? polyline.infowindows[idx] : null;

        if (infowindow) {
            let point = polyline.getPath().getArray()[idx];

            if (self.navigateInfoWindow) {
                self._alterPopup(self.navigateInfoWindow, {
                    latlng: [point.lat(), point.lng()],
                    content: infowindow
                });
            } else {
                self.navigateInfoWindow = self._drawPopup({
                    latlng: [point.lat(), point.lng()],
                    content: infowindow
                });
            }
        }
    }

    _checkIdx(polyline, point) {
        let self = this,
            path = polyline.getPath(),
            distance = 0,
            minDistance = Number.MAX_VALUE,
            returnValue = -1;

        for (let i = 0; i < path.length - 1; i++) {
            distance = self._distanceToLine(path.getAt(i), path.getAt(i + 1), point);

            if (distance < minDistance) {
                minDistance = distance;
                returnValue = i;
            }
        }
        return returnValue;
    }

    _distanceToLine(pt1, pt2, pt) {
        let self = this,
            deltaX = pt2.lng() - pt1.lng(),
            deltaY = pt2.lat() - pt1.lat(),
            incIntersect = (pt.lng() - pt1.lng()) * deltaX,
            deltaSum = (deltaX * deltaX) + (deltaY * deltaY);

        incIntersect += (pt.lat() - pt1.lat()) * deltaY;
        if (deltaSum > 0) incIntersect /= deltaSum;
        else incIntersect = -1;

        // A interseção ocorre fora do segmento de reta, "antes" do pt1.
        if (incIntersect < 0) return self._kmTo(pt, pt1);
        // A interseção ocorre fora do segmento de reta, "depois" do pt2.
        else if (incIntersect > 1) return self._kmTo(pt, pt2);

        // Cálculo do ponto de interseção.
        let intersect = new google.maps.LatLng(pt1.lat() + incIntersect * deltaY, pt1.lng() + incIntersect * deltaX);

        return self._kmTo(pt, intersect);
    }

    _kmTo(pt1, pt2) {
        let e = Math,
            ra = e.PI / 180,
            b = pt1.lat() * ra,
            c = pt2.lat() * ra,
            d = b - c,
            g = pt1.lng() * ra - pt2.lng() * ra,
            f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));

        return f * 6378.137 * 1000;
    }

    _addPolylinePath(polyline, position) {
        let path = polyline.getPath();

        path.push(new google.maps.LatLng(position[0], position[1]));
        polyline.setPath(path);
    }

    _removePolylineHighlight() {
        let self = this;

        google.maps.event.clearListeners(document, 'keyup');
        self._clearPolylinePath(self.selectedPath);
        self.navigateInfoWindow.close();

    }

    _clearPolylinePath(polyline) {
        polyline.setPath([]);
    }

    _alterPolylineOptions(polyline, options) {
        let newOptions = {
            draggable: options.draggable !== null && options.draggable !== undefined ?
                options.draggable : polyline.draggable,
            editable: options.editable !== null && options.editable !== undefined ?
                options.editable : polyline.editable,
            strokeColor: options.color !== null && options.color !== undefined ?
                options.color : polyline.strokeColor,
            strokeWeight: options.weight !== null && options.weight !== undefined ?
                options.weight : polyline.strokeWeight,
            infowindows: options.infowindows !== null && options.infowindows !== undefined ?
                options.infowindows : polyline.infowindows,
            object: options.object !== null && options.object !== undefined ?
                options.object : polyline.object
        };

        polyline.setOptions(newOptions);
    }

    /* Info Windows */
    _drawPopup(options) {
        let self = this;
        let infowindow = new google.maps.InfoWindow({
            content: options.content
        });

        infowindow.setPosition({
            lat: options.latlng[0],
            lng: options.latlng[1]
        });

        infowindow.open(self.map, options.marker || null);
        return infowindow;
    }

    _alterPopup(popup, options) {
        let self = this;

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
    }

    /* Map */
    _addClickMap(eventClick) {
        let self = this;

        google.maps.event.addListener(self.map, 'click', (event) => {
            let param = new inlogMaps.EventReturn([event.latLng.lat(), event.latLng.lng()]);

            eventClick(param);
        });
    }

    _removeClickMap() {
        let self = this;

        google.maps.event.clearListeners(self.map, 'click');
    }
}

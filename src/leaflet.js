import * as L from 'leaflet';

export default class Leaflet {
    constructor() {
        // Set map options
        let mapOptions = {
            zoom: 4,
            maxZoom: 20,
            minZoom: 4,
            center: L.latLng(-14, -54),
            editable: true
        };
        // initialize the map
        let map = L.map('map', mapOptions);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', mapOptions).addTo(map);

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

        objects.forEach(elem => self.map.addLayer(elem));

        if (self.map.options) {
            if (self.map.options.editable) {
                objects.forEach(obj => {
                    if (obj.enableEdit) {
                        obj.enableEdit();
                    }

                    if (eventClick) {
                        obj.on('click', (event) => {
                            let param = new inlogMaps.EventReturn([event.latlng.lat, event.latlng.lng]);

                            eventClick(param);
                        });
                    }
                });
            }
        }
    }

    _parseGeoJson(data, options) {
        var self = this;
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
        let parsedCoordinates = [];

        if (data.properties) {
            Object.assign(objectOptions, data.properties);
        }

        switch (geometry.type) {
            case 'Point':
                parsedCoordinates = geometry.coordinates.reverse();
                return L.marker(parsedCoordinates, objectOptions);
            case 'Polygon':
                geometry.coordinates.forEach(polygon => parsedCoordinates.push(polygon.map((elem) => elem.reverse())));
                return L.polygon(parsedCoordinates, objectOptions);
            case 'LineString':
                parsedCoordinates = geometry.coordinates.map((elem) => elem.reverse());
                return L.polyline(parsedCoordinates, objectOptions);
            default:
                throw new Error('Forma de objeto desconhecida.');
        }
    }

    /* Markers */
    _drawMarker(options, eventClick) {
        let self = this;
        let newOptions = {
            draggable: options.draggable
        };

        if (options.icon) {
            newOptions.icon = L.icon({
                iconUrl: options.icon.url,
                iconSize: options.icon.size
            });
        }

        let marker = L.marker(options.latlng, newOptions);

        if (eventClick) {
            marker.on('click', (event) => {
                let param = new inlogMaps.EventReturn([event.latlng.lat, event.latlng.lng]);

                eventClick(marker, param, options.object);
            });
        }

        if (options.addToMap) {
            marker.addTo(self.map);
        }

        if (options.fitBounds) {
            let group = new L.FeatureGroup([marker]);

            self.map.fitBounds(group.getBounds());
        }

        return marker;
    }

    _drawCircleMarker(options, eventClick) {
        let self = this;
        let marker = L.circleMarker(options.latlng, options.style);

        if (eventClick) {
            marker.on('click', (event) => {
                let param = new inlogMaps.EventReturn([event.latlng.lat, event.latlng.lng]);

                eventClick(marker, param);
            }, options.object);
        }

        if (options.addToMap) {
            marker.addTo(self.map);
        }

        if (options.fitBounds) {
            let group = new L.FeatureGroup([marker]);

            self.map.fitBounds(group.getBounds());
        }

        return marker;
    }

    _showMarkers(markers, show) {
        let self = this;

        markers.forEach(marker => show ? self.map.addLayer(marker) : self.map.removeLayer(marker));
    }

    _alterMarkerOptions(markers, options) {
        markers.forEach(marker => {
            if (marker.type === 'circle' && options.style) {
                let style = {
                    radius: options.style.radius !== null && options.style.radius !== undefined ?
                        options.style.radius : marker.options.radius,
                    fillColor: options.style.fillColor !== null && options.style.fillColor !== undefined ?
                        options.style.fillColor : marker.options.fillColor,
                    fillOpacity: options.style.fillOpacity !== null && options.style.fillOpacity !== undefined ?
                        options.style.fillOpacity : marker.options.fillOpacity,
                    strokeWeight: options.style.weight !== null && options.style.weight !== undefined ?
                        options.style.weight : marker.options.strokeWeight,
                    strokeColor: options.style.color !== null && options.style.color !== undefined ?
                        options.style.color : marker.options.strokeColor
                };

                marker.setStyle(style);
            }

            if (options.icon) {
                marker.setIcon(L.icon({
                    iconUrl: options.icon.url,
                    iconSize: options.icon.size
                }));
            }

            if (options.latlng) {
                marker.setLatLng(options.latlng);
            }
        });
    }

    /* Polygons */
    _drawPolygon(options, eventClick) {
        let self = this;
        let newOptions = {
            color: options.color,
            opacity: options.opacity,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            weight: options.weight,
            draggable: options.draggable
        };
        let polygon = L.polygon(options.path, newOptions);

        if (eventClick) {
            polygon.on('click', (event) => {
                let param = new inlogMaps.EventReturn([event.latlng.lat, event.latlng.lng]);

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
    }

    _showPolygons(polygons, show) {
        let self = this;

        polygons.forEach(polygon => show ? self.map.addLayer(polygon) : self.map.removeLayer(polygon));
    }

    _alterPolygonOptions(polygons, options) {
        polygons.forEach(polygon => {
            let style = {
                weight: options.weight !== null && options.weight !== undefined ?
                    options.weight : polygon.options.weight,
                fillOpacity: options.fillOpacity !== null && options.fillOpacity !== undefined ?
                    options.fillOpacity : polygon.options.fillOpacity,
                fillColor: options.fillColor !== null && options.fillColor !== undefined ?
                    options.fillColor : polygon.options.fillColor,
                color: options.color !== null && options.color !== undefined ?
                    options.color : polygon.options.color,
                opacity: options.opacity !== null && options.opacity !== undefined ?
                    options.opacity : polygon.options.opacity
            };

            polygon.setStyle(style);
        });
    }

    /* Circles */
    _drawCircle(options, eventClick) {
        let self = this;
        let newOptions = {
            radius: options.radius,
            fillOpacity: options.fillOpacity,
            fillColor: options.fillColor,
            opacity: options.opacity,
            weight: options.weight,
            color: options.color,
            draggable: options.draggable
        };
        let circle = L.circle(options.center, newOptions);

        if (eventClick) {
            circle.on('click', (event) => {
                let param = new inlogMaps.EventReturn([event.latlng.lat, event.latlng.lng]);

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
    }

    _showCircles(circles, show) {
        let self = this;

        circles.forEach(circle => show ? self.map.addLayer(circle) : self.map.removeLayer(circle));
    }

    _alterCircleOptions(circles, options) {
        circles.forEach(circle => {
            let style = {
                weight: options.weight !== null && options.weight !== undefined ?
                    options.weight : circle.options.weight,
                fillOpacity: options.fillOpacity !== null && options.fillOpacity !== undefined ?
                    options.fillOpacity : circle.options.fillOpacity,
                fillColor: options.fillColor !== null && options.fillColor !== undefined ?
                    options.fillColor : circle.options.fillColor,
                color: options.color !== null && options.color !== undefined ?
                    options.color : circle.options.color,
                opacity: options.opacity !== null && options.opacity !== undefined ?
                    options.opacity : circle.options.opacity
            };

            circle.setStyle(style);
        });
    }

    /* Polylines */
    _drawPolyline(options, eventClick) {
        let self = this;

        let newOptions = {
            draggable: options.draggable,
            editable: options.editable,
            color: options.color || '#000000',
            weight: options.weight || 3,
            infowindows: options.infowindows,
            object: options.object
        };

        let polyline = new L.Polyline(options.path || [], newOptions);

        if (eventClick) {
            polyline.on('click', (event) => {
                let param = new inlogMaps.EventReturn([event.latlng.lat, event.latlng.lng]);

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
    }

    _showPolyline(polyline, show) {
        let self = this;

        if (show) {
            self.map.addLayer(polyline);
        } else {
            self.map.removeLayer(polyline);
        }
    }

    _drawPolylineWithNavigation(options) {
        let self = this;
        let polyline = self._drawPolyline(options);

        self._addNavigation(polyline, options.navigateOptions);
        return polyline;
    }

    _addNavigation(polyline, options) {
        let self = this;

        polyline.clearAllEventListeners();
        polyline.on('click', self._onClickPolyline.bind(self, polyline, options));
    }

    _onClickPolyline(polyline, options, event) {
        let self = this;
        let index = self._checkIdx(polyline, event.latlng);

        polyline.idxInicial = index;
        polyline.idxFinal = index + 1;

        self._moveSelectedPath(polyline, options);
        self.selectedPolyline = polyline;

        document.onkeyup = self._onKeyUp.bind(self);
    }

    _onKeyUp(event) {
        let self = this;

        if (self.selectedPath && event.ctrlKey) {
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

        if (self.directionForward && polyline.idxFinal < polyline.getLatLngs().length - 1) {
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
        let pathSelected = polyline.getLatLngs().slice(polyline.idxInicial, polyline.idxFinal + 1);

        if (self.selectedPath) {
            self.selectedPath.setLatLngs(pathSelected);
        } else {
            let newOptions = {
                color: options && options.color || '#FF0000',
                weight: options && options.weight || 10,
                zIndex: 9999
            };

            self.selectedPath = new L.Polyline(pathSelected, newOptions);
            self.selectedPath.addTo(self.map);
        }

        let idx = self.directionForward ? polyline.idxFinal : polyline.idxInicial;
        let infowindow = polyline.options.infowindows ? polyline.options.infowindows[idx] : null;

        if (infowindow) {
            let point = polyline.getLatLngs()[idx];

            if (self.navigateInfoWindow) {
                self._alterPopup(self.navigateInfoWindow, {
                    latlng: [point.lat, point.lng],
                    content: infowindow
                });
            } else {
                self.navigateInfoWindow = self._drawPopup({
                    latlng: [point.lat, point.lng],
                    content: infowindow
                });
            }
        }
    }

    _checkIdx(polyline, point) {
        let self = this,
            path = polyline.getLatLngs(),
            distance = 0,
            minDistance = Number.MAX_VALUE,
            returnValue = -1;

        for (let i = 0; i < path.length - 1; i++) {
            distance = self._distanceToLine(path[i], path[i + 1], point);

            if (distance < minDistance) {
                minDistance = distance;
                returnValue = i;
            }
        }
        return returnValue;
    }

    _distanceToLine(pt1, pt2, pt) {
        let self = this,
            deltaX = pt2.lng - pt1.lng,
            deltaY = pt2.lat - pt1.lat,
            incIntersect = (pt.lng - pt1.lng) * deltaX,
            deltaSum = (deltaX * deltaX) + (deltaY * deltaY);

        incIntersect += (pt.lat - pt1.lat) * deltaY;
        if (deltaSum > 0) incIntersect /= deltaSum;
        else incIntersect = -1;

        // A interseção ocorre fora do segmento de reta, "antes" do pt1.
        if (incIntersect < 0) return self._kmTo(pt, pt1);
        // A interseção ocorre fora do segmento de reta, "depois" do pt2.
        else if (incIntersect > 1) return self._kmTo(pt, pt2);

        // Cálculo do ponto de interseção.
        let intersect = new L.LatLng(pt1.lat + incIntersect * deltaY, pt1.lng + incIntersect * deltaX);

        return self._kmTo(pt, intersect);
    }

    _kmTo(pt1, pt2) {
        let e = Math,
            ra = e.PI / 180,
            b = pt1.lat * ra,
            c = pt2.lat * ra,
            d = b - c,
            g = pt1.lng * ra - pt2.lng * ra,
            f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));

        return f * 6378.137 * 1000;
    }

    _addPolylinePath(polyline, position) {
        let path = polyline.getLatLngs();

        path.push(new L.LatLng(position[0], position[1]));
        polyline.setLatLngs(path);
    }

    _removePolylineHighlight() {
        let self = this;

        self._clearPolylinePath(self.selectedPath);
        self.navigateInfoWindow.remove();
        document.onkeyup = null;
    }

    _clearPolylinePath(polyline) {
        polyline.setLatLngs([]);
    }

    _alterPolylineOptions(polyline, options) {
        let style = {
            draggable: options.draggable !== null && options.draggable !== undefined ?
                options.draggable : polyline.options.draggable,
            color: options.color !== null && options.color !== undefined ?
                options.color : polyline.options.color,
            weight: options.weight !== null && options.weight !== undefined ?
                options.weight : polyline.options.weight,
            object: options.object !== null && options.object !== undefined ?
                options.object : polyline.options.object
        };

        polyline.setStyle(style);

        if (options.editable) {
            polyline.enableEdit();
        }
    }

    /* Popups */
    _drawPopup(options) {
        let self = this;
        let popup = null;

        if (options.marker) {
            options.marker.bindPopup(options.content);
            popup = options.marker.getPopup();

            options.marker.openPopup();
            popup.marker = true;
        } else {
            popup = new L.Popup();
            popup.setLatLng(options.latlng);
            popup.setContent(options.content);

            popup.openOn(self.map);
        }

        return popup;
    }

    _alterPopup(popup, options) {
        let self = this;

        if (options.content) {
            popup.setContent(options.content);
        }

        if (options.latlng) {
            popup.setLatLng(options.latlng);
        }

        if (!popup.isOpen() && !popup.marker) {
            popup.openOn(self.map);
        }
    }

    /* Map */
    _addClickMap(eventClick) {
        let self = this;

        self.map.on('click', (event) => {
            let param = new inlogMaps.EventReturn([event.latlng.lat, event.latlng.lng]);

            eventClick(param);
        });
    }

    _removeClickMap() {
        let self = this;

        self.map.off('click');
    }
}

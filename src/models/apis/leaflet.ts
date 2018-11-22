import { MapsApiLoaderService } from '../../utils/maps-api-loader.service';
import { MapType } from '../dto/map-type';
import CircleAlterOptions from '../features/circle/circle-alter-options';
import CircleOptions from '../features/circle/circle-options';
import EventReturn from '../features/events/event-return';
import GeoJsonOptions from '../features/geojson/geojson-options';
import CircleMarkerOptions from '../features/marker/circle-marker-options';
import MarkerAlterOptions from '../features/marker/marker-alter-options';
import MarkerOptions from '../features/marker/marker-options';
import PolygonAlterOptions from '../features/polygons/polygon-alter-options';
import PolygonOptions from '../features/polygons/polygon-options';
import NavigationOptions from '../features/polyline/navigations-options';
import PolylineOptions from '../features/polyline/polyline-options';
import PopupOptions from '../features/popup/popup-options';
import IMapFunctions from './mapFunctions';

export default class Leaflet implements IMapFunctions {
    private map = null;
    private leaflet = null;
    private position = null;
    private mapsApiLoader: MapsApiLoaderService = new MapsApiLoaderService();
    private selectedPolyline = null;
    private selectedPath = null;
    private navigateInfoWindow = null;
    private directionForward = false;
    private multiSelectionForward = false;
    private multiSelection = false;

    constructor() { /* */ }

    public initialize(mapType: MapType, params) {
        return this.mapsApiLoader.loadApi(mapType, params)
            .then((api) => {
                this.leaflet = api;

                const mapOptions = {
                    center: new this.leaflet.LatLng(-14, -54),
                    editable: true,
                    maxZoom: 20,
                    minZoom: 4,
                    zoom: 4
                };
                this.map = new this.leaflet.Map('inlog-map', mapOptions);
                new this.leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', mapOptions)
                    .addTo(this.map);

                return this;
            })
            .catch((err) => err);
    }

    /* GEOJson */
    public loadGEOJson(data: object, options: GeoJsonOptions, eventClick) {
        const self = this;
        const objects = self.parseGeoJson(data, options);

        objects.forEach((elem) => self.map.addLayer(elem));

        if (self.map.options) {
            if (self.map.options.editable) {
                objects.forEach((obj) => {
                    if (obj.enableEdit) {
                        obj.enableEdit();
                    }

                    if (eventClick) {
                        obj.on('click', (event) => {
                            const param: EventReturn = { latlng: [event.latlng.lat, event.latlng.lng] };
                            eventClick(param);
                        });
                    }
                });
            }
        }
    }

    /* Markers */
    public drawMarker(options: MarkerOptions, eventClick) {
        let newOptions = null;

        if (options.icon) {
            newOptions = {
                draggable: options.draggable,
                icon: new this.leaflet.Icon({
                    iconSize: options.icon.size,
                    iconUrl: options.icon.url
                })
            };
        } else {
            newOptions = { draggable: options.draggable };
        }

        const marker = new this.leaflet.Marker(options.latlng, newOptions);

        if (eventClick) {
            marker.on('click', (event) => {
                const param: EventReturn = { latlng: [event.latlng.lat, event.latlng.lng] };
                eventClick(marker, param, options.object);
            });
        }

        if (options.addToMap) {
            marker.addTo(this.map);
        }

        if (options.fitBounds) {
            const group = new this.leaflet.FeatureGroup([marker]);
            this.map.fitBounds(group.getBounds());
        }

        return marker;
    }

    public fitBoundsPositions(markers: any[]) {
        const group = new this.leaflet.featureGroup(markers);
        this.map.fitBounds(group.getBounds());
    }

    public drawCircleMarker(options: CircleMarkerOptions, eventClick) {
        const self = this;
        const marker = new this.leaflet.circleMarker(options.latlng, options.style);

        if (eventClick) {
            marker.on('click', (event) => {
                const param: EventReturn = { latlng: [event.latlng.lat, event.latlng.lng] };
                eventClick(marker, param);
            }, options.object);
        }

        if (options.addToMap) {
            marker.addTo(self.map);
        }

        if (options.fitBounds) {
            const group = new this.leaflet.FeatureGroup([marker]);
            self.map.fitBounds(group.getBounds());
        }

        return marker;
    }

    public toggleMarkers(markers: any[], show: boolean) {
        const self = this;
        markers.forEach((marker) => show ? self.map.addLayer(marker) : self.map.removeLayer(marker));
    }

    public alterMarkerOptions(markers: any[], options: MarkerAlterOptions) {
        markers.forEach((marker) => {
            if (marker.type === 'circle' && options.style) {
                const style = {
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
                marker.setIcon(new this.leaflet.icon({
                    iconSize: options.icon.size,
                    iconUrl: options.icon.url
                }));
            }

            if (options.latlng) {
                marker.setLatLng(options.latlng);
            }
        });
    }

    /* Polygons */
    public drawPolygon(options: PolygonOptions, eventClick) {
        const self = this;
        const newOptions = {
            color: options.color,
            draggable: options.draggable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            opacity: options.opacity,
            weight: options.weight
        };
        const polygon = new this.leaflet.Polygon(options.path, newOptions);

        if (eventClick) {
            polygon.on('click', (event) => {
                const param: EventReturn = { latlng: [event.latlng.lat, event.latlng.lng] };
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

    public fitBoundsPolygon(polygon) {
        const self = this;
        self.map.fitBounds(polygon.getBounds());
    }

    public togglePolygons(polygons: any[], show: boolean) {
        const self = this;
        polygons.forEach((polygon) => show ? self.map.addLayer(polygon) : self.map.removeLayer(polygon));
    }

    public alterPolygonOptions(polygons: any[], options: PolygonAlterOptions) {
        polygons.forEach((polygon) => {
            const style = {
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
    }

    /* Circles */
    public drawCircle(options: CircleOptions, eventClick) {
        const self = this;
        const newOptions = {
            color: options.color,
            draggable: options.draggable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            opacity: options.opacity,
            radius: options.radius,
            weight: options.weight
        };
        const circle = new this.leaflet.Circle(options.center, newOptions);

        if (eventClick) {
            circle.on('click', (event) => {
                const param: EventReturn = { latlng: [event.latlng.lat, event.latlng.lng] };
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

    public toggleCircles(circles: any[], show: boolean) {
        const self = this;
        circles.forEach((circle) => show ? self.map.addLayer(circle) : self.map.removeLayer(circle));
    }

    public alterCircleOptions(circles: any[], options: CircleAlterOptions) {
        circles.forEach((circle) => {
            const style = {
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
    }

    /* Polylines */
    public drawPolyline(options: PolylineOptions, eventClick) {
        const self = this;

        const newOptions = {
            color: options.color || '#000000',
            draggable: options.draggable,
            editable: options.editable,
            infowindows: options.infowindows,
            object: options.object,
            weight: options.weight || 3
        };

        const polyline = new this.leaflet.Polyline(options.path || [], newOptions);

        if (eventClick) {
            polyline.on('click', (event) => {
                const param: EventReturn = { latlng: [event.latlng.lat, event.latlng.lng] };
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

    public togglePolyline(polyline: any, show: boolean) {
        const self = this;

        if (show) {
            self.map.addLayer(polyline);
        } else {
            self.map.removeLayer(polyline);
        }
    }

    public drawPolylineWithNavigation(options: PolylineOptions) {
        const polyline = this.drawPolyline(options, null);

        this.addNavigation(polyline, options.navigateOptions);
        return polyline;
    }

    public clearListenersPolyline(polyline) {
        polyline.clearAllEventListeners();
    }

    public addPolylinePath(polyline, position: number[]) {
        const path = polyline.getLatLngs();

        path.push(new this.leaflet.LatLng(position[0], position[1]));
        polyline.setLatLngs(path);
    }

    public removePolylineHighlight() {
        const self = this;

        if (self.selectedPath) {
            self.clearPolylinePath(self.selectedPath);
        }
        if (self.navigateInfoWindow) {
            self.navigateInfoWindow.remove();
        }
        document.onkeyup = null;
    }

    public alterPolylineOptions(polyline, options: PolylineOptions) {
        const style = {
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
    }

    /* Popups */
    public drawPopup(options: PopupOptions) {
        const self = this;
        let popup = null;

        if (options.marker) {
            options.marker.bindPopup(options.content);
            popup = options.marker.getPopup();

            options.marker.openPopup();
            popup.marker = true;
        } else {
            popup = new this.leaflet.Popup();
            popup.setLatLng(options.latlng);
            popup.setContent(options.content);

            popup.openOn(self.map);
        }

        return popup;
    }

    public alterPopup(popup, options: PopupOptions) {
        const self = this;

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
    public addClickMap(eventClick) {
        const self = this;

        self.map.on('click', (event) => {
            const param: EventReturn = { latlng: [event.latlng.lat, event.latlng.lng] };
            eventClick(param);
        });
    }

    public removeClickMap() {
        const self = this;
        self.map.off('click');
    }

    /* Private Methods */
    private addNavigation(polyline, options: NavigationOptions) {
        polyline.clearAllEventListeners();
        polyline.on('click', this.onClickPolyline.bind(this, polyline, options));
    }

    private onClickPolyline(polyline, options: NavigationOptions, event) {
        const index = this.checkIdx(polyline, event.latlng);

        polyline.idxInicial = index;
        polyline.idxFinal = index + 1;

        this.moveSelectedPath(polyline, options);
        this.selectedPolyline = polyline;

        document.onkeyup = this.onKeyUp.bind(this);
    }

    private onKeyUp(event) {
        const self = this;

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
    }

    private moveFowards(multiselection: boolean) {
        const polyline = this.selectedPolyline;

        if (this.directionForward && polyline.idxFinal < polyline.getLatLngs().length - 1) {
            this.navigateFoward(multiselection, polyline);
        }
        this.directionForward = true;
        this.moveSelectedPath(polyline, null);
    }

    private navigateFoward(multiSelection: boolean, polyline) {
        if (!multiSelection) {
            polyline.idxFinal++;
            polyline.idxInicial = this.multiSelection ? polyline.idxFinal - 1 : polyline.idxInicial + 1;
            this.multiSelection = false;
        } else {
            this.multiSelection = true;
            if (this.multiSelectionForward) {
                polyline.idxFinal++;
            }
            this.multiSelectionForward = true;
        }
    }

    private moveBackwards(multiSelection: boolean) {
        const polyline = this.selectedPolyline;

        if (!this.directionForward && polyline.idxInicial > 0) {
            this.navigateBackward(multiSelection, polyline);
        }
        this.directionForward = false;
        this.moveSelectedPath(polyline, null);
    }

    private navigateBackward(multiSelection: boolean, polyline) {
        const self = this;
        if (!multiSelection) {
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

    private moveSelectedPath(polyline, options: NavigationOptions) {
        const self = this;
        const pathSelected = polyline.getLatLngs().slice(polyline.idxInicial, polyline.idxFinal + 1);

        if (self.selectedPath) {
            self.selectedPath.setLatLngs(pathSelected);
        } else {
            const newOptions = {
                color: options && options.color || '#FF0000',
                weight: options && options.weight || 10,
                zIndex: 9999
            };

            self.selectedPath = new this.leaflet.Polyline(pathSelected, newOptions);
            self.selectedPath.addTo(self.map);
        }

        const idx = self.directionForward ? polyline.idxFinal : polyline.idxInicial;
        const infowindow = polyline.options.infowindows ? polyline.options.infowindows[idx] : null;

        if (infowindow) {
            const point = polyline.getLatLngs()[idx];

            if (self.navigateInfoWindow) {
                self.alterPopup(self.navigateInfoWindow, {
                    content: infowindow,
                    latlng: [point.lat, point.lng]
                });
            } else {
                self.navigateInfoWindow = self.drawPopup({
                    content: infowindow,
                    latlng: [point.lat, point.lng]
                });
            }
        }
    }

    private checkIdx(polyline, point) {
        const self = this;
        const path = polyline.getLatLngs();
        let distance = 0;
        let minDistance = Number.MAX_VALUE;
        let returnValue = -1;

        for (let i = 0; i < path.length - 1; i++) {
            distance = self.distanceToLine(path[i], path[i + 1], point);

            if (distance < minDistance) {
                minDistance = distance;
                returnValue = i;
            }
        }
        return returnValue;
    }

    private distanceToLine(pt1, pt2, pt) {
        const self = this;
        const deltaX = pt2.lng - pt1.lng;
        const deltaY = pt2.lat - pt1.lat;
        let incIntersect = (pt.lng - pt1.lng) * deltaX;
        const deltaSum = (deltaX * deltaX) + (deltaY * deltaY);

        incIntersect += (pt.lat - pt1.lat) * deltaY;
        if (deltaSum > 0) {
            incIntersect /= deltaSum;
        } else {
            incIntersect = -1;
        }

        // A interseção ocorre fora do segmento de reta, "antes" do pt1.
        if (incIntersect < 0) {
            return self.kmTo(pt, pt1);
        } else if (incIntersect > 1) {
            return self.kmTo(pt, pt2);
        }

        // Cálculo do ponto de interseção.
        const intersect = new this.leaflet.LatLng(pt1.lat + incIntersect * deltaY, pt1.lng + incIntersect * deltaX);

        return self.kmTo(pt, intersect);
    }

    private kmTo(pt1, pt2) {
        const e = Math;
        const ra = e.PI / 180;
        const b = pt1.lat * ra;
        const c = pt2.lat * ra;
        const d = b - c;
        const g = pt1.lng * ra - pt2.lng * ra;
        const f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));

        return f * 6378.137 * 1000;
    }

    private parseGeoJson(data, options: GeoJsonOptions) {
        const self = this;
        const parsedFeatures = [];

        if (Array.isArray(data.features)) {
            for (const feature of data.features) {
                parsedFeatures.push(self.parseGeoJsonToObject(feature, options));
            }
        } else {
            parsedFeatures.push(self.parseGeoJsonToObject(data, options));
        }

        return parsedFeatures;
    }

    private parseGeoJsonToObject(data, objectOptions) {
        const geometry = data.geometry;
        let parsedCoordinates = [];

        if (data.properties) {
            Object.assign(objectOptions, data.properties);
        }

        switch (geometry.type) {
            case 'Point':
                parsedCoordinates = geometry.coordinates.reverse();
                return new this.leaflet.Marker(parsedCoordinates, objectOptions);
            case 'Polygon':
                geometry.coordinates
                    .forEach((polygon) => parsedCoordinates.push(polygon.map((elem) => elem.reverse())));
                return new this.leaflet.Polygon(parsedCoordinates, objectOptions);
            case 'LineString':
                parsedCoordinates = geometry.coordinates.map((elem) => elem.reverse());
                return new this.leaflet.Polyline(parsedCoordinates, objectOptions);
            default:
                throw new Error('Forma de objeto desconhecida.');
        }
    }

    private clearPolylinePath(polyline) {
        polyline.setLatLngs([]);
    }
}
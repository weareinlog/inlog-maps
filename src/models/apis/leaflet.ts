import { OverlayOptions } from '../..';
import { MapsApiLoaderService } from '../../utils/maps-api-loader.service';
import { EventType, MarkerEventType, CircleEventType } from '../dto/event-type';
import { MapType } from '../dto/map-type';
import { PolylineType } from '../dto/polyline-type';
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
    private mapsApiLoader: MapsApiLoaderService = new MapsApiLoaderService();
    private selectedPolyline = null;
    private selectedPath = null;
    private navigateInfoWindow = null;
    private directionForward = false;
    private multiSelectionForward = false;
    private multiSelection = false;

    constructor() { /* */ }

    public initialize(mapType: MapType, params: any, elementId: string): Promise<any> {
        return this.mapsApiLoader.loadApi(mapType, params)
            .then(async (api) => {
                this.leaflet = api;
                this.loadDependencies(params);

                await this.mapTimeout(200);

                const mapOptions: any = {
                    center: new this.leaflet.LatLng(-14, -54),
                    editable: true,
                    maxZoom: 20,
                    minZoom: 4,
                    zoom: 4
                };

                if (params.gestureHandling) {
                    mapOptions.gestureHandling = true;
                }

                this.map = new this.leaflet.Map(elementId, mapOptions);
                new this.leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', mapOptions)
                    .addTo(this.map);

                return this;
            })
            .catch((err) => err);
    }

    private mapTimeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private loadDependencies(params: any) {
        const styles = params.cssDependencies;
        if (styles && styles.length > 0) {
            styles.forEach((path: any) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = path;
                document.querySelector('head').appendChild(link);
            });
        }

        const scripts = params.scriptsDependencies;
        if (scripts && scripts.length > 0) {
            scripts.forEach((path: any) => {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = path;
                document.querySelector('head').appendChild(script);
            });
        }
    }

    /* GEOJson */
    public loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any) {
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
                            const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                            eventClick(param);
                        });
                    }
                });
            }
        }
    }

    /* Markers */
    public drawMarker(options: MarkerOptions, eventClick: any) {
        let newOptions: any = {
            draggable: options.draggable
        };

        if (options.icon) {
            newOptions.icon = new this.leaflet.Icon({
                iconSize: options.icon.size,
                iconUrl: options.icon.url
            });
        }

        const marker = new this.leaflet.Marker(options.latlng, newOptions);

        if (options.object) {
            marker.object = options.object;
        }

        if (eventClick) {
            marker.on('click', (event: any) => {
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, options.object);
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

    public drawCircleMarker(options: CircleMarkerOptions, eventClick: any) {
        const self = this;
        const marker = new this.leaflet.circleMarker(options.latlng, options.style);

        if (eventClick) {
            marker.on('click', (event: any) => {
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param);
            }, options.object);
        }

        if (options.addToMap) {
            marker.addTo(self.map);
        }

        if (options.fitBounds) {
            const group = new this.leaflet.FeatureGroup([marker]);
            self.map.fitBounds(group.getBounds());
        }

        marker.object = options.object;
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
                    fillColor: options.style.fillColor ? options.style.fillColor : marker.options.fillColor,
                    fillOpacity: options.style.fillOpacity ? options.style.fillOpacity : marker.options.fillOpacity,
                    radius: options.style.radius ? options.style.radius : marker.options.radius,
                    strokeColor: options.style.color ? options.style.color : marker.options.strokeColor,
                    strokeWeight: options.style.weight ? options.style.weight : marker.options.strokeWeight
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

    public alterMarkerPosition(markers: any[], position: number[], addTransition: boolean) {
        markers.forEach((marker) => {
            if (addTransition) {
                this.moveTransitionMarker(position, marker);
            } else {
                marker.setLatLng(position);
            }
        });
    }

    public setCenterMarker(marker: any) {
        this.map.panTo(marker.getLatLng());
    }

    public isMarkerOnMap(marker: any): boolean {
        return this.map.hasLayer(marker);
    }

    public addPolylineListeners(polylines: any, event: EventType, eventFunction: any) {
        polylines.forEach(polyline => {
            switch (event) {
                case EventType.Move:
                    polyline.on('editable:vertex:dragstart', (event: any) => {
                        console.log(event)
                        const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                        eventFunction(param);
                    });
                    break;
                case EventType.InsertAt:
                    polyline.on('editable:vertex:dragend', (event: any) => {
                        const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                        eventFunction(param);
                    });
                    break;
                case EventType.RemoveAt:
                    polyline.on('editable:vertex:deleted', (event: any) => {
                        const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                        eventFunction(param);
                    });
                    break;
                default:
                    break;
            }
        })
    }

    public addMarkerEvent(markers: any, event: MarkerEventType, eventFunction: any) {
        markers.forEach((marker: any) => {
            switch (event) {
                case MarkerEventType.Click:
                    marker.on('click', (event: any) => {
                        const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.AfterDrag:
                    marker.on('dragend', (event: any) => {
                        const param = new EventReturn([event.target.getLatLng().lat, event.target.getLatLng().lng]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.MouseOver:
                    marker.on('mouseover', (event: any) => {
                        const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                        eventFunction(marker, param, marker.object);
                    });
                    break;
                default:
                    break;
            }
        });
    }

    /* Polygons */
    public drawPolygon(options: PolygonOptions, eventClick: any) {
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
            polygon.on('click', (event: any) => {
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, options.object);
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
    }

    public fitBoundsPolygons(polygons) {
        const self = this;
        self.map.fitBounds(self.getBoundsPolygons(polygons));
    }

    private getBoundsPolygons(polygons) {
        const group = new this.leaflet.FeatureGroup(polygons);
        return group.getBounds();
    }

    public togglePolygons(polygons: any[], show: boolean) {
        const self = this;
        polygons.forEach((polygon) => show ? self.map.addLayer(polygon) : self.map.removeLayer(polygon));
    }

    public alterPolygonOptions(polygons: any[], options: PolygonAlterOptions) {
        polygons.forEach((polygon) => {
            const style = {
                color: options.color ? options.color : polygon.options.color,
                fillColor: options.fillColor ? options.fillColor : polygon.options.fillColor,
                fillOpacity: options.fillOpacity ? options.fillOpacity : polygon.options.fillOpacity,
                opacity: options.opacity ? options.opacity : polygon.options.opacity,
                weight: options.weight ? options.weight : polygon.options.weight
            };

            polygon.setStyle(style);
        });
    }

    public isPolygonOnMap(polygon: any): boolean {
        return this.map.hasLayer(polygon);
    }

    /* Circles */
    public drawCircle(options: CircleOptions, eventClick: any) {
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
            circle.on('click', (event: any) => {
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, options.object);
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
                color: options.color ? options.color : circle.options.color,
                fillColor: options.fillColor ? options.fillColor : circle.options.fillColor,
                fillOpacity: options.fillOpacity ? options.fillOpacity : circle.options.fillOpacity,
                opacity: options.opacity ? options.opacity : circle.options.opacity,
                weight: options.weight ? options.weight : circle.options.weight
            };

            circle.setStyle(style);

            if (options.radius) {
                circle.setRadius(options.radius);
            }

            if (options.center) {
                circle.setLatLng(options.center);
            }
        });
    }

    public addCircleEvent(circles: any, event: CircleEventType, eventFunction: any): void {
        circles.forEach((circle: any) => {
            switch (event) {
                case CircleEventType.Click:
                    circle.on('click', (event: any) => {
                        const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                        eventFunction(param, circle.object);
                    });
                case CircleEventType.CenterChanged:
                    circle.on('dragend', (event: any) => {
                        const param = new EventReturn([event.target.getLatLng().lat, event.target.getLatLng().lng]);
                        eventFunction(param, circle.object);
                    });
                case CircleEventType.RadiusChanged:
                    circle.on('editable:vertex:dragend', (event: any) => {
                        const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                        eventFunction(param, circle.object, circle.getRadius());
                    });
                default:
                    break;
            }
        });
    }

    public removeCircleEvent(circles: any, event: CircleEventType): void {
        circles.forEach((circle: any) => {
            switch (event) {
                case CircleEventType.Click:
                    circle.off('click');
                case CircleEventType.CenterChanged:
                    circle.off('dragend');
                case CircleEventType.RadiusChanged:
                    circle.off('editable:vertex:dragend');
                default:
                    break;
            }
        });
    }

    public isCircleOnMap(circle: any): boolean {
        return this.map.hasLayer(circle);
    }

    public fitBoundsCircles(circles: any) {
        this.map.fitBounds(this.getBoundsCircles(circles));
    }

    private getBoundsCircles(circles: any) {
        const group = new this.leaflet.FeatureGroup(circles);
        return group.getBounds();
    }

    public getCircleCenter(circle: any): number[] {
        const center = circle.getLatLng();

        return [center.lat, center.lng];
    }

    /* Polylines */
    public drawPolyline(options: PolylineOptions, eventClick: any) {
        const self = this;

        let newOptions = {
            color: options.color || '#000000',
            draggable: options.draggable,
            editable: options.editable,
            infowindows: options.infowindows,
            weight: options.weight || 3,
            opacity: null,
            dashArray: null
        };

        if (options.style !== null) {
            switch (options.style) {
                case PolylineType.Dotted:
                    newOptions.opacity = .7;
                    newOptions.dashArray = '20,15';
                    break;
                default:
                    break;
            }
        }

        const polyline = new this.leaflet.Polyline(options.path || [], newOptions);

        if (eventClick) {
            polyline.on('click', (event: any) => {
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, options.object);
            });
        }

        if (options.addToMap) {
            polyline.addTo(self.map);
            if (options.editable) {
                polyline.enableEdit();
            }
        }

        if (options.style && options.style === PolylineType.Arrow) {
            const pathOptions = { fillOpacity: 1, weight: 0, color: polyline.options.color };

            self.leaflet.polylineDecorator(polyline, {
                patterns: [{
                    offset: '20%',
                    repeat: '90px',
                    symbol: self.leaflet.Symbol.arrowHead({ pixelSize: 20, pathOptions: pathOptions })
                },
                { offset: '0%', symbol: self.leaflet.Symbol.arrowHead({ pixelSize: 20, pathOptions: pathOptions }) },
                { offset: '100%', symbol: self.leaflet.Symbol.arrowHead({ pixelSize: 20, pathOptions: pathOptions }) }]
            }).addTo(self.map);
        }

        if (options.object) {
            polyline.object = options.object;
        }

        if (options.fitBounds) {
            self.map.fitBounds(polyline.getBounds());
        }

        return polyline;
    }

    public togglePolylines(polylines: any, show: boolean) {
        const self = this;
        polylines.forEach((polyline: any) => {
            if (show) {
                self.map.addLayer(polyline);
            } else {
                self.map.removeLayer(polyline);
            }
        });
    }

    public drawPolylineWithNavigation(options: PolylineOptions) {
        const polyline = this.drawPolyline(options, null);

        this.addNavigation(polyline, options.navigateOptions);
        return polyline;
    }

    public clearListenersPolyline(polylines: any) {
        polylines.forEach((polyline: any) => polyline.clearAllEventListeners());
    }

    public addPolylinePath(polylines: any, position: number[]) {
        polylines.forEach((polyline: any) => {
            const path = polyline.getLatLngs();

            path.push(new this.leaflet.LatLng(position[0], position[1]));
            polyline.setLatLngs(path);
        });
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

    public alterPolylineOptions(polylines: any, options: PolylineOptions) {
        polylines.forEach((polyline: any) => {
            const style = {
                color: options.color ? options.color : polyline.options.color,
                draggable: options.draggable ? options.draggable : polyline.options.draggable,
                weight: options.weight ? options.weight : polyline.options.weight
            };

            polyline.setStyle(style);

            if (options.object) {
                polyline.object = options.object;
            }

            if (options.editable) {
                polyline.enableEdit();
            }
        });
    }

    public fitBoundsPolylines(polylines: any) {
        const self = this;
        self.map.fitBounds(self.getBoundsPolylines(polylines));
    }

    private getBoundsPolylines(polylines: any) {
        const group = new this.leaflet.FeatureGroup(polylines);
        return group.getBounds();
    }

    public isPolylineOnMap(polyline: any): boolean {
        return this.map.hasLayer(polyline);
    }

    /* Popups */
    public drawPopup(options: PopupOptions, marker?: any) {
        const self = this;
        let popup = null;

        if (!marker) {
            popup = new this.leaflet.Popup();
            popup.setLatLng(options.latlng);
            popup.setContent(options.content);
            popup.openOn(self.map);

        } else {
            popup = self.drawPopupOnMarker(marker, options);
        }

        return popup;
    }

    private drawPopupOnMarker(marker: any, options: PopupOptions) {
        marker.bindPopup(options.content);
        let popup = marker.getPopup();

        marker.openPopup();
        popup.marker = options.marker;

        return popup;
    }

    public alterPopup(popup: any, options: PopupOptions, marker?: any) {
        const self = this;

        if (popup.marker === options.marker) {
            if (options.content) {
                popup.setContent(options.content);
            }

            if (options.latlng) {
                popup.setLatLng(options.latlng);
            }

            if (!popup.isOpen() && !popup.marker) {
                popup.openOn(self.map);
            }
        } else {
            self.drawPopupOnMarker(marker, options);
        }
    }

    public closePopup(popup: any) {
        popup.remove();
    }

    /* Map */
    public addEventMap(eventType: EventType, eventFunction: any) {
        const self = this;

        switch (eventType) {
            case EventType.Click:
                self.map.on('click', (event: any) => {
                    const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                    eventFunction(param);
                });
                break;
            case EventType.ZoomChanged:
                self.map.on('zoomend', (event: any) => {
                    const param = new EventReturn([event.target.getCenter().lat, event.target.getCenter().lng]);
                    eventFunction(param);
                });
            default:
                break;
        }
    }

    public removeEventMap(eventType: EventType) {
        const self = this;
        switch (eventType) {
            case EventType.Click: self.map.off('click'); break;
            case EventType.ZoomChanged: self.map.off('zoomend');
            default: break;
        }
    }

    public getZoom(): number {
        return this.map.getZoom();
    }

    public setZoom(zoom: number) {
        this.map.setZoom(zoom);
    }

    public getCenter(): number[] {
        return this.map.getCenter();
    }

    public setCenter(position: number[]) {
        this.map.panTo(position);
    }

    public resizeMap(): void {
        this.map.invalidateSize();
    }

    public pixelsToLatLng(offsetx: number, offsety: number) {
        var scale = Math.pow(2, this.map.getZoom());
        var worldCoordinateCenter = this.map.project(this.map.getCenter());
        var pixelOffset = new this.leaflet.Point(offsetx / scale || 0, offsety / scale || 0);

        var worldCoordinateNewCenter = new this.leaflet.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        const latlng = this.map.unproject(worldCoordinateNewCenter);
        return latlng;
    }

    /* Overlay */
    public drawOverlay(options: OverlayOptions, polygons: any) {
        const html: string = options.divElement.outerHTML;
        const myIcon = new this.leaflet.DivIcon({ html: html });

        const position = polygons && polygons.length > 0 ?
            this.getBoundsPolygons(polygons).getCenter() : options.position;

        const overlay = new this.leaflet.Marker(position, { icon: myIcon });

        if (options.addToMap) {
            overlay.addTo(this.map);
        }

        overlay.object = options.object;
        return overlay;
    }

    public toggleOverlay(overlays: any[], show: boolean) {
        const self = this;
        overlays.forEach((overlay) => show ? self.map.addLayer(overlay) : self.map.removeLayer(overlay));
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

    private moveTransitionMarker(position: any, marker: any) {
        const numDeltas = 5;
        const referencia = {
            position: [marker.getLatLng().lat, marker.getLatLng().lng],
            i: 0,
            deltaLat: (position[0] - marker.getLatLng().lat) / numDeltas,
            deltaLng: (position[1] - marker.getLatLng().lng) / numDeltas
        }

        this.moveMarker(marker, referencia, numDeltas);
    }

    private moveMarker(marker: any, referencia: any, numDeltas: number) {
        referencia.position[0] += referencia.deltaLat;
        referencia.position[1] += referencia.deltaLng;
        marker.setLatLng(referencia.position);
        if (referencia.i <= numDeltas) {
            referencia.i++;
            setTimeout(() => this.moveMarker(marker, referencia, numDeltas), 20);
        }
    }
}

import { OverlayOptions } from '../..';
import { MapsApiLoaderService } from '../../utils/maps-api-loader.service';
import { MapEventType, MarkerEventType, CircleEventType, PolygonEventType, PolylineEventType } from '../dto/event-type';
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
import MarkerClustererConfig from '../features/marker-clusterer/marker-clusterer-config';

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
    private navigateByPoint: boolean;
    private navigationOptions: NavigationOptions;

    constructor() { /* */ }

    public async initialize(mapType: MapType, params: any, elementId: string): Promise<any> {
        try {
            const api = await this.mapsApiLoader.loadApi(mapType, params);
            this.leaflet = api;
            this.loadDependencies(params);
            await this.mapTimeout(200);
            const mapOptions: any = {
                center: new this.leaflet.LatLng(-14, -54),
                editable: true,
                maxZoom: 19,
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
        } catch (err) {
            return err;
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
        const newOptions: any = {
            draggable: options.draggable
        };

        if (options.icon) {
            newOptions.icon = new this.leaflet.Icon({
                iconUrl: options.icon.url
            });

            const size = options.icon.size;
            if (size) {
                newOptions.icon.options.iconSize = size;
                newOptions.icon.options.iconAnchor = [size[0] / 2, size[1]];
                newOptions.icon.options.popupAnchor = [0, -size[1]];
            }
        }

        const marker = new this.leaflet.Marker(options.latlng, newOptions);

        if (options.object) {
            marker.object = options.object;
        }

        if (eventClick) {
            marker.on('click', (event: any) => {
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, event.target.object);
            });
        }

        if (options.addToMap && !options.addClusterer) {
            marker.addTo(this.map);
        }

        if (options.fitBounds) {
            const group = new this.leaflet.FeatureGroup([marker]);
            this.map.fitBounds(group.getBounds());
        }

        return marker;
    }

    public drawCircleMarker(options: CircleMarkerOptions, eventClick: any) {
        const self = this;
        const marker = new this.leaflet.circleMarker(options.latlng, options.style);

        if (eventClick) {
            marker.on('click', (event: any) => {
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, event.target.object);
            });
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

    public toggleMarkers(markers: any[], show: boolean, markerClusterer?: any) {
        const self = this;
        markers.forEach((marker) => {
            if (markerClusterer) {
                if (show) {
                    self.addMarkerOnClusterer(marker, markerClusterer);
                } else {
                    self.removeMarkerFromClusterer(marker, markerClusterer);
                }
            } else {
                if (show) {
                    self.map.addLayer(marker);
                } else {
                    self.map.removeLayer(marker);
                }
            }
        });
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

    public fitBoundsPositions(markers: any[]) {
        const group = new this.leaflet.featureGroup(markers);
        this.map.fitBounds(group.getBounds());
    }

    public isMarkerOnMap(marker: any): boolean {
        return this.map.hasLayer(marker);
    }

    public setCenterMarker(marker: any) {
        this.map.panTo(marker.getLatLng());
    }

    public addMarkerEvent(markers: any, eventType: MarkerEventType, eventFunction: any) {
        markers.forEach((marker: any) => {
            switch (eventType) {
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
                case MarkerEventType.MouseOut:
                    marker.on('mouseout', (event: any) => {
                        const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                        eventFunction(marker, param, marker.object);
                    });
                    break;
                default:
                    break;
            }
        });
    }

    public removeMarkerEvent(markers: any, event: MarkerEventType): void {
        markers.forEach((marker: any) => {
            switch (event) {
                case MarkerEventType.Click:
                    marker.off('click');
                    break;
                case MarkerEventType.AfterDrag:
                    marker.off('dragend');
                    break;
                case MarkerEventType.MouseOver:
                    marker.off('mouseover');
                    break;
                default:
                    break;
            }
        });
    }

    /* Marker Clusterer */
    public addMarkerClusterer(config: MarkerClustererConfig): any {
        const layer = this.leaflet.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: config.clusterZoomOnClick,
            maxClusterRadius: 50
        });

        this.map.addLayer(layer);
        return layer;
    }

    public alterMarkerClustererConfig(markerClusterer: any, config: MarkerClustererConfig): void {
        markerClusterer.options.zoomToBoundsOnClick = config.clusterZoomOnClick;
    }

    public refreshClusterer(markerClusterer: any): void {
        markerClusterer.refreshClusters();
    }

    public addMarkerOnClusterer(marker: any, markerClusterer: any): void {
        markerClusterer.addLayer(marker);
    }

    public removeMarkerFromClusterer(marker: any, markerClusterer: any): void {
        markerClusterer.removeLayer(marker);
    }

    public clearMarkersClusterer(markerClusterer: any): void {
        markerClusterer.clearLayers();
    }

    public countMarkersOnCluster(markerClusterer: any): number {
        return markerClusterer.getLayers().length;
    }

    /* Polygons */
    public drawPolygon(options: PolygonOptions, eventClick: any) {
        const self = this;
        const newOptions = {
            color: options.color || '#000',
            draggable: options.draggable,
            fillColor: options.fillColor || '#fff',
            fillOpacity: options.fillOpacity || 1,
            opacity: options.opacity || 1,
            weight: options.weight || 2
        };
        const polygon = new this.leaflet.Polygon(options.path, newOptions);

        if (eventClick) {
            polygon.on('click', (event: any) => {
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, event.target.object);
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

    public fitBoundsPolygons(polygons: any): void {
        this.map.fitBounds(this.getBoundsPolygons(polygons));
    }

    public setCenterPolygons(polygons: any): void {
        this.map.panTo(this.getBoundsPolygons(polygons).getCenter());
    }

    public isPolygonOnMap(polygon: any): boolean {
        return this.map.hasLayer(polygon);
    }

    public addPolygonEvent(polygons: any, eventType: PolygonEventType, eventFunction: any): void {
        polygons.forEach((polygon: any) => {
            switch (eventType) {
                case PolygonEventType.Move:
                    polygon.on('dragend', (event: any) => {
                        const param = new EventReturn([event.target.getCenter().lat, event.target.getCenter().lng]);
                        eventFunction(param, event.target.getLatLngs()[0].map((x: any) => [x.lat, x.lng]));
                    });
                    break;
                case PolygonEventType.InsertAt:
                    polygon.on('editable:vertex:dragend', (event: any) => {
                        const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                        eventFunction(param, event.vertex.latlngs.map((x: any) => [x.lat, x.lng]));
                    });
                    break;
            }
        });
    }

    public removePolygonEvent(polygons: any, event: PolygonEventType): void {
        polygons.forEach((polygon: any) => {
            switch (event) {
                case PolygonEventType.Move:
                    polygon.off('editable:vertex:dragstart');
                    break;
                case PolygonEventType.InsertAt:
                    polygon.off('editable:vertex:dragend');
                    break;
            }
        });
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

    public fitBoundsCircles(circles: any) {
        this.map.fitBounds(this.getBoundsCircles(circles));
    }

    public isCircleOnMap(circle: any): boolean {
        return this.map.hasLayer(circle);
    }

    public getCircleCenter(circle: any): number[] {
        const center = circle.getLatLng();

        return [center.lat, center.lng];
    }

    public addCircleEvent(circles: any, eventType: CircleEventType, eventFunction: any): void {
        circles.forEach((circle: any) => {
            switch (eventType) {
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

    /* Polylines */
    public drawPolyline(options: PolylineOptions, eventClick: any) {
        const self = this;
        const newOptions = {
            color: options.color || '#000000',
            draggable: options.draggable,
            editable: options.editable,
            infowindows: options.infowindows,
            weight: options.weight || 3,
            opacity: options.opacity || 1,
            zIndex: options.zIndex,
            dashArray: null
        };

        if (options.style !== null) {
            switch (options.style) {
                case PolylineType.Dotted:
                    console.warn('PolylineType.Dotted is deprecated, instead use PolylineType.Dashed.');
                case PolylineType.Dashed:
                    newOptions.opacity = .7;
                    newOptions.dashArray = '20,15';
                    break;
                default:
                    break;
            }
        }

        const polyline = new this.leaflet.Polyline(options.path || [], newOptions);
        polyline.on('editable:vertex:rawclick', (e) => e.cancel() );

        if (eventClick) {
            polyline.on('click', (event: any) => {
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, event.target.object);
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

            polyline.decorator = self.leaflet.polylineDecorator(polyline, {
                patterns: [{
                    offset: '20%',
                    repeat: '90px',
                    symbol: self.leaflet.Symbol.arrowHead({ pixelSize: 20, pathOptions })
                },
                { offset: '0%', symbol: self.leaflet.Symbol.arrowHead({ pathOptions, pixelSize: 20 }) },
                { offset: '100%', symbol: self.leaflet.Symbol.arrowHead({ pixelSize: 20, pathOptions }) }]
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

    public drawPolylineWithNavigation(options: PolylineOptions, eventClick?: any) {
        const polyline = this.drawPolyline(options, null);

        this.navigationOptions = options.navigateOptions;
        this.addNavigation(polyline);
        polyline.navigationHandlerClick = eventClick;
        return polyline;
    }

    public togglePolylines(polylines: any, show: boolean) {
        const self = this;
        polylines.forEach((polyline: any) => {
            if (show) {
                self.map.addLayer(polyline);
                if (polyline.decorator) { self.map.addLayer(polyline.decorator); }
            } else {
                self.map.removeLayer(polyline);
                if (polyline.decorator) { self.map.removeLayer(polyline.decorator); }
            }
        });
    }

    public alterPolylineOptions(polylines: any, options: PolylineOptions) {
        const self = this;

        polylines.forEach((polyline: any) => {
            const style: any = {
                color: options.color ? options.color : polyline.options.color,
                draggable: options.draggable ? options.draggable : polyline.options.draggable,
                weight: options.weight ? options.weight : polyline.options.weight,
                opacity: options.opacity ? options.opacity : polyline.options.opacity,
                zIndex: options.zIndex ? options.zIndex : polyline.options.zIndex
            };

            switch (options.style) {
                case PolylineType.Dotted:
                    console.warn('PolylineType.Dotted is deprecated, instead use PolylineType.Dashed.');
                case PolylineType.Dashed:
                    style.dashArray = '20,15';
                    break;
                case PolylineType.Arrow:
                    const pathOptions = { fillOpacity: 1, weight: 0, color: polyline.options.color };

                    polyline.decorator = self.leaflet.polylineDecorator(polyline, {
                        patterns: [{
                            offset: '20%',
                            repeat: '90px',
                            symbol: self.leaflet.Symbol.arrowHead({ pixelSize: 20, pathOptions })
                        },
                        { offset: '0%', symbol: self.leaflet.Symbol.arrowHead({ pixelSize: 20, pathOptions }) },
                        { offset: '100%', symbol: self.leaflet.Symbol.arrowHead({ pixelSize: 20, pathOptions }) }]
                    }).addTo(self.map);
                    break;
                default:
                    if (polyline.decorator) {
                        self.map.removeLayer(polyline.decorator);
                        polyline.decorator = null;
                    }
                    break;
            }

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

    public isPolylineOnMap(polyline: any): boolean {
        return this.map.hasLayer(polyline);
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
            this.map.removeLayer(self.selectedPath);
            self.selectedPath = null;
        }
        if (self.navigateInfoWindow) {
            self.navigateInfoWindow.remove();
        }

        document.onkeyup = null;
    }

    public addPolylineEvent(polylines: any, eventType: PolylineEventType, eventFunction: any) {
        polylines.forEach((polyline: any) => {
            switch (eventType) {
                case PolylineEventType.Move:
                    polyline.on('editable:vertex:dragend', (event: any) => {
                        const newPosition = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                        const lastPosition = new EventReturn([event.vertex.latlngs[0].lat, event.vertex.latlngs[0].lng]);
                        eventFunction(newPosition, lastPosition);
                    });
                    break;
                case PolylineEventType.InsertAt:
                    polyline.on('editable:vertex:new', () => {
                        polyline.on('editable:vertex:dragend', (event: any) => {
                            const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                            eventFunction(param);
                        });
                    });
                    break;
                case PolylineEventType.RemoveAt:
                    polyline.on('editable:vertex:deleted', (event: any) => {
                        const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                        eventFunction(param);
                    });
                    break;
                default:
                    break;
            }
        });
    }

    public removePolylineEvent(polylines: any, event: PolylineEventType) {
        polylines.forEach((polyline: any) => {
            switch (event) {
                case PolylineEventType.Move:
                    polyline.off('editable:vertex:dragstart');
                    break;
                case PolylineEventType.InsertAt:
                    polyline.off('editable:vertex:dragend');
                    break;
                case PolylineEventType.RemoveAt:
                    polyline.off('editable:vertex:deleted');
                    break;
                default:
                    break;
            }
        });
    }

    public setIndexPolylineHighlight(polyline: any, index: number) {
        polyline.initialIdx = index;
        polyline.finalIdx = index + 1;

        this.moveSelectedPath(polyline, this.navigationOptions);
        this.selectedPolyline = polyline;

        document.onkeyup = this.onKeyUp.bind(this);
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

        if (options.object) {
            popup.object = options.object;
        }
        return popup;
    }

    public alterPopup(popup: any, options: PopupOptions, marker?: any) {
        const self = this;

        if (marker && !marker.getPopup()) {
            popup = self.drawPopup(options, marker);
        } else {
            self.alterPopupContent(popup, options, marker);

            if (!popup.isOpen()) {
                if (!marker) {
                    popup.openOn(self.map);
                } else if (options.notCalledByMap) {
                    marker.openPopup();
                }
            }
        }

        if (options.object) {
            popup.object = options.object;
        }

        return popup;
    }

    public alterPopupContent(popup: any, options: PopupOptions, marker?: any) {
        if (marker) {
            popup = marker._popup;
        }

        if (popup) {
            if (options.content) {
                popup.setContent(options.content);
            }

            if (options.latlng) {
                popup.setLatLng(options.latlng);
            }
        }

        if (options.object) {
            popup.object = options.object;
        }
    }

    public closePopup(popup: any) {
        popup.remove();
    }

    /* Map */
    public resizeMap(): void {
        this.map.invalidateSize();
    }

    public addEventMap(eventType: MapEventType, eventFunction: any) {
        const self = this;

        switch (eventType) {
            case MapEventType.Click:
                self.map.on('click', (event: any) => {
                    const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                    eventFunction(param);
                });
                break;
            case MapEventType.ZoomChanged:
                self.map.on('zoomend', (event: any) => {
                    const param = new EventReturn([event.target.getCenter().lat, event.target.getCenter().lng]);
                    eventFunction(param);
                });
            default:
                break;
        }
    }

    public removeEventMap(eventType: MapEventType) {
        const self = this;
        switch (eventType) {
            case MapEventType.Click: self.map.off('click'); break;
            case MapEventType.ZoomChanged: self.map.off('zoomend');
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

    public pixelsToLatLng(offsetx: number, offsety: number) {
        const scale = Math.pow(2, this.map.getZoom());
        const worldCoordinateCenter = this.map.project(this.map.getCenter());
        const pixelOffset = new this.leaflet.Point(offsetx / scale || 0, offsety / scale || 0);

        const worldCoordinateNewCenter = new this.leaflet.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        const latlng = this.map.unproject(worldCoordinateNewCenter);
        return [latlng.lat, latlng.lng];
    }

    /* Overlay */
    public drawOverlay(options: OverlayOptions, polygons: any) {
        const html: string = options.divElement.outerHTML;
        const myIcon = new this.leaflet.DivIcon({ html });

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
    private mapTimeout(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
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

    private addNavigation(polyline: any) {
        polyline.clearAllEventListeners();
        polyline.on('click', this.onClickPolyline.bind(this, polyline));
    }

    private onClickPolyline(polyline: any, event: any) {
        const index = this.checkIdx(polyline, event.latlng);

        polyline.initialIdx = index;
        polyline.finalIdx = index + 1;

        this.navigateByPoint = this.navigationOptions.navigateByPoint;
        this.moveSelectedPath(polyline, this.navigationOptions);
        this.selectedPolyline = polyline;

        document.onkeyup = this.onKeyUp.bind(this);

        if (polyline.navigationHandlerClick) {
            polyline.navigationHandlerClick();
        }
    }

    private onKeyUp(event: any) {
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

        if ((!this.navigateByPoint || this.directionForward) && polyline.finalIdx < polyline.getLatLngs().length - 1) {
            this.navigateFoward(multiselection, polyline);
        }
        this.directionForward = true;
        this.moveSelectedPath(polyline, null);
    }

    private navigateFoward(multiSelection: boolean, polyline: any) {
        if (!multiSelection) {
            polyline.finalIdx++;
            polyline.initialIdx = this.multiSelection ? polyline.finalIdx - 1 : polyline.initialIdx + 1;
            this.multiSelection = false;
        } else {
            this.multiSelection = true;
            if (this.multiSelectionForward) {
                polyline.finalIdx++;
            }
            this.multiSelectionForward = true;
        }
    }

    private moveBackwards(multiSelection: boolean) {
        const polyline = this.selectedPolyline;

        if ((!this.navigateByPoint || !this.directionForward) && polyline.initialIdx > 0) {
            this.navigateBackward(multiSelection, polyline);
        }
        this.directionForward = false;
        this.moveSelectedPath(polyline, null);
    }

    private navigateBackward(multiSelection: boolean, polyline: any) {
        const self = this;
        if (!multiSelection) {
            polyline.initialIdx--;
            polyline.finalIdx = !self.multiSelection ? polyline.finalIdx - 1 : polyline.initialIdx + 1;
            self.multiSelection = false;
        } else {
            self.multiSelection = true;
            if (!self.multiSelectionForward) {
                polyline.initialIdx--;
            }
            self.multiSelectionForward = false;
        }
    }

    private moveSelectedPath(polyline: any, options: NavigationOptions) {
        const self = this;
        const pathSelected = polyline.getLatLngs().slice(polyline.initialIdx, polyline.finalIdx + 1);

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

        let idx = self.directionForward ? polyline.finalIdx : polyline.initialIdx;

        if (!this.navigateByPoint) {
            idx = polyline.finalIdx > polyline.initialIdx ? polyline.finalIdx : polyline.initialIdx;
        }
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

    private checkIdx(polyline: any, point: any) {
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

    private distanceToLine(pt1: any, pt2: any, pt: any) {
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

    private kmTo(pt1: any, pt2: any) {
        const e = Math;
        const ra = e.PI / 180;
        const b = pt1.lat * ra;
        const c = pt2.lat * ra;
        const d = b - c;
        const g = pt1.lng * ra - pt2.lng * ra;
        const f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));

        return f * 6378.137 * 1000;
    }

    private parseGeoJson(data: any, options: GeoJsonOptions) {
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

    private parseGeoJsonToObject(data: any, objectOptions: any) {
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

    private moveTransitionMarker(position: any, marker: any) {
        const numDeltas = 5;
        const referencia = {
            position: [marker.getLatLng().lat, marker.getLatLng().lng],
            i: 0,
            deltaLat: (position[0] - marker.getLatLng().lat) / numDeltas,
            deltaLng: (position[1] - marker.getLatLng().lng) / numDeltas
        };

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

    // --------------- HELPER FUNCTIONS
    private getBoundsPolygons(polygons) {
        const group = new this.leaflet.FeatureGroup(polygons);
        return group.getBounds();
    }

    private getBoundsCircles(circles: any) {
        const group = new this.leaflet.FeatureGroup(circles);
        return group.getBounds();
    }

    private getBoundsPolylines(polylines: any) {
        const group = new this.leaflet.FeatureGroup(polylines);
        return group.getBounds();
    }

    private drawPopupOnMarker(marker: any, options: PopupOptions) {
        marker.bindPopup(options.content);
        const popup = marker.getPopup();

        marker.openPopup();
        return popup;
    }
}

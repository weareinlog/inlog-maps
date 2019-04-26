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
import OverlayOptions from '../features/overlay/overlay-options';
import PolygonAlterOptions from '../features/polygons/polygon-alter-options';
import PolygonOptions from '../features/polygons/polygon-options';
import NavigationOptions from '../features/polyline/navigations-options';
import PolylineOptions from '../features/polyline/polyline-options';
import PopupOptions from '../features/popup/popup-options';
import IMapFunctions from './mapFunctions';

export default class GoogleMaps implements IMapFunctions {
    private map = null;
    private google = null;
    private mapsApiLoader: MapsApiLoaderService = new MapsApiLoaderService();
    private selectedPolyline = null;
    private selectedPath = null;
    private navigateInfoWindow = null;
    private directionForward = false;
    private multiSelectionForward = false;
    private multiSelection = false;
    private OverlayGoogle = null;

    constructor() { /* */ }

    public initialize(mapType: MapType, params: any, elementId: string): Promise<any> {
        return this.mapsApiLoader.loadApi(mapType, params)
            .then((api) => {
                this.google = api;

                let options: any = {
                    center: new this.google.maps.LatLng(-14, -54),
                    fullscreenControl: false,
                    keyboardShortcuts: false,
                    mapTypeControl: true,
                    minZoom: 4,
                    rotateControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    zoom: 4,
                    zoomControl: true
                };

                if (params.gestureHandling) {
                    options.gestureHandling = 'cooperative';
                }

                this.map = new this.google.maps.Map(document.getElementById(elementId || 'inlog-map'), options);

                OverlayGoogle.prototype = new this.google.maps.OverlayView();

                function OverlayGoogle(bounds, div, map) {
                    this.bounds_ = bounds;
                    this.div_ = div;
                    this.setMap(map);
                }

                OverlayGoogle.prototype.onAdd = function () {
                    const panes = this.getPanes();
                    panes.overlayLayer.appendChild(this.div_);
                    panes.overlayMouseTarget.appendChild(this.div_);

                    google.maps.event.addDomListener(this.div_, 'click', function () {
                        google.maps.event.trigger(this.div_, 'click');
                    });
                };

                OverlayGoogle.prototype.draw = function () {
                    const overlayProjection = this.getProjection();
                    const center = overlayProjection.fromLatLngToDivPixel(this.bounds_.getCenter());
                    const div = this.div_;

                    div.style.left = center.x + 'px';
                    div.style.top = center.y + 'px';
                };

                OverlayGoogle.prototype.onRemove = function () {
                    this.div_.parentNode.removeChild(this.div_);
                };

                this.OverlayGoogle = OverlayGoogle;
                return this;
            })
            .catch((err) => err);
    }

    /* GEOJson */
    public loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any) {
        const self = this;
        const objects = self.parseGeoJson(data, options);

        objects.forEach((elem) => {
            if (eventClick) {
                elem.addListener('click', (event: any) => {
                    const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                    eventClick(param);
                });
            }
            elem.setMap(self.map);
        });
    }

    /* Markers */
    public drawMarker(options: MarkerOptions, eventClick: any) {
        const newOptions = {
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
        const marker = new this.google.maps.Marker(newOptions);

        if (eventClick) {
            this.google.maps.event.addListener(marker, 'click', (event: any) => {
                const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);

                eventClick(param, options.object);
            });
        }

        if (options.addToMap) {
            marker.setMap(this.map);
        }

        if (options.fitBounds) {
            const bounds = new this.google.maps.LatLngBounds();

            bounds.extend(marker.getPosition());
            this.map.fitBounds(bounds);
        }

        return marker;
    }

    public fitBoundsPositions(markers: any[]) {
        const bounds = new this.google.maps.LatLngBounds();
        markers.map((marker) => marker.position).forEach((position) => bounds.extend(position));
        this.map.fitBounds(bounds);
    }

    public drawCircleMarker(options: CircleMarkerOptions, eventClick: any) {
        const self = this;
        const newOptions = {
            icon: {
                fillColor: options.style.fillColor,
                fillOpacity: options.style.fillOpacity,
                path: this.google.maps.SymbolPath.CIRCLE,
                scale: options.style.radius,
                strokeColor: options.style.color,
                strokeWeight: options.style.weight
            },
            object: options.object,
            position: {
                lat: options.latlng[0],
                lng: options.latlng[1]
            }
        };

        const marker = new this.google.maps.Marker(newOptions);

        if (eventClick) {
            this.google.maps.event.addListener(marker, 'click', (event: any) => {
                const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                eventClick(param, options.object);
            });
        }

        if (options.addToMap) {
            marker.setMap(self.map);
        }

        if (options.fitBounds) {
            const bounds = new this.google.maps.LatLngBounds();
            bounds.extend(marker.getPosition());
            self.map.fitBounds(bounds);
        }

        return marker;
    }

    public toggleMarkers(markers: any[], show: boolean) {
        const self = this;
        markers.forEach((marker) => marker.setMap(show ? self.map : null));
    }

    public alterMarkerOptions(markers: any[], options: MarkerAlterOptions) {
        let icon = null;
        let position = null;

        if (options.latlng) {
            position = {
                lat: options.latlng[0],
                lng: options.latlng[1]
            };
        }

        if (options.icon) {
            icon = options.icon;
        }

        markers.forEach((marker) => {
            if (options.style) {
                icon = {
                    fillColor: options.style.fillColor !== null && options.style.fillColor !== undefined ?
                        options.style.fillColor : marker.icon.fillColor,
                    fillOpacity: options.style.fillOpacity !== null && options.style.fillOpacity !== undefined ?
                        options.style.fillOpacity : marker.icon.fillOpacity,
                    path: this.google.maps.SymbolPath.CIRCLE,
                    scale: options.style.radius !== null && options.style.radius !== undefined ?
                        options.style.radius : marker.icon.scale,
                    strokeColor: options.style.color !== null && options.style.color !== undefined ?
                        options.style.color : marker.icon.strokeColor,
                    strokeWeight: options.style.weight !== null && options.style.weight !== undefined ?
                        options.style.weight : marker.icon.strokeWeight
                };
            }

            let newOptions = null;
            if (position && icon) {
                newOptions = { icon, position };
            } else if (position) {
                newOptions = { position };
            } else {
                newOptions = { icon };
            }

            marker.setOptions(newOptions);
        });
    }

    public alterMarkerPosition(markers: any[], position: number[], addTransition: boolean) {
        const newPosition = {
            lat: position[0],
            lng: position[1]
        };

        markers.forEach((marker) => {
            if (addTransition) {
                this.moveTransitionMarker(newPosition, marker);
            } else {
                marker.setPosition(newPosition);
            }
        });
    }

    public setCenterMarker(marker: any) {
        this.map.setCenter(marker.getPosition());
    }

    public isMarkerOnMap(marker: any): boolean {
        return marker.map !== null;
    }

    public addPolylineListeners(polylines: any, event: EventType, eventFunction: any) {
        polylines.forEach(polyline => {
            switch (event) {
                case EventType.Move:
                    this.google.maps.event.addListener(polyline.getPath(), "set_at", (event: any) => {
                        const param = new EventReturn([polyline.getPath().getAt(event).lat(), polyline.getPath().getAt(event).lng()]);
                        eventFunction(param);
                    });
                    break;
                case EventType.InsertAt:
                    this.google.maps.event.addListener(polyline.getPath(), "insert_at", (event: any) => {
                        const param = new EventReturn([polyline.getPath().getAt(event).lat(), polyline.getPath().getAt(event).lng()]);
                        eventFunction(param);
                    });
                    break;
                case EventType.RemoveAt:
                    this.google.maps.event.addListener(polyline.getPath(), "remove_at", (event: any) => {
                        const param = new EventReturn([polyline.getPath().getAt(event).lat(), polyline.getPath().getAt(event).lng()]);
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
                    this.google.maps.event.addListener(marker, 'click', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.AfterDrag:
                    this.google.maps.event.addListener(marker, 'dragend', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.MouseOver:
                    this.google.maps.event.addListener(marker, 'mouseover', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
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
        const paths = [];

        options.path.forEach((path) => {
            paths.push({
                lat: path[0],
                lng: path[1]
            });
        });

        const newOptions = {
            draggable: options.draggable,
            editable: options.editable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            object: options.object,
            paths,
            strokeColor: options.color,
            strokeOpacity: options.opacity,
            strokeWeight: options.weight,
            suppressUndo: true
        };

        const polygon = new this.google.maps.Polygon(newOptions);

        if (eventClick) {
            this.google.maps.event.addListener(polygon, 'click', (event: any) => {
                const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                eventClick(param, options.object);
            });
        }

        if (options.addToMap) {
            polygon.setMap(self.map);
        }

        if (options.fitBounds) {
            self.map.fitBounds(self.getPolygonBounds(polygon));
        }

        return polygon;
    }

    public fitBoundsPolygons(polygons) {
        const self = this;
        self.map.fitBounds(self.getPolygonsBounds(polygons));
    }

    public togglePolygons(polygons: any[], show: boolean) {
        const self = this;
        polygons.forEach((polygon) => polygon.setMap(show ? self.map : null));
    }

    public alterPolygonOptions(polygons: any[], options: PolygonAlterOptions) {
        let newOptions = {};

        polygons.forEach((polygon) => {
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
    }

    public isPolygonOnMap(polygon: any): boolean {
        return polygon.map !== null;
    }

    /* Circles */
    public drawCircle(options: CircleOptions, eventClick: any) {
        const self = this;
        const latlng = {
            lat: options.center[0],
            lng: options.center[1]
        };
        const newOptions = {
            center: latlng,
            draggable: options.draggable,
            editable: options.editable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            radius: options.radius,
            strokeColor: options.color,
            strokeOpacity: options.opacity,
            strokeWeight: options.weight,
            suppressUndo: true
        };

        const circle = new this.google.maps.Circle(newOptions);

        if (eventClick) {
            this.google.maps.event.addListener(circle, 'click', (event: any) => {
                const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
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
    }

    public toggleCircles(circles: any[], show: boolean) {
        const self = this;
        circles.forEach((circle) => circle.setMap(show ? self.map : null));
    }

    public alterCircleOptions(circles: any[], options: CircleAlterOptions) {
        circles.forEach((circle) => {
            const latlng = options.center !== null && options.center !== undefined && options.center.length > 0 ?
                { lat: options.center[0], lng: options.center[1] } : circle.getCenter();

            let newOptions = {
                center: latlng,
                radius: options.radius !== null && options.radius !== undefined ?
                    options.radius : circle.radius,
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
    }

    public addCircleEvent(circles: any, event: CircleEventType, eventFunction: any): void {
        circles.forEach((circle: any) => {
            switch (event) {
                case CircleEventType.Click:
                    this.google.maps.event.addListener(circle, 'click', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                        eventFunction(param, circle.object);
                    });
                    break;
                case CircleEventType.CenterChanged:
                    this.google.maps.event.addListener(circle, 'center_changed', () => {
                        const param = new EventReturn([circle.getCenter().lat(), circle.getCenter().lng()]);
                        eventFunction(param, circle.object);
                    });
                case CircleEventType.RadiusChanged:
                    this.google.maps.event.addListener(circle, 'radius_changed', (event: any) => {
                        const param = new EventReturn([circle.getCenter().lat(), circle.getCenter().lng()]);
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
                    this.google.maps.event.clearListeners(circle, 'click');
                case CircleEventType.CenterChanged:
                    this.google.maps.event.clearListeners(circle, 'center_changed');
                case CircleEventType.RadiusChanged:
                    this.google.maps.event.clearListeners(circle, 'radius_changed');
                default:
                    break;
            }
        });
    }

    isCircleOnMap(circle: any): boolean {
        return circle.map !== null;
    }

    fitBoundsCircles(circles: any): void {
        this.map.fitBounds(this.getCirclesBounds(circles));
    }

    private getCirclesBounds(circles: any) {
        const bounds = new this.google.maps.LatLngBounds();

        circles.forEach((circulo: any) => bounds.union(circulo.getBounds()));
        return bounds;
    }

    /* Polylines */
    public drawPolyline(options: PolylineOptions, eventClick: any) {
        const self = this;
        let newOptions = {
            draggable: options.draggable,
            editable: options.editable,
            infowindows: options.infowindows,
            object: options.object,
            path: null,
            strokeColor: options.color,
            strokeWeight: options.weight,
            suppressUndo: true,
            icons: null,
            strokeOpacity: null
        };

        if (options.style !== null) {
            switch (options.style) {
                case PolylineType.Dotted:
                    newOptions.strokeOpacity = 0;
                    newOptions.icons = [{
                        icon: {
                            path: 'M 0,-1 0,1',
                            strokeOpacity: 1,
                            scale: 2
                        },
                        offset: '0',
                        repeat: '10px'
                    }];
                    break;
                default:
                    break;
            }
        }

        newOptions.path = options.path ? options.path.map((x) => {
            return {
                lat: x[0],
                lng: x[1]
            };
        }) : [];

        const polyline = new this.google.maps.Polyline(newOptions);

        if (eventClick) {
            this.google.maps.event.addListener(polyline, 'click', (event: any) => {
                const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                eventClick(param, polyline.object);
            });
        }

        if (options.addToMap) {
            polyline.setMap(self.map);
        }

        if (options.fitBounds) {
            self.map.fitBounds(self.getPolylineBounds(polyline));
        }

        return polyline;
    }

    public togglePolylines(polylines: any, show: boolean) {
        polylines.forEach((polyline: any) => {
            const self = this;
            polyline.setMap(show ? self.map : null);
        });
    }

    public drawPolylineWithNavigation(options: PolylineOptions) {
        const self = this;
        const polyline = self.drawPolyline(options, null);

        self.addNavigation(polyline, options.navigateOptions);
        return polyline;
    }

    public clearListenersPolyline(polylines: any) {
        polylines.forEach((polyline: any) => {
            this.google.maps.event.clearListeners(polyline, 'click');
        });
    }

    public addPolylinePath(polylines: any, position: number[]) {
        polylines.forEach((polyline: any) => {
            const path = polyline.getPath();

            path.push(new this.google.maps.LatLng(position[0], position[1]));
            polyline.setPath(path);
        });
    }

    public removePolylineHighlight() {
        this.google.maps.event.clearListeners(document, 'keyup');
        if (this.selectedPath) {
            this.clearPolylinePath(this.selectedPath);
        }
        if (this.navigateInfoWindow) {
            this.navigateInfoWindow.close();
        }
    }

    public alterPolylineOptions(polylines, options: PolylineOptions) {
        polylines.forEach((polyline: any) => {
            const newOptions = {
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
        });
    }

    public fitBoundsPolylines(polylines: any) {
        const self = this;
        self.map.fitBounds(self.getPolylinesBounds(polylines));
    }

    private getPolylinesBounds(polylines: any) {
        const bounds = new this.google.maps.LatLngBounds();

        polylines.forEach((polyline: any) => {
            const paths = polyline.getPath().getArray();
            paths.forEach((path: any) => bounds.extend(path));
        });

        return bounds;
    }

    public isPolylineOnMap(polyline: any): boolean {
        return polyline.map !== null;
    }

    /* Info Windows */
    public drawPopup(options: PopupOptions, marker?: any) {
        const self = this;
        const infowindow = new this.google.maps.InfoWindow({
            content: options.content
        });

        if (options.latlng) {
            infowindow.setPosition({
                lat: options.latlng[0],
                lng: options.latlng[1]
            });
        }

        infowindow.open(self.map, marker || null);
        return infowindow;
    }

    public alterPopup(popup, options: PopupOptions, marker?: any) {
        const self = this;

        if (options.content) {
            popup.setContent(options.content);
        }

        if (options.latlng) {
            popup.setPosition({
                lat: options.latlng[0],
                lng: options.latlng[1]
            });
        } else if (marker) {
            popup.setPosition(marker.getPosition());
        }

        if (!popup.getMap()) {
            popup.open(self.map, marker || null);
        }
    }

    public closePopup(popup: any) {
        popup.close();
    }

    /* Map */
    public addEventMap(eventType: EventType, eventFunction: any) {
        const self = this;

        switch (eventType) {
            case EventType.Click:
                this.google.maps.event.addListener(self.map, 'click', (event: any) => {
                    const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                    eventFunction(param);
                });
                break;
            case EventType.ZoomChanged:
                self.map.addListener('zoom_changed', () => {
                    const param = new EventReturn([self.map.getCenter().lat(), self.map.getCenter().lng()]);
                    eventFunction(param);
                });
            default:
                break;
        }
    }

    public removeEventMap(eventType: EventType) {
        const self = this;
        switch (eventType) {
            case EventType.Click:
                this.google.maps.event.clearListeners(self.map, 'click');
                break;
            case EventType.ZoomChanged:
                this.google.maps.event.clearListeners(self.map, 'zoom_changed');
            default:
                break;
        }
    }

    public getZoom(): number {
        return this.map.getZoom();
    }

    public setZoom(zoom: number) {
        return this.map.setZoom(zoom);
    }

    public getCenter(): number[] {
        const center = this.map.getCenter();
        return [center.lat(), center.lng()];
    }

    public setCenter(position: number[]) {
        this.map.setCenter(new google.maps.LatLng(position[0], position[1]));
    }

    public resizeMap(): void {
        google.maps.event.trigger(this.map, 'resize');
    }

    public pixelsToLatLng(offsetx: number, offsety: number) {
        var scale = Math.pow(2, this.map.getZoom());
        var worldCoordinateCenter = this.map.getProjection().fromLatLngToPoint(this.map.getCenter());
        var pixelOffset = new google.maps.Point(offsetx / scale || 0, offsety / scale || 0);

        var worldCoordinateNewCenter = new google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        const latlng = this.map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        return [latlng.lat(), latlng.lng()];
    }

    /* Overlay */
    public drawOverlay(options: OverlayOptions, polygons: any) {
        let bounds = null;

        if (polygons && polygons.length > 0) {
            bounds = this.getPolygonsBounds(polygons);
        } else {
            bounds = new this.google.maps.LatLngBounds();
            bounds.extend(new this.google.maps.LatLng(options.position[0], options.position[1]));
        }

        const overlay = new this.OverlayGoogle(bounds, options.divElement);
        if (options.addToMap) {
            overlay.setMap(this.map);
        }

        overlay.object = options.object;
        return overlay;
    }

    public toggleOverlay(overlays: any[], show: boolean) {
        const self = this;
        overlays.forEach((overlay) => overlay.setMap(show ? self.map : null));
    }

    /* Private Methods */
    private addNavigation(polyline, options: NavigationOptions) {
        const self = this;

        this.google.maps.event.clearListeners(polyline, 'click');
        this.google.maps.event.addListener(polyline, 'click', self.onClickPolyline.bind(self, polyline, options));
    }

    private onClickPolyline(polyline, options: NavigationOptions, event) {
        const self = this;
        const index = self.checkIdx(polyline, event.latLng);

        polyline.idxInicial = index;
        polyline.idxFinal = index + 1;

        self.moveSelectedPath(polyline, options);
        self.selectedPolyline = polyline;

        this.google.maps.event.clearListeners(document, 'keyup');
        this.google.maps.event.addDomListener(document, 'keyup', self.onKeyUp.bind(self));
    }

    private onKeyUp(event: any) {
        const self = this;

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
    }

    private moveForwards(multiSelection: boolean) {
        const self = this;
        const polyline = self.selectedPolyline;

        if (self.directionForward && polyline.idxFinal < polyline.getPath().getArray().length - 1) {
            self.navigateForward(multiSelection, polyline);
        }
        self.directionForward = true;
        self.moveSelectedPath(polyline, null);
    }

    private navigateForward(multiSelection: boolean, polyline: any) {
        const self = this;
        if (!multiSelection) {
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

    private moveBackwards(multiSelection: boolean) {
        const self = this;
        const polyline = self.selectedPolyline;

        if (!self.directionForward && polyline.idxInicial > 0) {
            self.navigateBackward(multiSelection, polyline);
        }
        self.directionForward = false;
        self.moveSelectedPath(polyline, null);
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
        const pathSelected = polyline.getPath().getArray().slice(polyline.idxInicial, polyline.idxFinal + 1);

        if (this.selectedPath) {
            this.selectedPath.setPath(pathSelected);
        } else {
            const newOptions = {
                map: this.map,
                path: pathSelected,
                strokeColor: options && options.color || '#FF0000',
                strokeWeight: options && options.weight || 10,
                zIndex: 9999
            };

            this.selectedPath = new this.google.maps.Polyline(newOptions);
        }

        this.drawPopupNavigation(polyline);
    }

    private drawPopupNavigation(polyline: any) {
        const self = this;
        const idx = self.directionForward ? polyline.idxFinal : polyline.idxInicial;
        const infowindow = polyline.infowindows ? polyline.infowindows[idx] : null;

        if (infowindow) {
            const point = polyline.getPath().getArray()[idx];

            if (self.navigateInfoWindow) {
                self.alterPopup(self.navigateInfoWindow, {
                    content: infowindow,
                    latlng: [point.lat(), point.lng()]
                });
            } else {
                self.navigateInfoWindow = self.drawPopup({
                    content: infowindow,
                    latlng: [point.lat(), point.lng()]
                });
            }
        }
    }

    private checkIdx(polyline: any, point: any) {
        const self = this;
        const path = polyline.getPath();
        let distance = 0;
        let minDistance = Number.MAX_VALUE;
        let returnValue = -1;

        for (let i = 0; i < path.length - 1; i++) {
            distance = self.distanceToLine(path.getAt(i), path.getAt(i + 1), point);

            if (distance < minDistance) {
                minDistance = distance;
                returnValue = i;
            }
        }
        return returnValue;
    }

    private distanceToLine(pt1: any, pt2: any, pt: any) {
        const self = this;
        const deltaX = pt2.lng() - pt1.lng();
        const deltaY = pt2.lat() - pt1.lat();
        let incIntersect = (pt.lng() - pt1.lng()) * deltaX;
        const deltaSum = (deltaX * deltaX) + (deltaY * deltaY);

        incIntersect += (pt.lat() - pt1.lat()) * deltaY;
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
        const intersect = new this.google.maps
            .LatLng(pt1.lat() + incIntersect * deltaY, pt1.lng() + incIntersect * deltaX);

        return self.kmTo(pt, intersect);
    }

    private kmTo(pt1: any, pt2: any) {
        const e = Math;
        const ra = e.PI / 180;
        const b = pt1.lat() * ra;
        const c = pt2.lat() * ra;
        const d = b - c;
        const g = pt1.lng() * ra - pt2.lng() * ra;
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
                geometry.coordinates.forEach((polygon) =>
                    objectOptions.paths.push(polygon.map((elem) => ({
                        lat: elem[1],
                        lng: elem[0]
                    })))
                );
                return new this.google.maps.Polygon(objectOptions);
            case 'LineString':
                objectOptions.path = geometry.coordinates.map((elem) => ({
                    lat: elem[1],
                    lng: elem[0]
                }));
                return new this.google.maps.Polyline(objectOptions);
            default:
                throw new Error('Forma de objeto desconhecida.');
        }
    }

    private moveTransitionMarker(position: any, marker: any) {
        const numDeltas = 5;
        const referencia = {
            position: [marker.getPosition().lat(), marker.getPosition().lng()],
            i: 0,
            deltaLat: (position.lat - marker.getPosition().lat()) / numDeltas,
            deltaLng: (position.lng - marker.getPosition().lng()) / numDeltas
        }

        this.moveMarker(marker, referencia, numDeltas);
    }

    private moveMarker(marker: any, referencia: any, numDeltas: number) {
        referencia.position[0] += referencia.deltaLat;
        referencia.position[1] += referencia.deltaLng;
        marker.setPosition(new google.maps.LatLng(referencia.position[0], referencia.position[1]));
        if (referencia.i <= numDeltas) {
            referencia.i++;
            setTimeout(() => this.moveMarker(marker, referencia, numDeltas), 20);
        }
    }

    // --------------- HELPER FUNCTIONS
    private getPolygonBounds(polygon: any) {
        const bounds = new this.google.maps.LatLngBounds();
        const paths = polygon.getPaths().getArray();

        paths.forEach((path) => {
            path.getArray().forEach((x) => bounds.extend(x));
        });
        return bounds;
    }

    private getPolylineBounds(polyline: any) {
        const bounds = new this.google.maps.LatLngBounds();
        const paths = polyline.getPath().getArray();

        paths.forEach((path) => bounds.extend(path));
        return bounds;
    }

    private getPolygonsBounds(polygons: any) {
        const bounds = new this.google.maps.LatLngBounds();

        polygons.forEach((polygon: any) => {
            const paths = polygon.getPaths().getArray();

            paths.forEach((path: any) => path.getArray()
                .forEach((x: any) => bounds.extend(x)));
        });

        return bounds;
    }

    private clearPolylinePath(polyline: any) {
        polyline.setPath([]);
    }
}

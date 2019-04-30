import { EventType, MarkerEventType, CircleEventType } from '../dto/event-type';
import { MapType } from '../dto/map-type';
import { PolylineType } from '../dto/polyline-type';
import CircleAlterOptions from '../features/circle/circle-alter-options';
import CircleOptions from '../features/circle/circle-options';
import GeoJsonOptions from '../features/geojson/geojson-options';
import CircleMarkerOptions from '../features/marker/circle-marker-options';
import MarkerAlterOptions from '../features/marker/marker-alter-options';
import MarkerOptions from '../features/marker/marker-options';
import OverlayOptions from '../features/overlay/overlay-options';
import PolygonAlterOptions from '../features/polygons/polygon-alter-options';
import PolygonOptions from '../features/polygons/polygon-options';
import PolylineOptions from '../features/polyline/polyline-options';
import PopupOptions from '../features/popup/popup-options';

export default interface IMapFunctions {
    initialize(mapType: MapType, params: object, elementId?: string): Promise<any>;

    /* GEOJson */
    loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any): void;

    /* Markers */
    drawMarker(options: MarkerOptions, eventClick: any): any;
    fitBoundsPositions(markers: any[]): void;
    drawCircleMarker(options: CircleMarkerOptions, eventClick: any): any;
    toggleMarkers(markers: any[], show: boolean): void;
    alterMarkerOptions(markers: any[], options: MarkerAlterOptions): void;
    alterMarkerPosition(markers: any[], position: number[], addTransition: boolean): void;
    setCenterMarker(marker: any): void;
    isMarkerOnMap(marker: any): boolean;
    addMarkerEvent(markers: any, event: MarkerEventType, eventFunction: any): void;

    /* Polygons */
    drawPolygon(options: PolygonOptions, eventClick: any): any;
    fitBoundsPolygons(polygons: any): void;
    togglePolygons(polygons: any[], show: boolean): void;
    alterPolygonOptions(polygons: any[], options: PolygonAlterOptions): void;
    isPolygonOnMap(polygon: any): boolean;

    /* Polylines */
    drawPolyline(options: PolylineOptions, eventClick: any): any;
    togglePolylines(polylines: any, show: boolean): void;
    drawPolylineWithNavigation(options: PolylineOptions): any;
    clearListenersPolyline(polylines: any): void;
    addPolylinePath(polylines: any, position: number[]): void;
    removePolylineHighlight(): void;
    alterPolylineOptions(polylines: any, options: PolylineOptions): void;
    fitBoundsPolylines(polylines: any): void;
    isPolylineOnMap(polyline: any): boolean;
    addPolylineListeners(polyline: any, event: EventType, eventFunction: any);

    /* Circles */
    drawCircle(options: CircleOptions, eventClick: any): any;
    toggleCircles(circles: any[], show: boolean): void;
    alterCircleOptions(circles: any[], options: CircleAlterOptions): void;
    addCircleEvent(circles: any, event: CircleEventType, eventFunction: any): void;
    removeCircleEvent(circles: any, event: CircleEventType): void;
    isCircleOnMap(circle: any): boolean;
    fitBoundsCircles(circles: any): void;
    getCircleCenter(circle: any): number[];

    /* Info Windows */
    drawPopup(options: PopupOptions, marker?: any): any;
    alterPopup(popup: any, options: PopupOptions, marker?: any): void;
    closePopup(popup: any): void;

    /* Map */
    addEventMap(eventType: EventType, eventFunction: any): void;
    removeEventMap(eventType: EventType): void;
    getZoom(): number;
    setZoom(zoom: number): void;
    getCenter(): number[];
    setCenter(position: number[]): void;
    resizeMap(): void;
    pixelsToLatLng(offsetx: number, offsety: number): number[];

    /* Overlay */
    drawOverlay(options: OverlayOptions, polygons?: any): any;
    toggleOverlay(overlays: any[], show: boolean): void;
}

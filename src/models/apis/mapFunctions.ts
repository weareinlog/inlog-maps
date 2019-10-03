import { MarkerEventType, CircleEventType, PolygonEventType, PolylineEventType, MapEventType } from '../dto/event-type';
import { MapType } from '../dto/map-type';
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
import MarkerClustererConfig from '../features/marker-clusterer/marker-clusterer-config';

export default interface IMapFunctions {
    initialize(mapType: MapType, params: object, elementId: string): Promise<any>;

    /* GEOJson */
    loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any): void;

    /* Markers */
    drawMarker(options: MarkerOptions, eventClick: any): any;
    drawCircleMarker(options: CircleMarkerOptions, eventClick: any): any;
    toggleMarkers(markers: any[], show: boolean, markerClusterer?: any): void;
    alterMarkerOptions(markers: any[], options: MarkerAlterOptions): void;
    alterMarkerPosition(markers: any[], position: number[], addTransition: boolean): void;
    fitBoundsPositions(markers: any[]): void;
    isMarkerOnMap(marker: any): boolean;
    setCenterMarker(marker: any): void;
    addMarkerEvent(markers: any, event: MarkerEventType, eventFunction: any): void;
    removeMarkerEvent(markers: any, event: MarkerEventType): void;

    /* Marker Clusterer */
    addMarkerClusterer(config: MarkerClustererConfig): any;
    refreshClusterer(markerClusterer: any): void;
    addMarkerOnClusterer(marker: any, markerClusterer: any): void;
    removeMarkerFromClusterer(marker: any, markerClusterer: any): void;
    clearMarkersClusterer(markerClusterer: any): void;
    alterMarkerClustererConfig(markerClusterer: any, config: MarkerClustererConfig): void;
    countMarkersOnCluster(markerClusterer: any): number;

    /* Polygons */
    drawPolygon(options: PolygonOptions, eventClick: any): any;
    togglePolygons(polygons: any[], show: boolean): void;
    alterPolygonOptions(polygons: any[], options: PolygonAlterOptions): void;
    fitBoundsPolygons(polygons: any): void;
    setCenterPolygons(polygons: any): void;
    isPolygonOnMap(polygon: any): boolean;
    addPolygonEvent(polygons: any, event: PolygonEventType, eventFunction: any): void;
    removePolygonEvent(polygons: any, event: PolygonEventType): void;

    /* Circles */
    drawCircle(options: CircleOptions, eventClick: any): any;
    toggleCircles(circles: any[], show: boolean): void;
    alterCircleOptions(circles: any[], options: CircleAlterOptions): void;
    fitBoundsCircles(circles: any): void;
    isCircleOnMap(circle: any): boolean;
    getCircleCenter(circle: any): number[];
    addCircleEvent(circles: any, event: CircleEventType, eventFunction: any): void;
    removeCircleEvent(circles: any, event: CircleEventType): void;

    /* Polylines */
    drawPolyline(options: PolylineOptions, eventClick: any): any;
    drawPolylineWithNavigation(options: PolylineOptions, eventClick?: any): any;
    togglePolylines(polylines: any, show: boolean): void;
    alterPolylineOptions(polylines: any, options: PolylineOptions): void;
    fitBoundsPolylines(polylines: any): void;
    isPolylineOnMap(polyline: any): boolean;
    addPolylinePath(polylines: any, position: number[]): void;
    getPolylinePath(polyline: any): number[];
    removePolylineHighlight(): void;
    addPolylineEvent(polyline: any, event: PolylineEventType, eventFunction: any): any;
    removePolylineEvent(polyline: any, event: PolylineEventType): void;
    setIndexPolylineHighlight(polyline: any, index: number): void;
    getObjectPolyline(polyline: any): object;
    addPolylineHighlightEvent(event: PolylineEventType, eventFunction: any): void;
    getPolylineHighlightIndex(): number[];

    /* Info Windows */
    drawPopup(options: PopupOptions, marker?: any): any;
    alterPopup(popup: any, options: PopupOptions, marker?: any): void;
    alterPopupContent(popup: any, options: PopupOptions, marker?: any): void;
    closePopup(popup: any): void;

    /* Map */
    resizeMap(): void;
    addEventMap(eventType: MapEventType, eventFunction: any): void;
    removeEventMap(eventType: MapEventType): void;
    getZoom(): number;
    setZoom(zoom: number): void;
    getCenter(): number[];
    setCenter(position: number[]): void;
    pixelsToLatLng(offsetx: number, offsety: number): number[];

    /* Overlay */
    drawOverlay(options: OverlayOptions, polygons?: any): any;
    toggleOverlay(overlays: any[], show: boolean): void;
}

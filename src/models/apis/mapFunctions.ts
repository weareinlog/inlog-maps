import { EventType, MarkerEventType } from '../dto/event-type';
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

export default interface IMapFunctions {
    initialize(mapType: MapType, params: object, elementId: string);

    /* GEOJson */
    loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any);

    /* Markers */
    drawMarker(options: MarkerOptions, eventClick: any);
    fitBoundsPositions(markers: any[]);
    drawCircleMarker(options: CircleMarkerOptions, eventClick: any);
    toggleMarkers(markers: any[], show: boolean);
    alterMarkerOptions(markers: any[], options: MarkerAlterOptions);
    alterMarkerPosition(markers: any[], position: number[], addTransotion: boolean);
    setCenterMarker(marker: any);
    isMarkerOnMap(marker: any): boolean;
    addMarkerEvent(markers: any, event: MarkerEventType, eventFunction: any);

    /* Polygons */
    drawPolygon(options: PolygonOptions, eventClick: any);
    fitBoundsPolygons(polygons: any);
    togglePolygons(polygons: any[], show: boolean);
    alterPolygonOptions(polygons: any[], options: PolygonAlterOptions);
    isPolygonOnMap(polygon: any): boolean;

    /* Polylines */
    drawPolyline(options: PolylineOptions, eventClick: any);
    togglePolylines(polylines: any, show: boolean);
    drawPolylineWithNavigation(options: PolylineOptions);
    clearListenersPolyline(polylines: any);
    addPolylinePath(polylines: any, position: number[]);
    removePolylineHighlight();
    alterPolylineOptions(polylines: any, options: PolylineOptions);
    fitBoundsPolylines(polylines: any);
    isPolylineOnMap(polyline: any): boolean;
    addPolylineListeners(polyline: any, event: EventType, eventFunction: any);

    /* Circles */
    drawCircle(options: CircleOptions, eventClick: any);
    toggleCircles(circles: any[], show: boolean);
    alterCircleOptions(circles: any[], options: CircleAlterOptions);

    /* Info Windows */
    drawPopup(options: PopupOptions);
    alterPopup(popup: any, options: PopupOptions);
    closePopup(popup: any);

    /* Map */
    addEventMap(eventType: EventType, eventFunction: any);
    removeEventMap(eventType: EventType);
    getZoom(): number;
    getCenter(): number[];
    setCenter(position: number[]);

    /* Overlay */
    drawOverlay(options: OverlayOptions, polygons?: any);
    toggleOverlay(overlays: any[], show: boolean);
}

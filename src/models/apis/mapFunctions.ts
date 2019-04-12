import { EventType } from '../dto/event-type';
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
    initialize(mapType: MapType, params: object);

    /* GEOJson */
    loadGEOJson(data: object, options: GeoJsonOptions, eventClick);

    /* Markers */
    drawMarker(options: MarkerOptions, eventClick);
    fitBoundsPositions(markers: any[]);
    drawCircleMarker(options: CircleMarkerOptions, eventClick);
    toggleMarkers(markers: any[], show: boolean);
    alterMarkerOptions(markers: any[], options: MarkerAlterOptions);
    alterMarkerPosition(markers: any[], position: number[], addTransotion: boolean);
    setCenterMarker(marker: any);

    /* Polygons */
    drawPolygon(options: PolygonOptions, eventClick);
    fitBoundsPolygons(polygons);
    togglePolygons(polygons: any[], show: boolean);
    alterPolygonOptions(polygons: any[], options: PolygonAlterOptions);

    /* Polylines */
    drawPolyline(options: PolylineOptions, eventClick);
    togglePolyline(polyline: any, show: boolean);
    drawPolylineWithNavigation(options: PolylineOptions);
    clearListenersPolyline(polyline);
    addPolylinePath(polyline, position: number[]);
    removePolylineHighlight();
    alterPolylineOptions(polyline, options: PolylineOptions);

    /* Circles */
    drawCircle(options: CircleOptions, eventClick);
    toggleCircles(circles: any[], show: boolean);
    alterCircleOptions(circles: any[], options: CircleAlterOptions);

    /* Info Windows */
    drawPopup(options: PopupOptions);
    alterPopup(popup, options: PopupOptions);

    /* Map */
    addEventMap(eventType: EventType, eventFunction);
    removeEventMap(eventType: EventType);
    getZoom(): number;

    /* Overlay */
    drawOverlay(options: OverlayOptions, polygons?: any);
    toggleOverlay(overlays: any[], show: boolean);
}

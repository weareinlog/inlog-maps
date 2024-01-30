import {
    MarkerEventType,
    PolygonEventType,
    CircleEventType,
    PolylineEventType,
    MapEventType,
} from "../dto/event-type";
import { MapType } from "../dto/map-type";
import CircleAlterOptions from "../features/circle/circle-alter-options";
import CircleOptions from "../features/circle/circle-options";
import GeoJsonOptions from "../features/geojson/geojson-options";
import MarkerClustererConfig from "../features/marker-clusterer/marker-clusterer-config";
import CircleMarkerOptions from "../features/marker/circle-marker-options";
import MarkerAlterOptions from "../features/marker/marker-alter-options";
import MarkerOptions from "../features/marker/marker-options";
import OverlayOptions from "../features/overlay/overlay-options";
import PolygonAlterOptions from "../features/polygons/polygon-alter-options";
import PolygonOptions from "../features/polygons/polygon-options";
import PolylineOptions from "../features/polyline/polyline-options";
import PopupOptions from "../features/popup/popup-options";
import IMapFunctions from "./mapFunctions";
export default class GoogleMaps implements IMapFunctions {
    private map;
    private google;
    private mapsApiLoader;
    private selectedPolyline;
    private selectedPath;
    private navigateInfoWindow;
    private directionForward;
    private multiSelectionForward;
    private multiSelection;
    constructor();
    alterMarkerPosition(
        markers: any[],
        position: number[],
        addTransition: boolean
    ): void;
    isMarkerOnMap(marker: any): boolean | undefined;
    setCenterMarker(marker: any): void;
    addMarkerEvent(
        markers: any,
        event: MarkerEventType,
        eventFunction: any
    ): void;
    removeMarkerEvent(markers: any, event: MarkerEventType): void;
    addMarkerClusterer(config: MarkerClustererConfig);
    refreshClusterer(markerClusterer: any): void;
    addMarkerOnClusterer(marker: any, markerClusterer: any): void;
    removeMarkerFromClusterer(marker: any, markerClusterer: any): void;
    clearMarkersClusterer(markerClusterer: any): void;
    alterMarkerClustererConfig(
        markerClusterer: any,
        config: MarkerClustererConfig
    ): void;
    countMarkersOnCluster(markerClusterer: any): number;
    fitBoundsPolygons(polygons: any): void;
    setCenterPolygons(polygons: any): void;
    isPolygonOnMap(polygon: any): boolean;
    getPolygonPath(polygon: any): number[][];
    addPolygonEvent(
        polygons: any,
        event: PolygonEventType,
        eventFunction: any
    ): void;
    removePolygonEvent(polygons: any, event: PolygonEventType): void;
    fitBoundsCircles(circles: any): void;
    isCircleOnMap(circle: any): boolean;
    getCircleCenter(circle: any): number[];
    getCircleRadius(circle: any): number;
    addCircleEvent(
        circles: any,
        event: CircleEventType,
        eventFunction: any
    ): void;
    removeCircleEvent(circles: any, event: CircleEventType): void;
    togglePolylines(polylines: any, show: boolean): void;
    fitBoundsPolylines(polylines: any): void;
    isPolylineOnMap(polyline: any): boolean;
    getPolylinePath(polyline: any): number[][];
    addPolylineEvent(
        polyline: any,
        event: PolylineEventType,
        eventFunction: any
    );
    removePolylineEvent(polyline: any, event: PolylineEventType): void;
    setIndexPolylineHighlight(polyline: any, index: number): void;
    getObjectPolyline(polyline: any): object;
    addPolylineHighlightEvent(
        event: PolylineEventType,
        eventFunction: any
    ): void;
    getPolylineHighlightIndex(): number[];
    getObjectPolylineHighlight(): object;
    alterPopupContent(popup: any, options: PopupOptions, marker?: any): void;
    closePopup(popup: any): void;
    resizeMap(): void;
    addEventMap(eventType: MapEventType, eventFunction: any): void;
    removeEventMap(eventType: MapEventType): void;
    getZoom(): number;
    setZoom(zoom: number): void;
    getCenter(): number[];
    setCenter(position: number[]): void;
    pixelsToLatLng(offsetx: number, offsety: number): number[];
    fitBoundsElements(
        markers: any,
        circles: any,
        polygons: any,
        polylines: any
    ): void;
    drawOverlay(options: OverlayOptions, polygons?: any);
    toggleOverlay(overlays: any[], show: boolean): void;
    takeMapScreenshot(): Promise<string | null>;
    initialize(mapType: MapType, params: object): Promise<any>;
    loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any): void;
    drawMarker(options: MarkerOptions, eventClick: any): any;
    fitBoundsPositions(markers: any[]): void;
    drawCircleMarker(options: CircleMarkerOptions, eventClick: any): any;
    toggleMarkers(markers: any[], show: boolean): void;
    alterMarkerOptions(markers: any[], options: MarkerAlterOptions): void;
    drawPolygon(options: PolygonOptions, eventClick: any): any;
    fitBoundsPolygon(polygon: any): void;
    togglePolygons(polygons: any[], show: boolean): void;
    alterPolygonOptions(polygons: any[], options: PolygonAlterOptions): void;
    drawCircle(options: CircleOptions, eventClick: any): any;
    toggleCircles(circles: any[], show: boolean): void;
    alterCircleOptions(circles: any[], options: CircleAlterOptions): void;
    drawPolyline(options: PolylineOptions, eventClick: any): any;
    togglePolyline(polyline: any, show: boolean): void;
    drawPolylineWithNavigation(options: PolylineOptions, eventClick: any): any;
    clearListenersPolyline(polyline: any): void;
    addPolylinePath(polyline: any, position: number[]): void;
    removePolylineHighlight(): void;
    alterPolylineOptions(polyline: any, options: PolylineOptions): void;
    drawPopup(options: PopupOptions): any;
    alterPopup(popup: any, options: PopupOptions): void;
    addClickMap(eventClick: any): void;
    removeClickMap(): void;
    private addNavigation;
    private onClickPolyline;
    private onKeyUp;
    private moveForwards;
    private navigateForward;
    private moveBackwards;
    private navigateBackward;
    private moveSelectedPath;
    private drawPopupNavigation;
    private checkIdx;
    private distanceToLine;
    private kmTo;
    private parseGeoJson;
    private parseGeoJsonToObject;
    private getPolygonBounds;
    private getPolylineBounds;
    private getPolygonsBounds;
    private clearPolylinePath;
}

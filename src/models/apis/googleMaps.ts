import { MapsApiLoaderService } from '../../utils/maps-api-loader.service';
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
import IMapFunctions from './mapFunctions';
import MarkerClustererConfig from '../features/marker-clusterer/marker-clusterer-config';
import GoogleMarkers from './google/google-markers';
import GooglePolygons from './google/google-polygons';
import GoogleCircles from './google/google-circles';
import GooglePolylines from './google/google-polylines';
import GooglePopups from './google/google-popup';
import GoogleMap from './google/google-map';
import GoogleOverlays from './google/google-overlay';
import GoogleGeoJson from './google/google-geojson';

export default class GoogleMaps implements IMapFunctions {
    private map = null;
    private google = null;
    private googleMarkers: GoogleMarkers;
    private googlePolygons: GooglePolygons;
    private googleCircles: GoogleCircles;
    private googlePolylines: GooglePolylines;
    private googlePopups: GooglePopups;
    private googleMap: GoogleMap;
    private googleOverlays: GoogleOverlays;
    private googleGeoJson: GoogleGeoJson;

    private mapsApiLoader: MapsApiLoaderService = new MapsApiLoaderService();

    constructor() { }

    public async initialize(mapType: MapType, params: any, elementId: string): Promise<any> {
        try {
            const api = await this.mapsApiLoader.loadApi(mapType, params);
            this.google = api;
            const options: any = {
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
            } else {
                options.gestureHandling = 'greedy';
            }

            if (params.options) {
                for (const key in params.options) {
                    if (params.options.hasOwnProperty(key)) {
                        options[key] = params.options[key];
                    }
                }
            }

            this.map = new this.google.maps.Map(document.getElementById(elementId), options);
            this.googleMarkers = new GoogleMarkers(this.map, this.google);
            this.googlePolygons = new GooglePolygons(this.map, this.google);
            this.googleCircles = new GoogleCircles(this.map, this.google);
            this.googlePopups = new GooglePopups(this.map, this.google);
            this.googlePolylines = new GooglePolylines(this.map, this.google, this.googlePopups);
            this.googleMap = new GoogleMap(this.map, this.google);
            this.googleOverlays = new GoogleOverlays(this.map, this.google, this.googlePolygons);
            this.googleGeoJson = new GoogleGeoJson(this.map, this.google);
            return this;
        }
        catch (err) {
            return err;
        }
    }

    /* GEOJson */
    public loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any) {
        this.googleGeoJson.loadGEOJson(data, options, eventClick);
    }

    /* Markers */
    public drawMarker(options: MarkerOptions, eventClick: any): any {
        return this.googleMarkers.drawMarker(options, eventClick);
    }

    public drawCircleMarker(options: CircleMarkerOptions, eventClick: any): any {
        return this.googleMarkers.drawCircleMarker(options, eventClick);
    }

    public toggleMarkers(markers: any[], show: boolean, markerClusterer?: any): void {
        this.googleMarkers.toggleMarkers(markers, show, markerClusterer);
    }

    public alterMarkerOptions(markers: any[], options: MarkerAlterOptions): void {
        this.googleMarkers.alterMarkerOptions(markers, options);
    }

    public alterMarkerPosition(markers: any[], position: number[], addTransition: boolean): void {
        this.googleMarkers.alterMarkerPosition(markers, position, addTransition);
    }

    public fitBoundsPositions(markers: any[]): void {
        this.googleMarkers.fitBoundsPositions(markers);
    }

    public isMarkerOnMap(marker: any): boolean {
        return this.googleMarkers.isMarkerOnMap(marker);
    }

    public setCenterMarker(marker: any): void {
        this.googleMarkers.setCenterMarker(marker);
    }

    public addMarkerEvent(markers: any, eventType: MarkerEventType, eventFunction: any): void {
        this.googleMarkers.addMarkerEvent(markers, eventType, eventFunction);
    }

    public removeMarkerEvent(markers: any, event: MarkerEventType): void {
        this.googleMarkers.removeMarkerEvent(markers, event);
    }

    /* Marker Clusterer */
    public addMarkerClusterer(config: MarkerClustererConfig): any {
        return this.googleMarkers.addMarkerClusterer(config);
    }

    public alterMarkerClustererConfig(markerClusterer: any, config: MarkerClustererConfig): void {
        this.googleMarkers.alterMarkerClustererConfig(markerClusterer, config);
    }

    public refreshClusterer(markerClusterer: any): void {
        this.googleMarkers.refreshClusterer(markerClusterer);
    }

    public addMarkerOnClusterer(marker: any, markerClusterer: any): void {
        this.googleMarkers.addMarkerOnClusterer(marker, markerClusterer);
    }

    public removeMarkerFromClusterer(marker: any, markerClusterer: any): void {
        this.googleMarkers.removeMarkerFromClusterer(marker, markerClusterer);
    }

    public clearMarkersClusterer(markerClusterer: any): void {
        this.googleMarkers.clearMarkersClusterer(markerClusterer);
    }

    public countMarkersOnCluster(markerClusterer: any): number {
        return this.countMarkersOnCluster(markerClusterer);
    }

    /* Polygons */
    public drawPolygon(options: PolygonOptions, eventClick: any): any {
        return this.googlePolygons.drawPolygon(options, eventClick);
    }

    public togglePolygons(polygons: any[], show: boolean): void {
        this.googlePolygons.togglePolygons(polygons, show);
    }

    public alterPolygonOptions(polygons: any[], options: PolygonAlterOptions): void {
        this.googlePolygons.alterPolygonOptions(polygons, options);
    }

    public fitBoundsPolygons(polygons: any): void {
        this.googlePolygons.fitBoundsPolygons(polygons);
    }

    public setCenterPolygons(polygons: any): void {
        this.googlePolygons.setCenterPolygons(polygons);
    }

    public isPolygonOnMap(polygon: any): boolean {
        return this.googlePolygons.isPolygonOnMap(polygon);
    }

    public addPolygonEvent(polygons: any, eventType: PolygonEventType, eventFunction: any): void {
        return this.googlePolygons.addPolygonEvent(polygons, eventType, eventFunction);
    }

    public removePolygonEvent(polygons: any, event: PolygonEventType): void {
        this.googlePolygons.removePolygonEvent(polygons, event);
    }

    /* Circles */
    public drawCircle(options: CircleOptions, eventClick: any): any {
        return this.googleCircles.drawCircle(options, eventClick);
    }

    public toggleCircles(circles: any[], show: boolean): void {
        this.googleCircles.toggleCircles(circles, show);
    }

    public alterCircleOptions(circles: any[], options: CircleAlterOptions): void {
        this.googleCircles.alterCircleOptions(circles, options);
    }

    public fitBoundsCircles(circles: any): void {
        this.googleCircles.fitBoundsCircles(circles);
    }

    public isCircleOnMap(circle: any): boolean {
        return this.googleCircles.isCircleOnMap(circle);
    }

    public getCircleCenter(circle: any): number[] {
        return this.googleCircles.getCircleCenter(circle);
    }

    public addCircleEvent(circles: any, eventType: CircleEventType, eventFunction: any): void {
        this.googleCircles.addCircleEvent(circles, eventType, eventFunction);
    }

    public removeCircleEvent(circles: any, event: CircleEventType): void {
        this.googleCircles.removeCircleEvent(circles, event);
    }

    /* Polylines */
    public drawPolyline(options: PolylineOptions, eventClick: any): any {
        return this.googlePolylines.drawPolyline(options, eventClick);
    }

    public drawPolylineWithNavigation(options: PolylineOptions, eventClick?: any): any {
        return this.googlePolylines.drawPolylineWithNavigation(options, eventClick);
    }

    public togglePolylines(polylines: any, show: boolean): void {
        this.googlePolylines.togglePolylines(polylines, show);
    }

    public alterPolylineOptions(polylines: any, options: PolylineOptions): void {
        this.googlePolylines.alterPolylineOptions(polylines, options);
    }

    public fitBoundsPolylines(polylines: any): void {
        this.googlePolylines.fitBoundsPolylines(polylines);
    }

    public isPolylineOnMap(polyline: any): boolean {
        return this.googlePolylines.isPolylineOnMap(polyline);
    }

    public addPolylinePath(polylines: any, position: number[]): void {
        this.googlePolylines.addPolylinePath(polylines, position);
    }

    public getPolylinePath(polyline: any): number[] {
        return this.googlePolylines.getPolylinePath(polyline);
    }

    public removePolylineHighlight(): void {
        this.googlePolylines.removePolylineHighlight();
    }

    public addPolylineEvent(polylines: any, eventType: PolylineEventType, eventFunction: any): void {
        this.googlePolylines.addPolylineEvent(polylines, eventType, eventFunction);
    }

    public removePolylineEvent(polylines: any, event: PolylineEventType): void {
        this.googlePolylines.removePolylineEvent(polylines, event);
    }

    public setIndexPolylineHighlight(polyline: any, index: number): void {
        this.googlePolylines.setIndexPolylineHighlight(polyline, index);
    }

    public getObjectPolyline(polyline: any): object {
        return this.googlePolylines.getObjectPolyline(polyline);
    }

    public addPolylineHighlightEvent(eventType: PolylineEventType, eventFunction: any): void {
        this.googlePolylines.addPolylineHighlightEvent(eventType, eventFunction);
    }

    /* Info Windows */
    public drawPopup(options: PopupOptions, marker?: any): any {
        return this.googlePopups.drawPopup(options, marker);
    }

    public alterPopup(popup: any, options: PopupOptions, marker?: any): any {
        return this.googlePopups.alterPopup(popup, options);
    }

    public alterPopupContent(popup: any, options: PopupOptions, marker?: any): void {
        this.googlePopups.alterPopupContent(popup, options, marker);
    }

    public closePopup(popup: any): void {
        this.googlePopups.closePopup(popup);
    }

    /* Map */
    public resizeMap(): void {
        this.googleMap.resizeMap();
    }

    public addEventMap(eventType: MapEventType, eventFunction: any): void {
        this.googleMap.addEventMap(eventType, eventFunction);
    }

    public removeEventMap(eventType: MapEventType): void {
        this.googleMap.removeEventMap(eventType);
    }

    public getZoom(): number {
        return this.googleMap.getZoom();
    }

    public setZoom(zoom: number): void {
        this.googleMap.setZoom(zoom)
    }

    public getCenter(): number[] {
        return this.googleMap.getCenter();
    }

    public setCenter(position: number[]): void {
        this.googleMap.setCenter(position);
    }

    public pixelsToLatLng(offsetx: number, offsety: number): number[] {
        return this.googleMap.pixelsToLatLng(offsetx, offsety);
    }

    /* Overlay */
    public drawOverlay(options: OverlayOptions, polygons: any) {
        return this.googleOverlays.drawOverlay(options, polygons);
    }

    public toggleOverlay(overlays: any[], show: boolean): void {
        this.googleOverlays.toggleOverlay(overlays, show);
    }
}

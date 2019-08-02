import { OverlayOptions } from '../..';
import { MapsApiLoaderService } from '../../utils/maps-api-loader.service';
import { CircleEventType, MapEventType, MarkerEventType, PolygonEventType, PolylineEventType } from '../dto/event-type';
import { MapType } from '../dto/map-type';
import CircleAlterOptions from '../features/circle/circle-alter-options';
import CircleOptions from '../features/circle/circle-options';
import GeoJsonOptions from '../features/geojson/geojson-options';
import MarkerClustererConfig from '../features/marker-clusterer/marker-clusterer-config';
import CircleMarkerOptions from '../features/marker/circle-marker-options';
import MarkerAlterOptions from '../features/marker/marker-alter-options';
import MarkerOptions from '../features/marker/marker-options';
import PolygonAlterOptions from '../features/polygons/polygon-alter-options';
import PolygonOptions from '../features/polygons/polygon-options';
import PolylineOptions from '../features/polyline/polyline-options';
import PopupOptions from '../features/popup/popup-options';
import LeafletCircles from './leaflet/leaflet-circle';
import LeafletGeoJson from './leaflet/leaflet-geojson';
import LeafletMap from './leaflet/leaflet-map';
import LeafletMarkers from './leaflet/leaflet-markers';
import LeafletOverlays from './leaflet/leaflet-overlay';
import LeafletPolygons from './leaflet/leaflet-polygons';
import LeafletPolylines from './leaflet/leaflet-polylines';
import LeafletPopups from './leaflet/leaflet-popup';
import IMapFunctions from './mapFunctions';

export default class Leaflet implements IMapFunctions {
    private leafletMarkers: LeafletMarkers;
    private leafletPolygons: LeafletPolygons;
    private leafletCircles: LeafletCircles;
    private leafletPolylines: LeafletPolylines;
    private leafletPopups: LeafletPopups;
    private leafletMap: LeafletMap;
    private leafletOverlays: LeafletOverlays;
    private leafletGeoJson: LeafletGeoJson;

    private mapsApiLoader: MapsApiLoaderService = new MapsApiLoaderService();

    constructor() { /* */ }

    public async initialize(mapType: MapType, params: any, elementId: string): Promise<any> {
        try {
            const api = await this.mapsApiLoader.loadApi(mapType, params);
            const leaflet = api;
            this.loadDependencies(params);
            await this.mapTimeout(1000);

            const mapOptions: any = {
                center: new leaflet.LatLng(-14, -54),
                editable: true,
                keyboard: false,
                maxZoom: params.wikimedia ? 18 : 19,
                minZoom: 4,
                zoom: 4,
                zoomControl: false
            };

            if (params.gestureHandling) {
                mapOptions.gestureHandling = true;
            }

            await this.mapTimeout(200);
            const osm = new leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', mapOptions);
            const wikimedia = new leaflet.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
                attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
            });

            const satelliteURL = 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                'World_Imagery/MapServer/tile/{z}/{y}/{x}';
            const satellite = L.tileLayer(satelliteURL, {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye,' +
                    ' Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                maxZoom: 18
            });
            mapOptions.layers = [params.wikimedia ? wikimedia : osm];

            const map = new leaflet.Map(elementId, mapOptions);
            const baseLayers = {
                Map: params.wikimedia ? wikimedia : osm,
                Satellite: satellite
            };

            if (params.mapTiles && params.mapTiles.length) {
                params.mapTiles.forEach((tile: any) => {
                    const layer = new leaflet.tileLayer(tile.url, tile.options);
                    baseLayers[tile.name] = layer;
                });
            }

            leaflet.control.layers(baseLayers, null, { position: 'topleft' }).addTo(map);
            leaflet.control.zoom({ position: 'bottomright' }).addTo(map);

            this.leafletMarkers = new LeafletMarkers(map, leaflet);
            this.leafletPolygons = new LeafletPolygons(map, leaflet);
            this.leafletCircles = new LeafletCircles(map, leaflet);
            this.leafletPopups = new LeafletPopups(map, leaflet);
            this.leafletPolylines = new LeafletPolylines(map, leaflet, this.leafletPopups);
            this.leafletMap = new LeafletMap(map, leaflet);
            this.leafletOverlays = new LeafletOverlays(map, leaflet, this.leafletPolygons);
            this.leafletGeoJson = new LeafletGeoJson(map, leaflet);
            return this;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    /* GEOJson */
    public loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any): void {
        this.leafletGeoJson.loadGEOJson(data, options, eventClick);
    }

    /* Markers */
    public drawMarker(options: MarkerOptions, eventClick: any): any {
        return this.leafletMarkers.drawMarker(options, eventClick);
    }

    public drawCircleMarker(options: CircleMarkerOptions, eventClick: any): any {
        return this.leafletMarkers.drawCircleMarker(options, eventClick);
    }

    public toggleMarkers(markers: any[], show: boolean, markerClusterer?: any): void {
        this.leafletMarkers.toggleMarkers(markers, show, markerClusterer);
    }

    public alterMarkerOptions(markers: any[], options: MarkerAlterOptions): void {
        this.leafletMarkers.alterMarkerOptions(markers, options);
    }

    public alterMarkerPosition(markers: any[], position: number[], addTransition: boolean): void {
        this.leafletMarkers.alterMarkerPosition(markers, position, addTransition);
    }

    public fitBoundsPositions(markers: any[]): void {
        this.leafletMarkers.fitBoundsPositions(markers);
    }

    public isMarkerOnMap(marker: any): boolean {
        return this.leafletMarkers.isMarkerOnMap(marker);
    }

    public setCenterMarker(marker: any): void {
        this.leafletMarkers.setCenterMarker(marker);
    }

    public addMarkerEvent(markers: any, eventType: MarkerEventType, eventFunction: any): void {
        this.leafletMarkers.addMarkerEvent(markers, eventType, eventFunction);
    }

    public removeMarkerEvent(markers: any, event: MarkerEventType): void {
        this.leafletMarkers.removeMarkerEvent(markers, event);
    }

    /* Marker Clusterer */
    public addMarkerClusterer(config: MarkerClustererConfig): any {
        return this.leafletMarkers.addMarkerClusterer(config);
    }

    public alterMarkerClustererConfig(markerClusterer: any, config: MarkerClustererConfig): void {
        this.leafletMarkers.alterMarkerClustererConfig(markerClusterer, config);
    }

    public refreshClusterer(markerClusterer: any): void {
        this.leafletMarkers.refreshClusterer(markerClusterer);
    }

    public addMarkerOnClusterer(marker: any, markerClusterer: any): void {
        this.leafletMarkers.addMarkerOnClusterer(marker, markerClusterer);
    }

    public removeMarkerFromClusterer(marker: any, markerClusterer: any): void {
        this.leafletMarkers.removeMarkerFromClusterer(marker, markerClusterer);
    }

    public clearMarkersClusterer(markerClusterer: any): void {
        this.leafletMarkers.clearMarkersClusterer(markerClusterer);
    }

    public countMarkersOnCluster(markerClusterer: any): number {
        return this.leafletMarkers.countMarkersOnCluster(markerClusterer);
    }

    /* Polygons */
    public drawPolygon(options: PolygonOptions, eventClick: any): any {
        return this.leafletPolygons.drawPolygon(options, eventClick);
    }

    public togglePolygons(polygons: any[], show: boolean): void {
        this.leafletPolygons.togglePolygons(polygons, show);
    }

    public alterPolygonOptions(polygons: any[], options: PolygonAlterOptions): void {
        this.leafletPolygons.alterPolygonOptions(polygons, options);
    }

    public fitBoundsPolygons(polygons: any): void {
        this.leafletPolygons.fitBoundsPolygons(polygons);
    }

    public setCenterPolygons(polygons: any): void {
        this.leafletPolygons.setCenterPolygons(polygons);
    }

    public isPolygonOnMap(polygon: any): boolean {
        return this.leafletPolygons.isPolygonOnMap(polygon);
    }

    public addPolygonEvent(polygons: any, eventType: PolygonEventType, eventFunction: any): void {
        this.leafletPolygons.addPolygonEvent(polygons, eventType, eventFunction);
    }

    public removePolygonEvent(polygons: any, event: PolygonEventType): void {
        this.leafletPolygons.removePolygonEvent(polygons, event);
    }

    /* Circles */
    public drawCircle(options: CircleOptions, eventClick: any): any {
        return this.leafletCircles.drawCircle(options, eventClick);
    }

    public toggleCircles(circles: any[], show: boolean): void {
        this.leafletCircles.toggleCircles(circles, show);
    }

    public alterCircleOptions(circles: any[], options: CircleAlterOptions): void {
        this.leafletCircles.alterCircleOptions(circles, options);
    }

    public fitBoundsCircles(circles: any) {
        this.leafletCircles.fitBoundsCircles(circles);
    }

    public isCircleOnMap(circle: any): boolean {
        return this.leafletCircles.isCircleOnMap(circle);
    }

    public getCircleCenter(circle: any): number[] {
        return this.leafletCircles.getCircleCenter(circle);
    }

    public addCircleEvent(circles: any, eventType: CircleEventType, eventFunction: any): void {
        this.leafletCircles.addCircleEvent(circles, eventType, eventFunction);
    }

    public removeCircleEvent(circles: any, event: CircleEventType): void {
        this.leafletCircles.removeCircleEvent(circles, event);
    }

    /* Polylines */
    public drawPolyline(options: PolylineOptions, eventClick: any): any {
        return this.leafletPolylines.drawPolyline(options, eventClick);
    }

    public drawPolylineWithNavigation(options: PolylineOptions, eventClick?: any): any {
        return this.leafletPolylines.drawPolylineWithNavigation(options, eventClick);
    }

    public togglePolylines(polylines: any, show: boolean): void {
        this.leafletPolylines.togglePolylines(polylines, show);
    }

    public alterPolylineOptions(polylines: any, options: PolylineOptions): void {
        this.leafletPolylines.alterPolylineOptions(polylines, options);
    }

    public fitBoundsPolylines(polylines: any): void {
        this.leafletPolylines.fitBoundsPolylines(polylines);
    }

    public isPolylineOnMap(polyline: any): boolean {
        return this.leafletPolylines.isPolylineOnMap(polyline);
    }

    public addPolylinePath(polylines: any, position: number[]): void {
        this.leafletPolylines.addPolylinePath(polylines, position);
    }

    public getPolylinePath(polyline: any): number[] {
        return this.leafletPolylines.getPolylinePath(polyline);
    }

    public removePolylineHighlight(): void {
        this.leafletPolylines.removePolylineHighlight();
    }

    public addPolylineEvent(polylines: any, eventType: PolylineEventType, eventFunction: any): void {
        this.leafletPolylines.addPolylineEvent(polylines, eventType, eventFunction);
    }

    public removePolylineEvent(polylines: any, event: PolylineEventType): void {
        this.leafletPolylines.removePolylineEvent(polylines, event);
    }

    public setIndexPolylineHighlight(polyline: any, index: number): void {
        this.leafletPolylines.setIndexPolylineHighlight(polyline, index);
    }

    public getObjectPolyline(polyline: any): object {
        return this.leafletPolylines.getObjectPolyline(polyline);
    }

    public addPolylineHighlightEvent(eventType: PolylineEventType, eventFunction: any): void {
        this.leafletPolylines.addPolylineHighlightEvent(eventType, eventFunction);
    }

    public getPolylineHighlightIndex(): number[] {
        return this.leafletPolylines.getPolylineHighlightIndex();
    }

    /* Popups */
    public drawPopup(options: PopupOptions, marker?: any): any {
        return this.leafletPopups.drawPopup(options, marker);
    }

    public alterPopup(popup: any, options: PopupOptions, marker?: any): any {
        return this.leafletPopups.alterPopup(popup, options, marker);
    }

    public alterPopupContent(popup: any, options: PopupOptions, marker?: any): any {
        this.leafletPopups.alterPopupContent(popup, options, marker);
    }

    public closePopup(popup: any): any {
        this.leafletPopups.closePopup(popup);
    }

    /* Map */
    public resizeMap(): void {
        this.leafletMap.resizeMap();
    }

    public addEventMap(eventType: MapEventType, eventFunction: any): void {
        this.leafletMap.addEventMap(eventType, eventFunction);
    }

    public removeEventMap(eventType: MapEventType): void {
        this.leafletMap.removeEventMap(eventType);
    }

    public getZoom(): number {
        return this.leafletMap.getZoom();
    }

    public setZoom(zoom: number): void {
        this.leafletMap.setZoom(zoom);
    }

    public getCenter(): number[] {
        return this.leafletMap.getCenter();
    }

    public setCenter(position: number[]): void {
        this.leafletMap.setCenter(position);
    }

    public pixelsToLatLng(offsetx: number, offsety: number): number[] {
        return this.leafletMap.pixelsToLatLng(offsetx, offsety);
    }

    /* Overlay */
    public drawOverlay(options: OverlayOptions, polygons: any): any {
        return this.leafletOverlays.drawOverlay(options, polygons);
    }

    public toggleOverlay(overlays: any[], show: boolean): void {
        this.leafletOverlays.toggleOverlay(overlays, show);
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
}

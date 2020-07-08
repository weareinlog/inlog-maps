import GoogleMaps from './models/apis/googleMaps';
import Leaflet from './models/apis/leaflet';
import IMapFunctions from './models/apis/mapFunctions';
import { MarkerEventType, CircleEventType, PolygonEventType, PolylineEventType, MapEventType } from './models/dto/event-type';
import { MapType } from './models/dto/map-type';
import CircleAlterOptions from './models/features/circle/circle-alter-options';
import CircleOptions from './models/features/circle/circle-options';
import GeoJsonOptions from './models/features/geojson/geojson-options';
import CircleMarkerOptions from './models/features/marker/circle-marker-options';
import MarkerAlterOptions from './models/features/marker/marker-alter-options';
import MarkerOptions from './models/features/marker/marker-options';
import OverlayOptions from './models/features/overlay/overlay-options';
import PolygonAlterOptions from './models/features/polygons/polygon-alter-options';
import PolygonOptions from './models/features/polygons/polygon-options';
import PolylineOptions from './models/features/polyline/polyline-options';
import PopupOptions from './models/features/popup/popup-options';
import MarkerClustererConfig from './models/features/marker-clusterer/marker-clusterer-config';

export default class Map {
    private markersList = {};
    private polygonsList = {};
    private circlesList = {};
    private polylinesList = {};
    private infoWindowList = {};
    private overlayList = {};
    private map: IMapFunctions;
    private markerClusterer = {};

    constructor() { /**/ }

    /**
     * Use this to initialize map
     * @param {InlogMaps.MapType} mapType
     * @param {any} options
     * @param {string} elementId default: 'inlog-map' [nullable]
     * @returns {Promisse<any>}
     */
    public initialize(mapType: MapType, options: any, elementId: string = 'inlog-map'): Promise<any> {
        this.map = mapType === MapType.Google ? new GoogleMaps() : new Leaflet();
        return this.map.initialize(mapType, options, elementId);
    }

    /* GEOJson */
    /**
     * Use this function to add GEOJSON to the currentMap
     * @param {object} data Geojson
     * @param {InlogMaps.GeoJsonOptions} options
     * @param {any} eventClick is a function callback on click [nullable]
     */
    public loadGEOJson(data: object, options: GeoJsonOptions, eventClick?: any): void {
        this.map.loadGEOJson(data, options, eventClick);
    }

    /* Markers */
    /**
     * Use this function to draw markers in the currentMap
     * @param {string} type
     * @param {InlogMaps.MarkerOptions} options
     * @param {any} eventClick is a function callback on click [nullable]
     */
    public drawMarker(type: string, options: MarkerOptions, eventClick?: any): void {
        const marker = this.map.drawMarker(options, eventClick);

        if (!this.markersList[type]) {
            this.markersList[type] = [];
        }
        marker.type = 'simple';
        this.markersList[type].push(marker);

        if (options.addClusterer) {
            if (!this.markerClusterer[type]) {
                this.addMarkerClusterer(type, new MarkerClustererConfig(true, 1, 10));
            }

            this.map.addMarkerOnClusterer(marker, this.markerClusterer[type]);
        }
    }

    /**
     * Use this function to draw circle markers in the currentMap
     * @param {string} type
     * @param {InlogMaps.CircleMarkerOptions} options
     * @param {any} eventClick is a function callback on click [nullable]
     */
    public drawCircleMarker(type: string, options: CircleMarkerOptions, eventClick?: any): void {
        const marker = this.map.drawCircleMarker(options, eventClick);

        if (!this.markersList[type]) {
            this.markersList[type] = [];
        }
        marker.type = 'circle';
        this.markersList[type].push(marker);
    }

    /**
     * Use this function to show/hide markers from a specific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toogle markers with the condition [nullable]
     */
    public toggleMarkers(show: boolean, type: string, condition?: any): void {
        const markers = this.getMarkers(type, condition);

        if (markers && markers.length) {
            this.map.toggleMarkers(markers, show, this.markerClusterer[type]);
        }
    }

    /**
     * Remove markers from the map and from internal list
     * @param {string} type
     * @param {any} condition remove markers with the condition [nullable]
     */
    public removeMarkers(type: string, condition?: any): void {
        if (this.markersList[type] && condition) {
            const markers = this.getMarkers(type, condition);

            // Hide markers with the condition
            this.map.toggleMarkers(markers, false, this.markerClusterer[type]);

            // Keep markers that doesn't have the condition
            this.markersList[type] = this.markersList[type].filter((marker: any) => !condition(marker.object));
        } else {
            if (this.markersList[type]) {
                this.map.toggleMarkers(this.markersList[type], false);
            }
            this.markersList[type] = [];
        }

        if (this.markersList[type].length === 0) {
            delete this.markersList[type];
        }
    }

    /**
     * Remove all markers from the map and from the internal list
     */
    public removeAllMarkers(): void {
        for (const type in this.markersList) {
            if (this.markersList.hasOwnProperty(type)) {
                this.removeMarkers(type);
            }
        }
    }

    /**
     * Use this function to alter marker style
     * @param {string} type
     * @param {InlogMaps.MarkerAlterOptions} options
     * @param {any} condition alter markers with the condition [nullable]
     */
    public alterMarkerOptions(type: string, options: MarkerAlterOptions, condition?: any): void {
        const markers = this.getMarkers(type, condition);

        if (markers && markers.length) {
            this.map.alterMarkerOptions(markers, options);
        }
    }

    /**
     * Use this functions to alterar marker position
     * @param {string } type
     * @param {number[]} position
     * @param {boolean} addTransition [nullable]
     * @param {any} condition [nullable]
     */
    public alterMarkerPosition(type: string, position: number[], addTransition?: boolean, condition?: any): void {
        const markers = this.getMarkers(type, condition);

        if (markers && markers.length) {
            this.map.alterMarkerPosition(markers, position, addTransition);
        }
    }

    /**
     * Use this function to fit bounds in the markers with the especified type
     * @param {string} type
     * @param {any} condition [nullable]
     * @param {boolean} onlyMarkersOnMap default true
     */
    public fitBoundsMarkers(type: string, condition?: any, onlyMarkersOnMap: boolean = true): void {
        let markers = this.getMarkers(type, condition);

        if (onlyMarkersOnMap) {
            markers = markers.filter((x: any) => this.map.isMarkerOnMap(x));
        }

        if (markers && markers.length) {
            this.map.fitBoundsPositions(markers);
        }
    }

    /**
     * Use this functions to set the center of the map on marker
     * @param {string} type
     * @param {any} condition center on marker with the condition [nullable]
     */
    public setCenterMarker(type: string, condition?: any): void {
        if (this.markersList[type] && condition) {
            const marker = this.markersList[type].find((marker: any) => condition(marker.object));

            // Center on the marker with the condition
            this.map.setCenterMarker(marker);
        } else {
            if (this.markersList[type] && this.markersList[type].length) {
                this.map.setCenterMarker(this.markersList[type][0]);
            }
        }
    }

    /**
     * This functions returns if marker exists
     * @param type
     * @param condition [nullable]
     * @returns {boolean}
     */
    public markerExists(type: string, condition?: any): boolean {
        const markers = this.getMarkers(type, condition);
        return markers && markers.length > 0;
    }

    /**
     * Use this function to count markers by type
     * @param {string} type
     * @param {boolean} onlyOnMap exclude hidden markers, default true
     * @param {any} condition
     * @returns {number}
     */
    public countMarkers(type: string, onlyOnMap: boolean = true, condition?: any): number {
        if (this.markerClusterer[type]) {
            return this.map.countMarkersOnCluster(this.markerClusterer[type]);
        }

        let markers = this.getMarkers(type, condition);
        if (onlyOnMap) {
            markers = markers.filter((x: any) => this.map.isMarkerOnMap(x));
        }

        return markers.length;
    }

    /**
     * This function add new events on marker
     * @param {string} type
     * @param {InlogMaps.MarkerEventType} event
     * @param {any} eventFunction
     * @param {any} condition [nullable]
     */
    public addMarkerEvent(type: string, event: MarkerEventType, eventFunction: any, condition?: any): void {
        const markers = this.getMarkers(type, condition);

        this.map.addMarkerEvent(markers, event, eventFunction);
    }

    /**
     * This function remove events of marker
     * @param {string} type
     * @param {InlogMaps.MarkerEventType} event
     * @param {any} condition [nullable]
     */
    public removeMarkerEvent(type: string, event: MarkerEventType, condition?: any): void {
        const markers = this.getMarkers(type, condition);

        this.map.removeMarkerEvent(markers, event);
    }

    /* Marker Clusterer */
    /**
     * Use this function to add MarkerClusterer on the map
     * @param {string} type same type of markers
     * @param {InlogMaps.MarkerClusterConfig} config
     */
    public addMarkerClusterer(type: string, config: MarkerClustererConfig): void {
        this.markerClusterer[type] = this.map.addMarkerClusterer(config);
    }

    /**
     * Use this function to alter clusterer options
     * @param type same type of markers
     * @param {InlogMaps.MarkerClusterConfig} config
     */
    public alterMarkerClustererConfig(type: string, config: MarkerClustererConfig): void {
        if (this.markerClusterer[type]) {
            this.map.alterMarkerClustererConfig(this.markerClusterer[type], config);
        }
    }

    /**
     * Use this function to redraw marker clusterer
     * @param type same type of markers
     */
    public refreshClusterer(type: string): void {
        if (this.markerClusterer[type]) {
            this.map.refreshClusterer(this.markerClusterer[type]);
        }
    }

    /**
     * Use this to clear markers on clusterer
     * @param type same type of markers
     */
    public clearMarkersClusterer(type: string): void {
        if (this.markerClusterer[type]) {
            this.map.clearMarkersClusterer(this.markerClusterer[type]);
        }
    }

    /* Polygons */
    /**
     * Use this function to draw polygons
     * @param {string} type
     * @param {InlogMaps.PolygonOptions} options
     * @param {any} eventClick [nullable]
     */
    public drawPolygon(type: string, options: PolygonOptions, eventClick?: any): void {
        const polygon = this.map.drawPolygon(options, eventClick);

        if (!this.polygonsList[type]) {
            this.polygonsList[type] = [];
        }
        this.polygonsList[type].push(polygon);
    }

    /**
     * Use this function to show/hide polygon from a especific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle polygon with the condition [nullable]
     */
    public togglePolygons(show: boolean, type: string, condition?: any): void {
        const polygons = this.getPolygons(type, condition);

        if (polygons && polygons.length) {
            this.map.togglePolygons(polygons, show);
        }
    }

    /**
     * Remove polygons from the map and from internal list
     * @param {string} type
     * @param {any} condition remove polygons with the condition [nullable]
     */
    public removePolygons(type: string, condition?: any): void {
        if (this.polygonsList[type] && condition) {
            const polygons = this.getPolygons(type, condition);

            // Hide markers with the condition
            this.map.togglePolygons(polygons, false);

            // Keep markers that doesn't have the condition
            this.polygonsList[type] = this.polygonsList[type].filter((polygon: any) => !condition(polygon.object));
        } else {
            if (this.polygonsList[type]) {
                this.map.togglePolygons(this.polygonsList[type], false);
            }
            this.polygonsList[type] = [];
        }

        if (this.polygonsList[type].length === 0) {
            delete this.polygonsList[type];
        }
    }

    /**
     * Remove all polygons from the map and from the internal list
     */
    public removeAllPolygons(): void {
        for (const type in this.polygonsList) {
            if (this.polygonsList.hasOwnProperty(type)) {
                this.removePolylines(type);
            }
        }
    }

    /**
     * Use this function to alter polygons options/style
     * @param {string} type
     * @param {InlogMaps.PolygonAlterOptions} options
     * @param {any} condition alter polygon with the condition [nullable]
     */
    public alterPolygonOptions(type: string, options: PolygonAlterOptions, condition?: any): void {
        const polygons = this.getPolygons(type, condition);

        if (polygons && polygons.length) {
            this.map.alterPolygonOptions(polygons, options);
        }
    }

    /**
     * Use this function to fit bounds of a polygon
     * @param {string} type
     * @param {any} condition fit polygon bounds with the condition [nullable]
     */
    public fitBoundsPolygons(type: string, condition?: any): void {
        const polygons = this.getPolygons(type, condition)
            .filter((polygon: any) => this.map.isPolygonOnMap(polygon));

        if (polygons && polygons.length) {
            this.map.fitBoundsPolygons(polygons);
        }
    }

    /**
     * Set center on polygon bounds
     * @param {string} type
     * @param {any} condition fit polygon bounds with the condition [nullable]
     */
    public setCenterPolygons(type: string, condition?: any): void {
        const polygons = this.getPolygons(type, condition)
            .filter((polygon: any) => this.map.isPolygonOnMap(polygon));

        if (polygons && polygons.length) {
            this.map.setCenterPolygons(polygons);
        }
    }

    /**
     * This functions returns if polygon exists
     * @param type
     * @param condition [nullable]
     * @returns {boolean}
     */
    public polygonExists(type: string, condition?: any): boolean {
        const polygons = this.getPolygons(type, condition);
        return polygons && polygons.length > 0;
    }

    /**
     * This function add new events on polygon
     * @param {string} type
     * @param {InlogMaps.PolygonEventType} event
     * @param {any} eventFunction
     * @param {any} condition [nullable]
     */
    public addPolygonEvent(type: string, event: PolygonEventType, eventFunction: any, condition?: any): void {
        const polygons = this.getPolygons(type, condition);

        this.map.addPolygonEvent(polygons, event, eventFunction);
    }

    /**
     * This function remove events of polygon
     * @param {string} type
     * @param {InlogMaps.PolygonEventType} event
     * @param {any} condition [nullable]
     */
    public removePolygonEvent(type: string, event: PolygonEventType, condition?: any): void {
        const polygons = this.getPolygons(type, condition);

        this.map.removePolygonEvent(polygons, event);
    }

    /* Circles */
    /**
     * Use this function to draw circles on the currentMap
     * @param {string} type
     * @param {InlogMaps.CircleOptions} options
     * @param {any} eventClick [nullable]
     */
    public drawCircle(type: string, options: CircleOptions, eventClick?: any): void {
        const circle = this.map.drawCircle(options, eventClick);

        if (!this.circlesList[type]) {
            this.circlesList[type] = [];
        }
        this.circlesList[type].push(circle);
    }

    /**
     * Use this function to show/hide circles from a especific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle circles with the condition [nullable]
     */
    public toggleCircles(show: boolean, type: string, condition?: any): void {
        const circles = this.getCircles(type, condition);

        if (circles && circles.length) {
            this.map.toggleCircles(circles, show);
        }
    }

    /**
     * Remove circles from the map and from internal list
     * @param {string} type
     * @param {any} condition remove circles with the condition [nullable]
     */
    public removeCircles(type: string, condition?: any): void {
        if (this.circlesList[type] && condition) {
            const circles = this.getCircles(type, condition);

            // Hide circles with the condition
            this.map.toggleCircles(circles, false);

            // Keep circles that doesn't have the condition
            this.circlesList[type] = this.circlesList[type].filter((circle: any) => !condition(circle.object));
        } else {
            if (this.circlesList[type]) {
                this.map.toggleCircles(this.circlesList[type], false);
            }
            this.circlesList[type] = [];
        }

        if (this.circlesList[type].length === 0) {
            delete this.circlesList[type];
        }
    }

    /**
     * Remove all circles from the map and from the internal list
     */
    public removeAllCircles(): void {
        for (const type in this.circlesList) {
            if (this.circlesList.hasOwnProperty(type)) {
                this.removeCircles(type);
            }
        }
    }

    /**
     * Use this function to alter circle options
     * @param {string} type
     * @param {InlogMaps.CircleAlterOptions} options
     * @param {any} condition alter circle with the condition [nullable]
     */
    public alterCircleOptions(type: string, options: CircleAlterOptions, condition?: any): void {
        const circles = this.getCircles(type, condition);

        if (circles && circles.length) {
            this.map.alterCircleOptions(circles, options);
        }
    }

    /**
     * Use this function to fit bounds of a polygon
     * @param {string} type
     * @param {any} condition fit polygon bounds with the condition [nullable]
     */
    public fitBoundsCircles(type: string, condition?: any): void {
        const circles = this.getCircles(type, condition)
            .filter((circle: any) => this.map.isCircleOnMap(circle));

        if (circles && circles.length) {
            this.map.fitBoundsCircles(circles);
        }
    }

    /**
     * This functions returns if circle exists
     * @param {string} type
     * @param {any} condition [nullable]
     * @returns {boolean}
     */
    public circleExists(type: string, condition?: any): boolean {
        const circles = this.getCircles(type, condition);
        return circles && circles.length > 0;
    }

    /**
     * This function return circle center
     * @param {string} type
     * @param {any} condition [nullable]
     * @returns {number[]}
     */
    public getCircleCenter(type: string, condition?: any): number[] {
        const circles = this.getCircles(type, condition);

        if (circles && circles.length) {
            return this.map.getCircleCenter(circles[0]);
        }

        return null;
    }

    /**
     * This function add new events on circle
     * @param {string} type
     * @param {InlogMaps.CircleEventType} event
     * @param {any} eventFunction
     * @param {any} condition [nullable]
     */
    public addCircleEvent(type: string, event: CircleEventType, eventFunction: any, condition?: any): void {
        const circles = this.getCircles(type, condition);

        this.map.addCircleEvent(circles, event, eventFunction);
    }

    /**
     * This function remove events of circle
     * @param {string} type
     * @param {InlogMaps.CircleEventType} event
     * @param {any} condition [nullable]
     */
    public removeCircleEvent(type: string, event: CircleEventType, condition?: any): void {
        const circles = this.getCircles(type, condition);

        this.map.removeCircleEvent(circles, event);
    }

    /* Polylines */
    /**
     * Use this function to draw polylines on the currentMap
     * @param {string} type
     * @param {InlogMaps.PolylineOptions} options
     * @param {any} eventClick [nullable]
     */
    public drawPolyline(type: string, options: PolylineOptions, eventClick?: any): void {
        const polyline = this.map.drawPolyline(options, eventClick);

        if (!this.polylinesList[type]) {
            this.polylinesList[type] = [];
        }
        this.polylinesList[type].push(polyline);
    }

    /**
     * Use this function to draw polylines with navigation on the currentMap
     * @param {string} type
     * @param {InlogMaps.PolylineOptions} options
     */
    public drawPolylineWithNavigation(type: string, options: PolylineOptions, eventClick?: any): void {
        const polyline = this.map.drawPolylineWithNavigation(options, eventClick);

        if (!this.polylinesList[type]) {
            this.polylinesList[type] = [];
        }
        this.polylinesList[type].push(polyline);
    }

    /**
     * Use this function to toggle polylines
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle polyline with the condition [nullable]
     */
    public togglePolylines(show: boolean, type: string, condition?: any): void {
        const polyline = this.getPolylines(type, condition);

        if (polyline && polyline.length) {
            this.map.togglePolylines(polyline, show);
        }
    }

    /**
     * Use this function to remove polylines
     * @param {string} type
     * @param {any} condition remove polyline with the condition [nullable]
     */
    public removePolylines(type: string, condition?: any): void {
        if (this.polylinesList[type] && condition) {
            const polylines = this.getPolylines(type, condition);

            // Hide markers with the condition
            this.map.togglePolylines(polylines, false);

            // Keep markers that doesn't have the condition
            this.polylinesList[type] = this.polylinesList[type].filter((polyline: any) => !condition(polyline.object));
        } else {
            if (this.polylinesList[type]) {
                this.map.togglePolylines(this.polylinesList[type], false);
            }
            this.polylinesList[type] = [];
        }

        if (this.polylinesList[type].length === 0) {
            delete this.polylinesList[type];
        }
    }

    /**
     * Remove all polylines from the map and from the internal list
     */
    public removeAllPolylines(): void {
        for (const type in this.polylinesList) {
            if (this.polylinesList.hasOwnProperty(type)) {
                this.removePolylines(type);
            }
        }
    }

    /**
     * Use this function to alter polyline options
     * @param {string} type
     * @param {InlogMaps.PolylineOptions} options
     * @param {any} condition alter polyline with the condition [nullable]
     */
    public alterPolylineOptions(type: string, options: PolylineOptions, condition?: any): void {
        const polyline = this.getPolylines(type, condition);

        if (polyline && polyline.length) {
            this.map.alterPolylineOptions(polyline, options);
        }
    }

    /**
     * Use this functions to fit polylines bounds
     * @param {string} type
     * @param {any} condition [nullable]
     */
    public fitBoundsPolylines(type: string, condition?: any): void {
        const polylines = this.getPolylines(type, condition)
            .filter((polyline: any) => this.map.isPolylineOnMap(polyline));

        if (polylines && polylines.length) {
            this.map.fitBoundsPolylines(polylines);
        }
    }

    /**
     * This functions returns if polyline exists
     * @param {string} type
     * @param {any} condition [nullable]
     * @returns {boolean}
     */
    public polylineExists(type: string, condition?: any): boolean {
        const polylines = this.getPolylines(type, condition);
        return polylines && polylines.length > 0;
    }

    /**
     * Use this function to add more paths to a polyline
     * @param {string} type
     * @param {number[]} position
     * @param {any} condition [nullable]
     */
    public addPolylinePath(type: string, position: number[], condition?: any): void {
        const polyline = this.getPolylines(type, condition);

        if (polyline && polyline.length) {
            this.map.addPolylinePath(polyline, position);
        } else {
            const options = new PolylineOptions();
            options.addToMap = true;

            this.drawPolyline(type, options, null);
        }
    }

    /**
     * Use this function to get the path of some polyline
     * @param {string} type
     * @param {any} condition
     * @returns {number[]}
     */
    public getPolylinePath(type: string, condition?: any): number[] {
        const polyline = this.getPolylines(type, condition);

        if (polyline && polyline.length) {
            return this.map.getPolylinePath(polyline[0]);
        }
    }

    /**
     * Use this function to clear polyline selected from the currentMap
     */
    public removePolylineHighlight(): void {
        this.map.removePolylineHighlight();
    }

    /**
     * Use this function to add listeners on polyline
     * @param {string} type
     * @param {InlogMaps.PolylineEventType} event
     * @param {any} eventFunction
     * @param {any} condition [nullable]
     */
    public addPolylineEvent(type: string, event: PolylineEventType, eventFunction: any, condition?: any): void {
        const polyline = this.getPolylines(type, condition);

        this.map.addPolylineEvent(polyline, event, eventFunction);
    }

    /**
     * Use this function to remove listeners of polyline
     * @param {string} type
     * @param {InlogMaps.PolylineEventType} event
     * @param {any} condition [nullable]
     */
    public removePolylineEvent(type: string, event: PolylineEventType, condition?: any): void {
        const polyline = this.getPolylines(type, condition);

        this.map.removePolylineEvent(polyline, event);
    }

    /**
     * Use this function to set position of polyline highlight
     * @param {string} type
     * @param {number} initialIndex
     * @param {any} condition [nullable]
     */
    public setIndexPolylineHighlight(type: string, initialIndex: number, condition?: any) {
        const polylines = this.getPolylines(type, condition);

        if (polylines && polylines.length) {
            this.map.setIndexPolylineHighlight(polylines[0], initialIndex);
        }
    }

    /**
     *
     * @param {string} type
     * @param {any} condition
     * @returns {object}
     */
    public getObjectPolyline(type: string, condition?: any): object {
        const polylines = this.getPolylines(type, condition);

        if (polylines && polylines.length) {
            return this.map.getObjectPolyline(polylines[0]);
        } else {
            return null;
        }
    }

    /**
     * Use this function to add events on polyline highligtht / selected polyline
     * @param {InlogMaps.PolylineEventType} event
     * @param {any} eventFunction
     */
    public addPolylineHighlightEvent(event: PolylineEventType, eventFunction: any) {
        this.map.addPolylineHighlightEvent(event, eventFunction);
    }

    /**
     * Use this function to get initial and final index of the polyline highlight
     * @returns {number[]} returns an array with initial index and final index
     */
    public getPolylineHighlightIndex(): number[] {
        return this.map.getPolylineHighlightIndex();
    }

    /* Info Windows */
    /**
     * Use this function to draw popups on the currentMap
     * @param {string} type
     * @param {InlogMaps.PopupOptions} options
     */
    public drawPopup(type: string, options: PopupOptions): void {
        let marker: any = null;
        if (options.marker) {
            const markers = this.getMarkers(options.marker, options.conditionMarker);
            marker = markers[0];
        }

        let popup: any;
        if (this.infoWindowList[type]) {
            popup = this.map.alterPopup(this.infoWindowList[type], options, marker);
        } else {
            popup = this.map.drawPopup(options, marker);
        }

        this.infoWindowList[type] = popup;
    }

    /**
     * Use this function to alter popups
     * @param {string} type
     * @param {InlogMaps.PopupOptions} options
     */
    public alterPopup(type: string, options: PopupOptions): void {
        const popups = this.infoWindowList[type];

        let markers: any;
        if (options.marker) {
            markers = this.getMarkers(options.marker, options.conditionMarker);
        }

        if (popups) {
            this.map.alterPopupContent(popups, options, markers ? markers[0] : null);
        }
    }

    /**
     *
     * @param {string} type
     * @returns {object}
     */
    public getObjectOpenPopup(type: string): object {
        return this.infoWindowList[type] ? this.infoWindowList[type].object : null;
    }

    /**
     * Use this function to close popup by type
     * @param {string} type
     */
    public closePopup(type: string): void {
        if (this.infoWindowList[type]) {
            this.map.closePopup(this.infoWindowList[type])
        }
    }

    /**
     * Use this function to close all popups
     * @param {string} type
     */
    public closeAllPopups(): void {
        for (const type in this.infoWindowList) {
            if (this.infoWindowList.hasOwnProperty(type)) {
                this.closePopup(type);
            }
        }
    }

    /* Map */
    /**
     * Resize de map based on html size
     */
    public resizeMap(): void {
        this.map.resizeMap();
    }

    /**
     * Use this function to add event clicks on the currentMap
     * @param {InlogMaps.MapEventType} eventType
     * @param eventFunction function callback
     */
    public addEventMap(eventType: MapEventType, eventFunction: any): void {
        this.map.addEventMap(eventType, eventFunction);
    }

    /**
     * Use this function to remove event clicks from the currentMap
     * @param {InlogMaps.MapEventType} eventType
     */
    public removeEventMap(eventType: MapEventType): void {
        this.map.removeEventMap(eventType);
    }

    /**
     * Returns the current zoom level of the map view
     * @returns {number}
     */
    public getZoom(): number {
        return this.map.getZoom();
    }

    /**
     * Set the current zoom level of the map view
     * @param {number} zoom
     */
    public setZoom(zoom: number): void {
        this.map.setZoom(zoom);
    }

    /**
     * Returns the center position of the map
     * @returns {number[]}
     */
    public getCenter(): number[] {
        return this.map.getCenter();
    }

    /**
     * Set the position center of the map
     * @param {number[]} position
     */
    public setCenter(position: number[]): void {
        this.map.setCenter(position);
    }

    /**
     * Returns the coordinates from pixels
     * @param {number} offsetx
     * @param {number} offsety
     * @returns {number[]}
     */
    public pixelsToLatLng(offsetx: number, offsety: number): number[] {
        return this.map.pixelsToLatLng(offsetx, offsety);
    }

    /**
     * Use this functions to fit bounds on elements with same type and condition
     * @param {string} type
     * @param {any} condition [nullable]
     */
    public fitBoundsElements(type: string, condition?: any): void {
        const markers = this.getMarkers(type, condition)
            .filter((marker: any) => this.map.isMarkerOnMap(marker));

        const circles = this.getCircles(type, condition)
            .filter((circle: any) => this.map.isCircleOnMap(circle));

        const polygons = this.getPolygons(type, condition)
            .filter((polygon: any) => this.map.isPolygonOnMap(polygon));

        this.map.fitBoundsElements(markers, circles, polygons);
    }

    /* Overlay */
    /**
     * Use this function to dray overlays on the current map
     * @param {string} type
     * @param {InlogMaps.OverlayOptions} options
     */
    public drawOverlay(type: string, options: OverlayOptions): void {
        let overlay = null;

        if (options.polygon) {
            const polygons = this.getPolygons(options.polygon, options.conditionPolygon);

            if (polygons && polygons.length) {
                overlay = this.map.drawOverlay(options, polygons);
            }
        } else {
            overlay = this.map.drawOverlay(options);
        }

        if (overlay != null) {
            if (!this.overlayList[type]) {
                this.overlayList[type] = [];
            }
            this.overlayList[type].push(overlay);
        }
    }

    /**
     * Use this function to show or hide overlay
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition [nullable]
     */
    public toggleOverlay(show: boolean, type: string, condition?: any): void {
        const overlays = this.getOverlays(type, condition);

        if (overlays && overlays.length) {
            this.map.toggleOverlay(overlays, show);
        }
    }

    /**
     * Remove overlays from the map and from internal list
     * @param {string} type
     * @param {any} condition remove overlays with the condition [nullable]
     */
    public removeOverlays(type: string, condition?: any): void {
        if (this.overlayList[type] && condition) {
            const overlays = this.getOverlays(type, condition);

            // Hide markers with the condition
            this.map.toggleOverlay(overlays, false);

            // Keep markers that doesn't have the condition
            this.overlayList[type] = this.overlayList[type].filter((overlay: any) => !condition(overlay.object));
        } else {
            if (this.overlayList[type]) {
                this.map.toggleOverlay(this.overlayList[type], false);
            }
            this.overlayList[type] = [];
        }

        if (this.overlayList[type].length === 0) {
            delete this.overlayList[type];
        }
    }

    /**
     * Remove all overlays from the map and from the internal list
     */
    public removeAllOverlays(): void {
        for (const type in this.overlayList) {
            if (this.overlayList.hasOwnProperty(type)) {
                this.removeOverlays(type);
            }
        }
    }

    /* Private Methods */
    private getMarkers(type: string, condition: any): any[] {
        const markers = this.markersList[type];

        if (markers && markers.length) {
            return condition ? markers.filter((marker: any) => condition(marker.object)) : markers;
        } else return [];
    }

    private getPolygons(type: string, condition: any): any[] {
        const polygons = this.polygonsList[type];

        if (polygons && polygons.length) {
            return condition ? polygons.filter((polygon: any) => condition(polygon.object)) : polygons;
        } else return [];
    }

    private getCircles(type: string, condition: any): any[] {
        const circles = this.circlesList[type];

        if (circles && circles.length) {
            return condition ? circles.filter((circle: any) => condition(circle.object)) : circles;
        } else return [];
    }

    private getPolylines(type: string, condition: any): any[] {
        const polylines = this.polylinesList[type];

        if (polylines && polylines.length) {
            return condition ? polylines.filter((polyline: any) => condition(polyline.object)) : polylines;
        } else return [];
    }

    private getOverlays(type: string, condition: any): any[] {
        const overlays = this.overlayList[type];

        if (overlays && overlays.length) {
            return condition ? overlays.filter((overlay: any) => condition(overlay.object)) : overlays;
        } else return [];
    }
}

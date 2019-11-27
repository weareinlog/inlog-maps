import { MapType } from './models/dto/map-type';
import CircleAlterOptions from './models/features/circle/circle-alter-options';
import CircleOptions from './models/features/circle/circle-options';
import GeoJsonOptions from './models/features/geojson/geojson-options';
import CircleMarkerOptions from './models/features/marker/circle-marker-options';
import MarkerAlterOptions from './models/features/marker/marker-alter-options';
import MarkerOptions from './models/features/marker/marker-options';
import PolygonAlterOptions from './models/features/polygons/polygon-alter-options';
import PolygonOptions from './models/features/polygons/polygon-options';
import PolylineOptions from './models/features/polyline/polyline-options';
import PopupOptions from './models/features/popup/popup-options';
export default class Map {
    mapType: typeof MapType;
    private markersList;
    private polygonsList;
    private circlesList;
    private polylinesList;
    private infoWindowList;
    private map;
    constructor();
    /**
     * Use this to initialize map
     * @param mapType {inlogMaps.MapType}
     * @param options {any}
     */
    initialize(mapType: MapType, options: any): Promise<any>;
    /**
     * Use this function to add GEOJSON to the currentMap
     * @param {object} data Geojson
     * @param {inlogMaps.GeoJsonOptions} options
     * @param {any} eventClick is a function callback on click
     */
    loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any): void;
    /**
     * Use this function to draw markers in the currentMap
     * @param {string} type
     * @param {inlogMaps.MarkerOptions} options
     * @param {any} eventClick is a function callback on click
     */
    drawMarker(type: string, options: MarkerOptions, eventClick: any): void;
    /**
     * Use this function to fit bounds in the markers with the especified type
     * @param {string} type
     */
    fitBoundsMarkers(type: string): void;
    /**
     * Use this function to draw circle markers in the currentMap
     * @param {string} type
     * @param {inlogMaps.CircleMarkerOptions} options
     * @param {any} eventClick is a function callback on click
     */
    drawCircleMarker(type: string, options: CircleMarkerOptions, eventClick: any): void;
    /**
     * Use this function to show/hide markers from a specific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toogle markers with the condition
     */
    toggleMarkers(show: boolean, type: string, condition?: any): void;
    /**
     * Use this function to alter marker style
     * @param {string} type
     * @param {inlogMaps.MarkerAlterOptions} options
     * @param {any} condition alter markers with the condition
     */
    alterMarkerOptions(type: string, options: MarkerAlterOptions, condition?: any): void;
    /**
     * Use this function to draw or modify markers in the map
     * @param {string} type
     * @param {inlogMaps.MarkerOptions} options
     * @param {any} eventClick is a function callback on click
     * @param {any} condition draw or alter markers with the condition
     */
    /**
     * Remove markers from the map and from internal list
     * @param {string} type
     * @param {any} condition remove markers with the condition
     */
    removeMarkers(type: string, condition?: any): void;
    /**
     * Use this function to draw polygons
     * @param {string} type
     * @param {inlogMaps.PolygonOptions} options
     * @param {any} eventClick
     */
    drawPolygon(type: string, options: PolygonOptions, eventClick: any): void;
    /**
     * Use this function to fit bounds of a polygon
     * @param {string} type
     * @param {any} condition fit polygon bounds with the condition
     */
    fitBoundsPolygon(type: string, condition?: any): void;
    /**
     * Use this function to show/hide polygon from a especific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle polygon with the condition
     */
    togglePolygons(show: boolean, type: string, condition?: any): void;
    /**
     * Use this function to alter polygons options/style
     * @param {string} type
     * @param {inlogMaps.PolygonAlterOptions} options
     * @param {any} condition alter polygon with the condition
     */
    alterPolygonOptions(type: string, options: PolygonAlterOptions, condition?: any): void;
    /**
     * Use this function to draw polylines on the currentMap
     * @param {string} type
     * @param {inlogMaps.PolylineOptions} options
     * @param {any} eventClick
     */
    drawPolyline(type: string, options: PolylineOptions, eventClick: any): void;
    /**
     * Use this function to draw polylines with navigation on the currentMap
     * @param {string} type
     * @param {inlogMaps.PolylineOptions} options
     * @param {any} eventClick
     */
    drawPolylineWithNavigation(type: string, options: PolylineOptions, eventClick?: any): void;
    /**
     * Use this function to add more paths to a polyline
     * @param {string} type
     * @param {number[]} position
     */
    addPolylinePath(type: string, position: number[]): void;
    /**
     * Use this function to clear polyline selected from the currentMap
     */
    removePolylineHighlight(): void;
    /**
     * Use this function to toggle polylines
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle polyline with the condition
     */
    togglePolyline(show: boolean, type: string, condition?: any): void;
    /**
     * Use this function to remove polylines
     * @param {string} type
     * @param {any} condition remove polyline with the condition
     */
    removePolyline(type: string, condition?: any): void;
    /**
     * Use this function to alter polyline options
     * @param {string} type
     * @param {inlogMaps.PolylineOptions} options
     * @param {any} condition alter polyline with the condition
     */
    alterPolylineOptions(type: string, options: PolylineOptions, condition?: any): void;
    /**
     * Use this function to draw circles on the currentMap
     * @param {string} type
     * @param {inlogMaps.CircleOptions} options
     * @param {any} eventClick
     */
    drawCircle(type: string, options: CircleOptions, eventClick: any): void;
    /**
     * Use this function to show/hide circles from a especific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle circles with the condition
     */
    toggleCircles(show: boolean, type: string, condition?: any): void;
    /**
     * Use this function to alter circle options
     * @param {string} type
     * @param {inlogMaps.CircleAlterOptions} options
     * @param {any} condition alter circle with the condition
     */
    alterCircleOptions(type: string, options: CircleAlterOptions, condition?: any): void;
    /**
     * Use this function to draw popups on the currentMap
     * @param {string} type
     * @param {inlogMaps.PopupOptions} options
     */
    drawPopup(type: string, options: PopupOptions): void;
    /**
     * Use this function to alter popups
     * @param {string} type
     * @param {inlogMaps.PopupOptions} options
     */
    alterPopup(type: string, options: PopupOptions): void;
    /**
     * Use this function to add event clicks on the currentMap
     * @param {any} eventClick
     */
    addClickMap(eventClick: any): void;
    /**
     * Use this function to remove event clicks from the currentMap
     */
    removeClickMap(): void;
    private getMarkers;
    private getPolygons;
    private getCircles;
    private getPolylines;
}

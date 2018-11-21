import GoogleMaps from './models/apis/googleMaps';
import Leaflet from './models/apis/leaflet';
import IMapFunctions from './models/apis/mapFunctions';
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
    public mapType = MapType;
    private markersList = {};
    private polygonsList = {};
    private circlesList = {};
    private polylinesList = {};
    private infoWindowList = {};
    private map: IMapFunctions;

    constructor() { /**/ }

    /**
     * Use this to initialize map
     * @param mapType {inlogMaps.MapType}
     * @param options {any}
     */
    public initialize(mapType: MapType, options: any): Promise<any> {
        this.map = mapType === MapType.Google ? new GoogleMaps() : new Leaflet();
        return this.map.initialize(mapType, options);
    }

    /* GEOJson */
    /**
     * Use this function to add GEOJSON to the currentMap
     * @param {object} data Geojson
     * @param {inlogMaps.GeoJsonOptions} options
     * @param {any} eventClick is a function callback on click
     */
    public loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any) {
        this.map.loadGEOJson(data, options, eventClick);
    }

    /* Markers */
    /**
     * Use this function to draw markers in the currentMap
     * @param {string} type
     * @param {inlogMaps.MarkerOptions} options
     * @param {any} eventClick is a function callback on click
     */
    public drawMarker(type: string, options: MarkerOptions, eventClick: any) {
        const marker = this.map.drawMarker(options, eventClick);

        if (!this.markersList[type]) {
            this.markersList[type] = [];
        }
        marker.type = 'simple';
        this.markersList[type].push(marker);
    }

    /**
     * Use this function to fit bounds in the markers with the especified type
     * @param {string} type
     */
    public fitBoundsMarkers(type: string) {
        if (!this.markersList[type]) {
            this.markersList[type] = [];
        }

        this.map.fitBoundsPositions(this.markersList[type].filter((x) => x.map !== null));
    }

    /**
     * Use this function to draw circle markers in the currentMap
     * @param {string} type
     * @param {inlogMaps.CircleMarkerOptions} options
     * @param {any} eventClick is a function callback on click
     */
    public drawCircleMarker(type: string, options: CircleMarkerOptions, eventClick: any) {
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
     * @param {any} condition toogle markers with the condition
     */
    public toggleMarkers(show: boolean, type: string, condition?: any) {
        const markers = condition ? this.getMarkers(type, condition) : this.markersList[type];

        if (markers) {
            this.map.toggleMarkers(markers, show);
        }
    }

    /**
     * Use this function to alter marker style
     * @param {string} type
     * @param {inlogMaps.MarkerAlterOptions} options
     * @param {any} condition alter markers with the condition
     */
    public alterMarkerOptions(type: string, options: MarkerAlterOptions, condition?: any) {
        const markers = condition ? this.getMarkers(type, condition) : this.markersList[type];

        if (markers && markers.length > 0) {
            this.map.alterMarkerOptions(markers, options);
        }
    }

    /**
     * Use this function to draw or modify markers in the map
     * @param {string} type
     * @param {inlogMaps.MarkerOptions} options
     * @param {any} eventClick is a function callback on click
     * @param {any} condition draw or alter markers with the condition
     */
    // public drawOrAlterMarkers(type: string, options: MarkerOptions, eventClick: any, condition?: any) {
    //     const markers = (this.markersList[type] || []).filter((marker) => condition(marker.object));

    //     if (markers) {
    //         this.map.alterMarkerOptions(markers, options);
    //     } else {
    //         this.drawMarker(type, options, eventClick);
    //     }
    // }

    /**
     * Remove markers from the map and from internal list
     * @param {string} type
     * @param {any} condition remove markers with the condition
     */
    public removeMarkers(type: string, condition?: any) {
        if (!this.markersList[type]) {
            this.markersList[type] = [];
        } else {
            const markers = this.markersList[type].filter((marker) => condition(marker.object));

            // Hide markers with the condition
            this.map.toggleMarkers(markers, false);

            // Keep markers that doesn't have the condition
            this.markersList[type] = this.markersList[type].filter((marker) => !condition(marker.object));
        }
    }

    /* Polygons */
    /**
     * Use this function to draw polygons
     * @param {string} type
     * @param {inlogMaps.PolygonOptions} options
     * @param {any} eventClick
     */
    public drawPolygon(type: string, options: PolygonOptions, eventClick: any) {
        const polygon = this.map.drawPolygon(options, eventClick);

        if (!this.polygonsList[type]) {
            this.polygonsList[type] = [];
        }
        this.polygonsList[type].push(polygon);
    }

    /**
     * Use this function to fit bounds of a polygon
     * @param {string} type
     * @param {any} condition fit polygon bounds with the condition
     */
    public fitBoundsPolygon(type: string, condition?: any) {
        const polygons = condition ? this.polygonsList[type] : this.getPolygons(type, condition);
        polygons.array.forEach((polygon) => this.map.fitBoundsPolygon(polygon));
    }

    /**
     * Use this function to show/hide polygon from a especific type
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle polygon with the condition
     */
    public togglePolygons(show: boolean, type: string, condition?: any) {
        const polygons = condition ? this.polygonsList[type] : this.getPolygons(type, condition);

        if (polygons) {
            this.map.togglePolygons(polygons, show);
        }
    }

    /**
     * Use this function to alter polygons options/style
     * @param {string} type
     * @param {inlogMaps.PolygonAlterOptions} options
     * @param {any} condition alter polygon with the condition
     */
    public alterPolygonOptions(type: string, options: PolygonAlterOptions, condition?: any) {
        const polygons = condition ? this.polygonsList[type] : this.getPolygons(type, condition);

        if (polygons) {
            this.map.alterPolygonOptions(polygons, options);
        }
    }

    /* Polylines */
    /**
     * Use this function to draw polylines on the currentMap
     * @param {string} type
     * @param {inlogMaps.PolylineOptions} options
     * @param {any} eventClick
     */
    public drawPolyline(type: string, options: PolylineOptions, eventClick: any) {
        const polyline = this.map.drawPolyline(options, eventClick);
        this.polylinesList[type] = polyline;
    }

    /**
     * Use this function to draw polylines with navigation on the currentMap
     * @param {string} type
     * @param {inlogMaps.PolylineOptions} options
     */
    public drawPolylineWithNavigation(type: string, options: PolylineOptions) {
        const polyline = this.map.drawPolylineWithNavigation(options);
        this.polylinesList[type] = polyline;
    }

    /**
     * Use this function to add more paths to a polyline
     * @param {string} type
     * @param {number[]} position
     */
    public addPolylinePath(type: string, position: number[]) {
        const options = new PolylineOptions();
        options.addToMap = true;

        if (!this.polylinesList[type]) {
            this.drawPolyline(type, options, null);
        }
        const polyline = this.polylinesList[type];

        if (polyline) {
            this.map.addPolylinePath(polyline, position);
        }
    }

    /**
     * Use this function to clear polyline selected from the currentMap
     */
    public removePolylineHighlight() {
        this.map.removePolylineHighlight();
    }

    /**
     * Use this function to toggle polylines
     * @param {boolean} show
     * @param {string} type
     * @param {any} condition toggle polyline with the condition
     */
    public togglePolyline(show: boolean, type: string, condition?: any) {
        const polyline = condition ? this.polylinesList[type] : this.getPolylines(type, condition);

        if (polyline) {
            this.map.togglePolyline(polyline, show);
        }
    }

    /**
     * Use this function to remove polylines
     * @param {string} type
     * @param {any} condition remove polyline with the condition
     */
    public removePolyline(type: string, condition?: any) {
        const polyline = condition ? this.polylinesList[type] : this.getPolylines(type, condition);

        if (polyline) {
            this.map.togglePolyline(polyline, false);
            this.map.clearListenersPolyline(polyline);
        }

        this.polygonsList[type] = null;
    }

    /**
     * Use this function to alter polyline options
     * @param {string} type
     * @param {inlogMaps.PolylineOptions} options
     * @param {any} condition alter polyline with the condition
     */
    public alterPolylineOptions(type: string, options: PolylineOptions, condition?: any) {
        const polyline = condition ? this.polylinesList[type] : this.getPolylines(type, condition);

        if (polyline) {
            this.map.alterPolylineOptions(polyline, options);
        }
    }

    /* Circles */
    /**
     * Use this function to draw circles on the currentMap
     * @param {string} type
     * @param {inlogMaps.CircleOptions} options
     * @param {any} eventClick
     */
    public drawCircle(type: string, options: CircleOptions, eventClick: any) {
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
     * @param {any} condition toggle circles with the condition
     */
    public toggleCircles(show: boolean, type: string, condition?: any) {
        const circles = condition ? this.circlesList[type] : this.getCircles(type, condition);

        if (circles) {
            this.map.toggleCircles(circles, show);
        }
    }

    /**
     * Use this function to alter circle options
     * @param {string} type
     * @param {inlogMaps.CircleAlterOptions} options
     * @param {any} condition alter circle with the condition
     */
    public alterCircleOptions(type: string, options: CircleAlterOptions, condition?: any) {
        const circles = condition ? this.circlesList[type] : this.getCircles(type, condition);

        if (circles) {
            this.map.alterCircleOptions(circles, options);
        }
    }

    /* Info Windows */
    /**
     * Use this function to draw popups on the currentMap
     * @param {string} type
     * @param {inlogMaps.PopupOptions} options
     */
    public drawPopup(type: string, options: PopupOptions) {

        if (this.infoWindowList[type]) {
            this.map.alterPopup(this.infoWindowList[type], options);
        } else {
            const infoWindow = this.map.drawPopup(options);

            this.infoWindowList[type] = infoWindow;
        }
    }

    /**
     * Use this function to alter popups
     * @param {string} type
     * @param {inlogMaps.PopupOptions} options
     */
    public alterPopup(type: string, options: PopupOptions) {
        const popups = this.infoWindowList[type];

        if (popups) {
            this.map.alterPopup(popups, options);
        }
    }

    /* Map */
    /**
     * Use this function to add event clicks on the currentMap
     * @param {any} eventClick
     */
    public addClickMap(eventClick: any) {
        this.map.addClickMap(eventClick);
    }

    /**
     * Use this function to remove event clicks from the currentMap
     */
    public removeClickMap() {
        this.map.removeClickMap();
    }

    private getMarkers(type: string, condition: any) {
        const markers = this.markersList[type];
        return markers.filter((marker) => condition(marker.object));
    }

    private getPolygons(type: string, condition: any) {
        const polygons = this.polygonsList[type];
        return polygons.filter((polygon) => condition(polygon.object));
    }

    private getCircles(type: string, condition: any) {
        const circles = this.circlesList[type];
        return circles.filter((circle) => condition(circle.object));
    }

    private getPolylines(type: string, condition: any) {
        const polylines = this.polylinesList[type];
        return polylines.filter((polyline) => condition(polyline.object));
    }
}

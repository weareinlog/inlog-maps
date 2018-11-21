import GoogleMaps from './google-maps';
import Leaflet from './leaflet';

export default class Map {
    constructor(mapType) {
        this.map = mapType === 'Google' ? new GoogleMaps() : new Leaflet();

        // generic lists
        this._markersList = {};
        this._polygonsList = {};
        this._circlesList = {};
        this._polylinesList = {};
        this._infoWindowList = {};
    }

    /* GEOJson */
    /**
     * Use this function to add GEOJSON to the map
     * @param {string} data
     * @param {*} options are the created object's parameters
     * {
     *      editable: boolean,
     *      draggable: boolean
     * }
     * @param {function} eventClick is a function callback to the action on click
     */
    loadGEOJson(data, options, eventClick) {
        let self = this;

        self.map._loadGEOJson(data, options, eventClick);
    }

    /* Markers */
    /**
     * Use this function to draw markers in the map
     * @param {tring} type is the type of the marker to help you find it later
     * @param {inlogMaps.MarkerOptions} options are the parameters of the marker
     * @param {function} eventClick is a function callback to the action on click
     */
    drawMarker(type, options, eventClick) {
        let self = this;
        let marker = self.map._drawMarker(options, eventClick);

        if (!self._markersList[type]) {
            self._markersList[type] = [];
        }
        marker.type = 'simple';
        self._markersList[type].push(marker);
    }

    /**
     * Use this function to draw circle markers in the map
     * @param {string} type is the type of the marker to help you find it later
     * @param {inlogMaps.CircleMarkerOptions} options are the parameters of the circle marker
     * @param {function} eventClick is a function callback to the action on click
     */
    drawCircleMarker(type, options, eventClick) {
        let self = this;
        let marker = self.map._drawCircleMarker(options, eventClick);

        if (!self._markersList[type]) {
            self._markersList[type] = [];
        }
        marker.type = 'circle';
        self._markersList[type].push(marker);
    }

    /**
     * Use this function to show/hide markers from a especific type
     * @param {boolean} show
     * @param {string} type is the type of the marker you created
     */
    showMarkers(show, type) {
        let self = this;
        let markers = self._markersList[type];

        if (markers) {
            self.map._showMarkers(markers, show);
        }
    }

    /**
     * Use this function to alter marker style
     * @param {string} type is the type of the marker to help you find it later
     * @param {inlogMaps.MarkerAlterOptions} options are the style parameters of the marker
     */
    alterMarkerOptions(type, options) {
        let self = this;
        let markers = self._markersList[type];

        if (markers) {
            self.map._alterMarkerOptions(markers, options);
        }
    }

    /* Polygons */
    /**
     * Use this function to draw polygons
     * @param {string} type is the type of the polygon to help you find it later
     * @param {inlogMaps.PolygonOptions} options are the parameters of the polygon
     * @param {function} eventClick
     */
    drawPolygon(type, options, eventClick) {
        let self = this;
        let polygon = self.map._drawPolygon(options, eventClick);

        if (!self._polygonsList[type]) {
            self._polygonsList[type] = [];
        }
        self._polygonsList[type].push(polygon);
    }

    /**
     * Use this function to show/hide polygon from a especific type
     * @param {boolean} show
     * @param {string} type
     */
    showPolygons(show, type) {
        let self = this;
        let polygons = self._polygonsList[type];

        if (polygons) {
            self.map._showPolygons(polygons, show);
        }
    }

    /**
     * Use this function to alter polygons options/style
     * @param {string} type is the type of the polygon to help you find it later
     * @param {inlogMaps.PolygonAlterOptions} options are the parameters of the polygon
     */
    alterPolygonOptions(type, options) {
        let self = this;
        let polygons = self._polygonsList[type];

        if (polygons) {
            self.map._alterPolygonOptions(polygons, options);
        }
    }

    /* Polylines */
    /**
     * Use this function to draw polylines on the map
     * @param {string} type
     * @param {inlogMaps.PolylineOptions} options
     * @param {function} eventClick
     */
    drawPolyline(type, options, eventClick) {
        let self = this;
        let polyline = self.map._drawPolyline(options, eventClick);

        self._polylinesList[type] = polyline;
    }

    /**
     * Use this function to draw polylines with navigation on the map
     * @param {string} type
     * @param {inlogMaps.PolylineNavigationOptions} options
     */
    drawPolylineWithNavigation(type, options) {
        let self = this;
        let polyline = self.map._drawPolylineWithNavigation(options);

        self._polylinesList[type] = polyline;
    }

    /**
     * Use this function to add more paths to a polyline
     * @param {string} type
     * @param {Array} position
     */
    addPolylinePath(type, position) {
        let self = this;

        if (!self._polylinesList[type]) {
            self.drawPolyline(type, {
                addToMap: true
            });
        }
        let polyline = self._polylinesList[type];

        if (polyline) {
            self.map._addPolylinePath(polyline, position);
        }
    }

    /**
     * Use this function to clear polyline selected from the map
     */
    removePolylineHighlight() {
        let self = this;

        self.map._removePolylineHighlight();
    }

    /**
     * Use this function to show/hide polylines
     * @param {boolean} show
     * @param {string} type
     */
    showPolyline(show, type) {
        let self = this;
        let polyline = self._polylinesList[type];

        if (polyline) {
            self.map._showPolyline(polyline, show);
        }
    }

    /**
     * Use this function to alter polyline options
     * @param {string} type
     * @param {inlogMaps.PolylineAlterOptions} options
     */
    alterPolylineOptions(type, options) {
        let self = this;
        let polyline = self._polylinesList[type];

        if (polyline) {
            self.map._alterPolylineOptions(polyline, options);
        }
    };

    /* Circles */
    /**
     * Use this function to draw circles on the map
     * @param {string} type
     * @param {inlogMaps.CircleOptions} options
     * @param {function} eventClick
     */
    drawCircle(type, options, eventClick) {
        let self = this;
        let circle = self.map._drawCircle(options, eventClick);

        if (!self._circlesList[type]) {
            self._circlesList[type] = [];
        }
        self._circlesList[type].push(circle);
    }

    /**
     * Use this function to show/hide circles from a especific type
     * @param {boolean} show
     * @param {string} type
     */
    showCircles(show, type) {
        let self = this;
        let circles = self._circlesList[type];

        if (circles) {
            self.map._showCircles(circles, show);
        }
    }

    /**
     * Use this function to alter circle options
     * @param {string} type
     * @param {inlogMaps.CircleAlterOptions} options
     */
    alterCircleOptions(type, options) {
        let self = this;
        let circles = self._circlesList[type];

        if (circles) {
            self.map._alterCircleOptions(circles, options);
        }
    }

    /* Info Windows */
    /**
     * Use this function to draw popups on the map
     * @param {string} type
     * @param {inlogMaps.PopupOptions} options
     */
    drawPopup(type, options) {
        let self = this;

        if (self._infoWindowList[type]) {
            self.map._alterPopup(self._infoWindowList[type], options);
        } else {
            let infoWindow = self.map._drawPopup(options);

            self._infoWindowList[type] = infoWindow;
        }
    }

    /* Map */
    /**
     * Use this function to add event clicks on the map
     * @param {function} eventClick
     */
    addClickMap(eventClick) {
        let self = this;

        self.map._addClickMap(eventClick);
    }

    /**
     * Use this function to remove event clicks from the map
     */
    removeClickMap() {
        let self = this;

        self.map._removeClickMap();
    }
}

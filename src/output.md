

<!-- Start map.js -->

GEOJson

## loadGEOJson(data, options, eventClick)

Use this function to add GEOJSON to the currentMap

### Params:

* **object** *data* - Geojson
* **inlogMaps.GeoJsonOptions** *options* 
* **any** *eventClick* - is a function callback on click

Markers

## drawMarker(type, options, eventClick)

Use this function to draw markers in the currentMap

### Params:

* **string** *type* 
* **inlogMaps.MarkerOptions** *options* 
* **any** *eventClick* - is a function callback on click

## fitBoundsMarkers(type)

Use this function to fit bounds in the markers with the especified type

### Params:

* **string** *type* 

## drawCircleMarker(type, options, eventClick)

Use this function to draw circle markers in the currentMap

### Params:

* **string** *type* 
* **inlogMaps.CircleMarkerOptions** *options* 
* **any** *eventClick* - is a function callback on click

## toggleMarkers(show, type, condition)

Use this function to show/hide markers from a specific type

### Params:

* **boolean** *show* 
* **string** *type* 
* **any** *condition* - toogle markers with the condition

## alterMarkerOptions(type, options, condition)

Use this function to alter marker style

### Params:

* **string** *type* 
* **inlogMaps.MarkerAlterOptions** *options* 
* **any** *condition* - alter markers with the condition

Use this function to draw or modify markers in the map

### Params:

* **string** *type* 
* **inlogMaps.MarkerOptions** *options* 
* **any** *eventClick* - is a function callback on click
* **any** *condition* - draw or alter markers with the condition

## removeMarkers(type, condition)

Remove markers from the map and from internal list

### Params:

* **string** *type* 
* **any** *condition* - remove markers with the condition

Polygons

## drawPolygon(type, options, eventClick)

Use this function to draw polygons

### Params:

* **string** *type* 
* **inlogMaps.PolygonOptions** *options* 
* **any** *eventClick* 

## fitBoundsPolygon(type, condition)

Use this function to fit bounds of a polygon

### Params:

* **string** *type* 
* **any** *condition* - fit polygon bounds with the condition

## togglePolygons(show, type, condition)

Use this function to show/hide polygon from a especific type

### Params:

* **boolean** *show* 
* **string** *type* 
* **any** *condition* - toggle polygon with the condition

## alterPolygonOptions(type, options, condition)

Use this function to alter polygons options/style

### Params:

* **string** *type* 
* **inlogMaps.PolygonAlterOptions** *options* 
* **any** *condition* - alter polygon with the condition

Polylines

## drawPolyline(type, options, eventClick)

Use this function to draw polylines on the currentMap

### Params:

* **string** *type* 
* **inlogMaps.PolylineOptions** *options* 
* **any** *eventClick* 

## drawPolylineWithNavigation(type, options)

Use this function to draw polylines with navigation on the currentMap

### Params:

* **string** *type* 
* **inlogMaps.PolylineOptions** *options* 

## addPolylinePath(type, position)

Use this function to add more paths to a polyline

### Params:

* **string** *type* 
* **Array.\<number>** *position* 

## removePolylineHighlight()

Use this function to clear polyline selected from the currentMap

## togglePolyline(show, type, condition)

Use this function to toggle polylines

### Params:

* **boolean** *show* 
* **string** *type* 
* **any** *condition* - toggle polyline with the condition

## removePolyline(type, condition)

Use this function to remove polylines

### Params:

* **string** *type* 
* **any** *condition* - remove polyline with the condition

## alterPolylineOptions(type, options, condition)

Use this function to alter polyline options

### Params:

* **string** *type* 
* **inlogMaps.PolylineOptions** *options* 
* **any** *condition* - alter polyline with the condition

Circles

## drawCircle(type, options, eventClick)

Use this function to draw circles on the currentMap

### Params:

* **string** *type* 
* **inlogMaps.CircleOptions** *options* 
* **any** *eventClick* 

## toggleCircles(show, type, condition)

Use this function to show/hide circles from a especific type

### Params:

* **boolean** *show* 
* **string** *type* 
* **any** *condition* - toggle circles with the condition

## alterCircleOptions(type, options, condition)

Use this function to alter circle options

### Params:

* **string** *type* 
* **inlogMaps.CircleAlterOptions** *options* 
* **any** *condition* - alter circle with the condition

Info Windows

## drawPopup(type, options)

Use this function to draw popups on the currentMap

### Params:

* **string** *type* 
* **inlogMaps.PopupOptions** *options* 

## alterPopup(type, options)

Use this function to alter popups

### Params:

* **string** *type* 
* **inlogMaps.PopupOptions** *options* 

Map

## addClickMap(eventClick)

Use this function to add event clicks on the currentMap

### Params:

* **any** *eventClick* 

## removeClickMap()

Use this function to remove event clicks from the currentMap

<!-- End map.js -->


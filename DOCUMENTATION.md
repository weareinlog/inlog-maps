# [@inlog/inlog-maps](https://github.com/weareinlog/inlog-maps#readme) *4.0.2*

> A library for using generic layer maps 


### lib/map.js


#### Map.initialize(mapType, options, elementId) 

Use this to initialize map




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| mapType | `InlogMaps.MapType`  |  | &nbsp; |
| options | `any`  |  | &nbsp; |
| elementId | `string`  | default: 'inlog-map' [nullable] | &nbsp; |




##### Returns


- `Promisse.&lt;any&gt;`  



#### Map.loadGEOJson(data, options, eventClick) 

Use this function to add GEOJSON to the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| data | `object`  | Geojson | &nbsp; |
| options | `InlogMaps.GeoJsonOptions`  |  | &nbsp; |
| eventClick | `any`  | is a function callback on click [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.drawMarker(type, options, eventClick) 

Use this function to draw markers in the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.MarkerOptions`  |  | &nbsp; |
| eventClick | `any`  | is a function callback on click [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.drawCircleMarker(type, options, eventClick) 

Use this function to draw circle markers in the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.CircleMarkerOptions`  |  | &nbsp; |
| eventClick | `any`  | is a function callback on click [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.toggleMarkers(show, type, condition) 

Use this function to show/hide markers from a specific type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| show | `boolean`  |  | &nbsp; |
| type | `string`  |  | &nbsp; |
| condition | `any`  | toogle markers with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.removeMarkers(type, condition) 

Remove markers from the map and from internal list




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | remove markers with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.alterMarkerOptions(type, options, condition) 

Use this function to alter marker style




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.MarkerAlterOptions`  |  | &nbsp; |
| condition | `any`  | alter markers with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.alterMarkerPosition(type, position, addTransition, condition) 

Use this functions to alterar marker position




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| position | `Array.<number>`  |  | &nbsp; |
| addTransition | `boolean`  | [nullable] | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.fitBoundsMarkers(type, condition, onlyMarkersOnMap) 

Use this function to fit bounds in the markers with the especified type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |
| onlyMarkersOnMap | `boolean`  | default true | &nbsp; |




##### Returns


- `Void`



#### Map.setCenterMarker(type, condition) 

Use this functions to set the center of the map on marker




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | center on marker with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.markerExists(type, condition) 

This functions returns if marker exists




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type |  |  | &nbsp; |
| condition |  | [nullable] | &nbsp; |




##### Returns


- `boolean`  



#### Map.countMarkers(type, onlyOnMap, condition) 

Use this function to count markers by type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| onlyOnMap | `boolean`  | exclude hidden markers, default true | &nbsp; |
| condition | `any`  |  | &nbsp; |




##### Returns


- `number`  



#### Map.addMarkerEvent(type, event, eventFunction, condition) 

This function add new events on marker




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| event | `InlogMaps.MarkerEventType`  |  | &nbsp; |
| eventFunction | `any`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.removeMarkerEvent(type, event, condition) 

This function remove events of marker




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| event | `InlogMaps.MarkerEventType`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.addMarkerClusterer(type, config) 

Use this function to add MarkerClusterer on the map




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  | same type of markers | &nbsp; |
| config | `InlogMaps.MarkerClusterConfig`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.alterMarkerClustererConfig(type, config) 

Use this function to alter clusterer options




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type |  | same type of markers | &nbsp; |
| config | `InlogMaps.MarkerClusterConfig`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.refreshClusterer(type) 

Use this function to redraw marker clusterer




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type |  | same type of markers | &nbsp; |




##### Returns


- `Void`



#### Map.clearMarkersClusterer(type) 

Use this to clear markers on clusterer




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type |  | same type of markers | &nbsp; |




##### Returns


- `Void`



#### Map.drawPolygon(type, options, eventClick) 

Use this function to draw polygons




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.PolygonOptions`  |  | &nbsp; |
| eventClick | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.togglePolygons(show, type, condition) 

Use this function to show/hide polygon from a especific type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| show | `boolean`  |  | &nbsp; |
| type | `string`  |  | &nbsp; |
| condition | `any`  | toggle polygon with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.removePolygons(type, condition) 

Remove polygons from the map and from internal list




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | remove polygons with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.alterPolygonOptions(type, options, condition) 

Use this function to alter polygons options/style




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.PolygonAlterOptions`  |  | &nbsp; |
| condition | `any`  | alter polygon with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.fitBoundsPolygons(type, condition) 

Use this function to fit bounds of a polygon




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | fit polygon bounds with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.polygonExists(type, condition) 

This functions returns if polygon exists




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type |  |  | &nbsp; |
| condition |  | [nullable] | &nbsp; |




##### Returns


- `boolean`  



#### Map.addPolygonEvent(type, event, eventFunction, condition) 

This function add new events on polygon




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| event | `InlogMaps.PolygonEventType`  |  | &nbsp; |
| eventFunction | `any`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.removePolygonEvent(type, event, condition) 

This function remove events of polygon




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| event | `InlogMaps.PolygonEventType`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.drawCircle(type, options, eventClick) 

Use this function to draw circles on the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.CircleOptions`  |  | &nbsp; |
| eventClick | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.toggleCircles(show, type, condition) 

Use this function to show/hide circles from a especific type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| show | `boolean`  |  | &nbsp; |
| type | `string`  |  | &nbsp; |
| condition | `any`  | toggle circles with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.removeCircles(type, condition) 

Remove circles from the map and from internal list




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | remove circles with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.alterCircleOptions(type, options, condition) 

Use this function to alter circle options




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.CircleAlterOptions`  |  | &nbsp; |
| condition | `any`  | alter circle with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.fitBoundsCircles(type, condition) 

Use this function to fit bounds of a polygon




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | fit polygon bounds with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.circleExists(type, condition) 

This functions returns if circle exists




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `boolean`  



#### Map.getCircleCenter(type, condition) 

This function return circle center




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Array.&lt;number&gt;`  



#### Map.addCircleEvent(type, event, eventFunction, condition) 

This function add new events on circle




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| event | `InlogMaps.CircleEventType`  |  | &nbsp; |
| eventFunction | `any`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.removeCircleEvent(type, event, condition) 

This function remove events of circle




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| event | `InlogMaps.CircleEventType`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.drawPolyline(type, options, eventClick) 

Use this function to draw polylines on the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.PolylineOptions`  |  | &nbsp; |
| eventClick | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.drawPolylineWithNavigation(type, options) 

Use this function to draw polylines with navigation on the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.PolylineOptions`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.togglePolylines(show, type, condition) 

Use this function to toggle polylines




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| show | `boolean`  |  | &nbsp; |
| type | `string`  |  | &nbsp; |
| condition | `any`  | toggle polyline with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.removePolylines(type, condition) 

Use this function to remove polylines




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | remove polyline with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.alterPolylineOptions(type, options, condition) 

Use this function to alter polyline options




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.PolylineOptions`  |  | &nbsp; |
| condition | `any`  | alter polyline with the condition [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.fitBoundsPolylines(type, condition) 

Use this functions to fit polylines bounds




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.polylineExists(type, condition) 

This functions returns if polyline exists




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `boolean`  



#### Map.addPolylinePath(type, position, condition) 

Use this function to add more paths to a polyline




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| position | `Array.<number>`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.removePolylineHighlight() 

Use this function to clear polyline selected from the currentMap






##### Returns


- `Void`



#### Map.addPolylineEvent(type, event, eventFunction, condition) 

Use this function to add listeners on polyline




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| event | `InlogMaps.PolylineEventType`  |  | &nbsp; |
| eventFunction | `any`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.removePolylineEvent(type, event, condition) 

Use this function to remove listeners of polyline




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| event | `InlogMaps.PolylineEventType`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.drawPopup(type, options) 

Use this function to draw popups on the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.PopupOptions`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.alterPopup(type, options) 

Use this function to alter popups




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.PopupOptions`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.getObjectOpenPopup(type) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |




##### Returns


- `object`  



#### Map.closePopup(type) 

Use this function to close popup by type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.closeAllPopups(type) 

Use this function to close all popups




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.resizeMap() 

Resize de map based on html size






##### Returns


- `Void`



#### Map.addEventMap(eventType, eventFunction) 

Use this function to add event clicks on the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| eventType | `InlogMaps.MapEventType`  |  | &nbsp; |
| eventFunction |  | function callback | &nbsp; |




##### Returns


- `Void`



#### Map.removeEventMap(eventType) 

Use this function to remove event clicks from the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| eventType | `InlogMaps.MapEventType`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.getZoom() 

Returns the current zoom level of the map view






##### Returns


- `number`  



#### Map.setZoom(zoom) 

Set the current zoom level of the map view




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| zoom | `number`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.getCenter() 

Returns the center position of the map






##### Returns


- `Array.&lt;number&gt;`  



#### Map.setCenter(position) 

Set the position center of the map




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| position | `Array.<number>`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.pixelsToLatLng(offsetx, offsety) 

Returns the coordinates from pixels




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| offsetx | `number`  |  | &nbsp; |
| offsety | `number`  |  | &nbsp; |




##### Returns


- `Array.&lt;number&gt;`  



#### Map.drawOverlay(type, options) 

Use this function to dray overlays on the current map




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `InlogMaps.OverlayOptions`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.toggleOverlay(show, type, condition) 

Use this function to show or hide overlay




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| show | `boolean`  |  | &nbsp; |
| type | `string`  |  | &nbsp; |
| condition | `any`  | [nullable] | &nbsp; |




##### Returns


- `Void`



#### Map.removeOverlays(type, condition) 

Remove overlays from the map and from internal list




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | remove overlays with the condition [nullable] | &nbsp; |




##### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*

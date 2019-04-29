# [@inlog/inlog-maps](https://github.com/weareinlog/inlog-maps#readme) *2.4.0*

> A library for using generic layer maps 


### lib/map.js


#### Map.initialize(mapType, options) 

Use this to initialize map




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| mapType |  | {inlogMaps.MapType} | &nbsp; |
| options |  | {any} | &nbsp; |




##### Returns


- `Void`



#### Map.loadGEOJson(data, options, eventClick) 

Use this function to add GEOJSON to the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| data | `object`  | Geojson | &nbsp; |
| options | `inlogMaps.GeoJsonOptions`  |  | &nbsp; |
| eventClick | `any`  | is a function callback on click | &nbsp; |




##### Returns


- `Void`



#### Map.drawMarker(type, options, eventClick) 

Use this function to draw markers in the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.MarkerOptions`  |  | &nbsp; |
| eventClick | `any`  | is a function callback on click | &nbsp; |




##### Returns


- `Void`



#### Map.fitBoundsMarkers(type) 

Use this function to fit bounds in the markers with the especified type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.drawCircleMarker(type, options, eventClick) 

Use this function to draw circle markers in the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.CircleMarkerOptions`  |  | &nbsp; |
| eventClick | `any`  | is a function callback on click | &nbsp; |




##### Returns


- `Void`



#### Map.toggleMarkers(show, type, condition) 

Use this function to show/hide markers from a specific type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| show | `boolean`  |  | &nbsp; |
| type | `string`  |  | &nbsp; |
| condition | `any`  | toogle markers with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.alterMarkerOptions(type, options, condition) 

Use this function to alter marker style




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.MarkerAlterOptions`  |  | &nbsp; |
| condition | `any`  | alter markers with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.alterMarkerPosition(type, position, condition) 

Use this functions to alterar marker position




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| position | `Array.<number>`  |  | &nbsp; |
| condition | `any`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.removeMarkers(type, condition) 

Remove markers from the map and from internal list




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | remove markers with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.setCenterMarker(type, condition) 

Use this functions to set the center of the map on marker




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | center on marker with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.drawPolygon(type, options, eventClick) 

Use this function to draw polygons




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.PolygonOptions`  |  | &nbsp; |
| eventClick | `any`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.fitBoundsPolygons(type, condition) 

Use this function to fit bounds of a polygon




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | fit polygon bounds with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.togglePolygons(show, type, condition) 

Use this function to show/hide polygon from a especific type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| show | `boolean`  |  | &nbsp; |
| type | `string`  |  | &nbsp; |
| condition | `any`  | toggle polygon with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.alterPolygonOptions(type, options, condition) 

Use this function to alter polygons options/style




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.PolygonAlterOptions`  |  | &nbsp; |
| condition | `any`  | alter polygon with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.removePolygons(type, condition) 

Remove polygons from the map and from internal list




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | remove polygons with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.polygonExists() 

This functions returns if polygon exists






##### Returns


- `Void`



#### Map.drawPolyline(type, options, eventClick) 

Use this function to draw polylines on the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.PolylineOptions`  |  | &nbsp; |
| eventClick | `any`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.drawPolylineWithNavigation(type, options) 

Use this function to draw polylines with navigation on the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.PolylineOptions`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.addPolylinePath(type, position, condition) 

Use this function to add more paths to a polyline




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| position | `Array.<number>`  |  | &nbsp; |
| condition |  |  | &nbsp; |




##### Returns


- `Void`



#### Map.removePolylineHighlight() 

Use this function to clear polyline selected from the currentMap






##### Returns


- `Void`



#### Map.togglePolylines(show, type, condition) 

Use this function to toggle polylines




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| show | `boolean`  |  | &nbsp; |
| type | `string`  |  | &nbsp; |
| condition | `any`  | toggle polyline with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.removePolylines(type, condition) 

Use this function to remove polylines




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | remove polyline with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.alterPolylineOptions(type, options, condition) 

Use this function to alter polyline options




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.PolylineOptions`  |  | &nbsp; |
| condition | `any`  | alter polyline with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.fitBoundsPolylines(type, condition) 

Use this functions to fit polylines bounds




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type |  |  | &nbsp; |
| condition |  |  | &nbsp; |




##### Returns


- `Void`



#### Map.drawCircle(type, options, eventClick) 

Use this function to draw circles on the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.CircleOptions`  |  | &nbsp; |
| eventClick | `any`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.toggleCircles(show, type, condition) 

Use this function to show/hide circles from a especific type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| show | `boolean`  |  | &nbsp; |
| type | `string`  |  | &nbsp; |
| condition | `any`  | toggle circles with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.alterCircleOptions(type, options, condition) 

Use this function to alter circle options




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.CircleAlterOptions`  |  | &nbsp; |
| condition | `any`  | alter circle with the condition | &nbsp; |




##### Returns


- `Void`



#### Map.drawPopup(type, options) 

Use this function to draw popups on the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.PopupOptions`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.alterPopup(type, options) 

Use this function to alter popups




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `inlogMaps.PopupOptions`  |  | &nbsp; |




##### Returns


- `Void`



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



#### Map.addEventMap(eventType, eventFunction) 

Use this function to add event clicks on the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| eventType | `EventType`  |  | &nbsp; |
| eventFunction |  | function callback | &nbsp; |




##### Returns


- `Void`



#### Map.removeEventMap(eventType) 

Use this function to remove event clicks from the currentMap




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| eventType | `EventType`  |  | &nbsp; |




##### Returns


- `Void`



#### Map.getZoom() 

Returns the current zoom level of the map view






##### Returns


- `Void`



#### Map.getCenter() 

Returns the center position of the map






##### Returns


- `Void`



#### Map.setCenter() 

Set the position center of the map






##### Returns


- `Void`



#### Map.drawOverlay(type, options, typePolygon, polygonCondition) 

Use this function to dray overlays on the current map




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| options | `OverlayOptions`  |  | &nbsp; |
| typePolygon | `string`  |  | &nbsp; |
| polygonCondition |  |  | &nbsp; |




##### Returns


- `Void`



#### Map.toggleOverlay(show, type, condition) 

Use this function to show or hide overlay




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| show |  |  | &nbsp; |
| type |  |  | &nbsp; |
| condition |  |  | &nbsp; |




##### Returns


- `Void`



#### Map.removeOverlays(type, condition) 

Remove overlays from the map and from internal list




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  |  | &nbsp; |
| condition | `any`  | remove overlays with the condition | &nbsp; |




##### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*

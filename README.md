# InlogMaps
A library to use generic layer maps.
___
- [Getting Started](#creating-a-new-instance-of-inlogmaps)  

- [Markers](#markers)  

- [Polygons](#polygons)  

- [Polylines](#polylines)  

- [Circles](#circles)  

- [PopUps](#popups) 

- [GEOJson](#geojson)  

- [Map](#map)  
___
## Creating a new instance of InlogMaps: 
### Google Maps:
```javascript
const map = new inlogMaps.Map('Google');
 ``` 

### Leaflet:
```javascript
const map = new inlogMaps.Map('Leaflet');
```
___

## Markers:
### drawMarker
```javascript
let type = 'sample';
let item = { something: 'hello world' };
let icon = new inlogMaps.MarkerIcon('images/cursor_locate.png');
let options = new inlogMaps.MarkerOptions([-26, -50], true, false, icon, true, item);

function eventClick(marker, event, object) {
    // TODO: Do something here

    // Will appear 'hello world' on console
    console.log(object.something);
}

map.drawMarker(type, options, eventClick);
```
#### Parameters:
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the marker to help you find it later. |
| options | [inlogMaps.MarkerOptions](#markeroptions) | Parameters of the marker. |
| eventClick | `Function` | Callback function when click on marker. <br/> [eventClick params](#marker-event-click-params). |

#### MarkerOptions:
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| latlng | `Array` | true | Position of the marker. <br/> Expects array with latitude and longitude: `[Number, Number]`. |
| addToMap | `Boolean` | false | Define if marker shows on the map.<br/> Default: `false`. |
| draggable | `Boolean` | false | Define if marker is draggable on the map. <br/> Default: `false`. |
| icon | [inlogMaps.MarkerIcon](#markericon) | false | Used if the pin of the marker is custom. |
| fitBounds | `Boolean` | false | Define if the map will fit on the marker. <br/> Default: `false`. |
| object | `Object` | false | Is a object that will be returned in the eventClick function. |
    
#### MarkerIcon
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| url | `String` | true | Path of the image. |
| size | `Array` | false | Expects array with size of the positions `x` and `y`: `[Number, Number]`. |

#### Marker Event Click Params
|Parameters|Type|Description|
|----------|:--:|-----------|
| marker | `google.maps.Marker` <br/> or <br/> `L.Marker` | Return the object of the clicked marker. |
| event | [inlogMaps.EventReturn](#eventreturn) | Return a object with events params. |
| object | `Object` | Return the object that was passed on marker options. |

### drawCircleMarker
```javascript
let type = 'sample';
let style = new inlogMaps.CircleMarkerStyle(5, 1, '#000000', '#FF0000', 0.8);
let options = new inlogMaps.CircleMarkerOptions([-24, -48], true, style, true);

function eventClick(marker, event, object) {
    // TODO: Do something here
}

map.drawCircleMarker(type, options, eventClick);
```
#### Parameters:
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the circle marker to help you find it later. |
| options | [inlogMaps.CircleMarkerOptions](#circlemarkeroptions) | Parameters of the circle marker. |
| eventClick | `Function` | Callback function when click on marker. <br/> [eventClick params](#marker-event-click-params). |

#### CircleMarkerOptions:
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| latlng | `Array` | true | Position of the circle marker. <br/> Expects array with latitude and longitude: `[Number, Number]`. |
| addToMap | `Boolean` | false | Define if circle marker shows on the map.<br/> Default: `false`. |
| style | [inlogMaps.CircleMarkerStyle](#circlemarkerstyle) | true | Style options of the circle marker. |
| fitBounds | `Boolean` | false | Define if the map will fit on the marker. <br/> Default: `false`. |
| object | `Object` | false | Is a object that will be returned in the eventClick function. |

#### CircleMarkerStyle:
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| radius | `Number` | true | Radius of the circle marker, in pixels. |
| weight | `Number` | false | Stroke width in pixels. |
| color | `String` | false | Stroke color. |
| fillColor | `String` | false | Fill color. |
| fillOpacity | `String` | false | Fill opacity. |

### showMarkers
```javascript
let type = 'sample';
let show = false;

map.showMarkers(show, type);
```
#### Parameters:
|Parameters|Type|Description|
|----------|:--:|-----------|
| show | `Boolean` | Show/hide marker |
| type | `String` | Type of the marker |

### alterMarkerOptions
```javascript
let type = 'sample';
let options = new inlogMaps.MarkerAlterOptions([-20, -40]);

map.alterMarkerOptions(type, options);
```
#### Parameters:
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the marker |
| options | [inlogMaps.MarkerAlterOptions](#markeralteroptions) | Parameters of the marker. |

#### MarkerAlterOptions
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| latlng | `Array` | false | Position of the circle marker. <br/> Expects array with latitude and longitude: `[Number, Number]`. |
| icon | [inlogMaps.MarkerIcon](#markericon) | false | Path of the image. |
| style | [inlogMaps.CircleMarkerStyle](#circlemarkerstyle) | false | Style options of the marker. |  

____

## Polygons:
### drawPolygon
```javascript
function eventClick(polygon, event, object) {
    // TODO: Do something here
}

let type = 'polygon';
let path = [
    [25.774, -80.190],
    [18.466, -66.118],
    [32.321, -64.757],
    [25.774, -80.190]
];
let options = new inlogMaps.PolygonOptions(path, 1, true, '#000000', 1, '#FFFFFF', 0.8);

options.fitBounds = true;
map.drawPolygon(type, options, eventClick);
```
#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the polygon to help you find it later. |
| options | [inlogMaps.PolygonOptions](#polygonoptions) | Parameters of the polygon. |
| eventClick | `Function` | Callback function when click on polygon. <br/> [eventClick params](#polygon-event-click-params). |

#### PolygonOptions
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| path | `Array` | true | Expected an array of positions. <br/> `[[Number, Number], [Number, Number]]`. |
| weight | `Number` | true | Stroke width in pixels. |
| addToMap | `Boolean` | false | Define if polygon shows on the map.<br/> Default: `false`. |
| color | `String` | false | Stroke color. |
| opacity | `Number` | false | Stroke opacity. |
| fillColor | `String` | false | Fill color. |
| fillOpacity | `Number` | false | Fill opacity. |
| draggable | `Boolean` | false | Define if marker is draggable on the map.<br/> Default: `false`. |
| editable | `Boolean` | false | Define if marker is editable.<br/> Default: `false`.  |
| fitBounds | `Boolean` | false | Define if the map will fit on the polygon. <br/> Default: `false`. |
| object | `Object` | false | Is a object that will be returned in the eventClick function. |

#### Polygon Event Click Params
|Parameters|Type|Description|
|----------|:--:|-----------|
| marker | `google.maps.Polygon` <br/> or <br/> `L.Polygon` | Return the object of the clicked polygon. |
| event | [inlogMaps.EventReturn](#eventreturn) | Return a object with events params. |
| object | `Object` | Return the object that was passed on polygon options. |

### showPolygons
```javascript
let type = 'polygon';

map.showPolygons(true, type);
```
#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| show | `Boolean` | Show/hide polygon |
| type | `String` | Type of the polygon |

### alterPolygonOptions
```javascript
let type = 'polygon';
let options = new inlogMaps.PolygonAlterOptions();

options.fillColor = '#FFFF00';
map.alterPolygonOptions(type, options);
```

#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the polygon. |
| options | [`inlogMaps.PolygonAlterOptions`](#polygonalteroptions) | Parameters of the polygon. |

#### PolygonAlterOptions
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| weight | `Number` | true | Stroke width in pixels. |
| color | `String` | false | Stroke color. |
| opacity | `Number` | false | Stroke opacity. |
| fillColor | `String` | false | Fill color. |
| fillOpacity | `Number` | false | Fill opacity. |

___

## Polylines:
### drawPolyline
```javascript
function eventClick(polyline, event, object) {
    // TODO: Do something here
}

let type = 'polyline';
let options = new inlogMaps.PolylineOptions();

options.path = [
    [-23.02487, -43.48283],
    [-23.02475, -43.48391],
    [-23.02486, -43.48233],
    [-23.02443, -43.48212],
    [-23.02429, -43.48243],
    [-23.02477, -43.48245]
];
options.addToMap = true;
options.fitBounds = true;
map.drawPolyline(type, options, eventClick);
```
#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the polyline to help you find it later. |
| options | [inlogMaps.PolylineOptions](#polylineoptions) | Parameters of the polyline. |
| eventClick | `Function` | Callback function when click on polyline. <br/> [eventClick params](#polyline-event-click-params). |

#### PolylineOptions
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| path | `Array` | true | Expected an array of positions. <br/> `[[Number, Number], [Number, Number]]`. |
| addToMap | `Boolean` | false | Define if polyline shows on the map.<br/> Default: `false`. |
| fitBounds | `Boolean` | false | Define if the map will fit on the polyline. <br/> Default: `false`. |
| editable | `Boolean` | false | Define if polyline is editable.<br/> Default: `false`.  |
| draggable | `Boolean` | false | Define if polyline is draggable on the map.<br/> Default: `false`. |
| color | `String` | false | Stroke color. |
| weight | `Number` | true | Stroke width in pixels. |
| object | `Object` | false | Is a object that will be returned in the eventClick function. |

#### Polyline Event Click Params
|Parameters|Type|Description|
|----------|:--:|-----------|
| marker | `google.maps.Polyline` <br/> or <br/> `L.Polyline` | Return the object of the clicked polyline. |
| event | [inlogMaps.EventReturn](#eventreturn) | Return a object with events params. |
| object | `Object` | Return the object that was passed on polyline options. |

### drawPolylineWithNavigation
```javascript
let type = 'polylineNavigation';
let options = new inlogMaps.PolylineNavigationOptions();

options.path = [
    [-23.024657518124023, -43.48285071469786],
    [-23.02484265813435, -43.48359100438597],
    [-23.025441015571875, -43.48343945957663],
    [-23.02518922621311, -43.48251677967551],
    [-23.02535214879308, -43.482527508511566]
];
options.infowindows = [
    '<h1>1</h1>',
    '<h1>2</h1>',
    '<h1>3</h1>',
    '<h1>4</h1>',
    '<h1>5</h1>'
];
options.addToMap = true;
options.weight = 8;
options.fitBounds = true;
options.navigateOptions = new inlogMaps.NavigationOptions('#0000FF');
map.drawPolylineWithNavigation(type, options);
```
#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the polyline to help you find it later. |
| options | [inlogMaps.PolylineNavigationOptions](#polylinenavigationoptions) | Parameters of the polyline. |

#### PolylineNavigationOptions
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| path | `Array` | true | Expected an array of positions. <br/> `[[Number, Number], [Number, Number]]`. |
| infowindows | `Array` | false | Expected an array of strings. <br/> `[String, String]`. |
| addToMap | `Boolean` | false | Define if polyline shows on the map.<br/> Default: `false`. |
| fitBounds | `Boolean` | false | Define if the map will fit on the polyline. <br/> Default: `false`. |
| editable | `Boolean` | false | Define if polyline is editable.<br/> Default: `false`.  |
| draggable | `Boolean` | false | Define if polyline is draggable on the map.<br/> Default: `false`. |
| color | `String` | false | Stroke color. |
| weight | `Number` | false | Stroke width in pixels. |
| object | `Object` | false | Is a object that will be returned in the eventClick function. |
| navigateOptions | [inlogMaps.NavigationOptions](#navigationoptions) | false | Is a object that will be returned in the eventClick function. |

#### NavigationOptions
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| color | `String` | false | Stroke color. <br/> Default: `'#FF0000'` |
| weight | `Number` | false | Stroke width in pixels. <br/> Default: 10 |

### addPolylinePath
```javascript
let type = 'polyline';
let position = [-23.024657518124023, -43.48285071469786]];

map.addPolylinePath(type, position);
```
#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the polyline. |
| position | `Array` | Position of the new path. <br/> Expects array with latitude and longitude: `[Number, Number]`. |

### removePolylineHighlight
```javascript
map.removePolylineHighlight();
```

### showPolyline
```javascript
let type = 'polyline';

map.showPolyline(true, type);
```
#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| show | `Boolean` | Show/hide polyline |
| type | `String` | Type of the polyline |

### alterPolylineOptions
```javascript
let type = 'polyline';
let options = new inlogMaps.PolylineAlterOptions(true, true, '#00FF00', 12, {
    item: 'Edited'
});

map.alterPolylineOptions(type, options);
```
#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the polyline. |
| options | [`inlogMaps.PolylineAlterOptions`](#polylinealteroptions) | Parameters of the polyline. |

#### PolylineAlterOptions
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| editable | `Boolean` | false | Define if polyline is editable.<br/> Default: `false`.  |
| draggable | `Boolean` | false | Define if polyline is draggable on the map.<br/> Default: `false`. |
| color | `String` | false | Stroke color. |
| weight | `Number` | false | Stroke width in pixels. |
| object | `Object` | false | Is a object that will be returned in the eventClick function. |
___

## Circles:
### drawCircle
```javascript
function eventClick(circle, event, object) {
    // TODO: Do something here
}

let type = 'circle';
let options = new inlogMaps.CircleOptions();

options.addToMap = true;
options.center = [-25.4327193, -49.2784139];
options.radius = 100;
options.weight = 1;
options.fitBounds = true;
map.drawCircle(type, options, eventClick);
```
#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the circle to help you find it later. |
| options | [inlogMaps.CircleOptions](#circleoptions) | Parameters of the circle. |
| eventClick | `Function` | Callback function when click on circle. <br/> [eventClick params](#circle-event-click-params). |

#### CircleOptions
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| center | `Array` | true | Center of the circle. <br/> Expects array with latitude and longitude: `[Number, Number]`. |
| radius | `Number` | true | Radius of the circle, in meters. |
| weight | `Number` | true | Stroke width in pixels. |
| addToMap | `Boolean` | false | Define if circle shows on the map.<br/> Default: `false`. |
| fillOpacity | `Number` | false | Fill opacity. |
| fillColor | `String` | false | Fill color. |
| color | `String` | false | Stroke color. |
| opacity | `Number` | false | Stoker opacity. |
| draggable | `Boolean` | false | Define if circle is draggable on the map.<br/> Default: `false`. |
| editable | `Boolean` | false | Define if circle is editable.<br/> Default: `false`.  |
| fitBounds | `Boolean` | false | Define if the map will fit on the circle. <br/> Default: `false`. |
| object | `Object` | false | Is a object that will be returned in the eventClick function. |

#### Circle Event Click Params
|Parameters|Type|Description|
|----------|:--:|-----------|
| marker | `google.maps.Circle` <br/> or <br/> `L.Circle` | Return the object of the clicked circle. |
| event | [inlogMaps.EventReturn](#eventreturn) | Return a object with events params. |
| object | `Object` | Return the object that was passed on circle options. |

### showCircles
```javascript
let type = 'circle';

map.showCircles(true, type);
```
#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| show | `Boolean` | Show/hide circle |
| type | `String` | Type of the circle |

### alterCircleOptions
```javascript
let type = 'circle';
let options = new inlogMaps.CircleAlterOptions();

options.fillColor = '#FFFF00';
map.alterCircleOptions(type, options);
```
#### Parameters
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the circle. |
| options | [`inlogMaps.CircleAlterOptions`](#circlealteroptions) | Parameters of the circle. |

#### CircleAlterOptions
|Parameters|Type|Required|Description|
|----------|:--:|:------:|-----------|
| weight | `Number` | true | Stroke width in pixels. |
| fillOpacity | `Number` | false | Fill opacity. |
| fillColor | `String` | false | Fill color. |
| color | `String` | false | Stroke color. |
| opacity | `Number` | false | Stoker opacity. |

___

## Popups:
### drawPopup
```javascript
let options = new inlogMaps.PopupOptions(event.latlng, 
    '<p>Hello world!<br />This is a nice popup.</p>', marker);

map.drawPopup('marker', options);
```
#### Parameters:
|Parameters|Type|Description|
|----------|:--:|-----------|
| type | `String` | Type of the popup. |
| options | [inlogMaps.PopupOptions](#popupoptions) | Options of the popup. |

#### PopupOptions
|Parameters|Type|Required|Description|
|----------|:--:|--------|-----------|
| latlng | `Array` | true | Position of the circle marker. <br/> Expects array with latitude and longitude: `
| marker | `google.maps.Marker` <br/> or <br/> `L.Marker` | false | Marker object received on events |
| content | `String` | true | Content of the popup. |

___

## GEOJson
### loadGEOJson
```javascript
let data = {
    'type': 'Feature',
    'properties': {
        'name': 'Sample',
        'amenity': 'Sample Test',
        'popupContent': 'You are at Inlog!'
    },
    'geometry': {
        'type': 'Point',
        'coordinates': [-49.2806026, -25.4327193]
    }
};

let options = {
    draggable: true,
    editable: true
};

function eventClick(event) {
    // TODO: Do something here
}

map.loadGEOJson(data, options, eventClick);
```
#### Parameters:
|Parameters|Type|Description|
|----------|:--:|-----------|
| data | `String` | GeoJSON a ser plotado no mapa. |
| options | [GEOJson Options](#geojson-options) | GeoJSON options |
| eventClick | `Function` | Callback function when click on the map. <br/> Returns a [inlogMaps.EventReturn](#eventreturn) as param. |

#### GEOJson Options
|Parameters|Type|Description|
|----------|:--:|-----------|
| editable | `Boolean` | Define if layer is editable on the map.<br/> Default: `false`. |
| draggable | `Boolean` | Define if layer is draggable on the map.<br/> Default: `false`. |
___

## Map
### addClickMap
```javascript
function eventClick(event) {
    // TODO: Do something here
}

map.addClickMap(eventClick);
```
#### Parameters:
|Parameters|Type|Description|
|----------|:--:|-----------|
| eventClick | `Function` | Callback function when click on the map. <br/> Returns a [inlogMaps.EventReturn](#eventreturn) as param. |

### removeClickMap
```javascript
map.removeClickMap();
```
___

## Events
#### EventReturn
|Parameters|Type|Description|
|----------|:--:|-----------|
| latlng | `Array` | Clicked position. <br/> Contains latitude and longitude: `[Number, Number]`. |

---

## Development
```
npm run dev
```


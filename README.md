# [@inlog/inlog-maps](https://github.com/weareinlog/inlog-maps#readme)

> A library for using generic layer maps 

## Install
Install the library  
 `npm install @inlog/inlog-maps`

### Using
#### Google
```javascript
const params = {
    libraries: ['drawing'],
    apiKey: '<your-api-key-here>'
};

const currentMap = new InlogMaps.Map;
currentMap.initialize(InlogMaps.MapType.Google, params)
    .then(() => /* Implement your methods */);
```

#### Leaflet
```javascript
const params = {
    scriptsDependencies: [
        'path/to/Leaflet.Editable.js',
        'path/to/Path.Drag.js'
    ]
};

const currentMap = new InlogMaps.Map;
currentMap.initialize(InlogMaps.MapType.Leaflet, params)
    .then(() => /* Implement your methods */);
```

See [demo.js](https://github.com/weareinlog/inlog-maps/blob/master/src/demo.js) and [index.html](https://github.com/weareinlog/inlog-maps/blob/master/src/index.html).

Use our [DOCUMENTATION](https://github.com/weareinlog/inlog-maps/blob/master/DOCUMENTATION.md) to find how implement the marker, polygons, polylines, circles, and others layers availables.
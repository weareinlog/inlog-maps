import GeoJsonOptions from "../../features/geojson/geojson-options";
import EventReturn from "../../features/events/event-return";

export default class LeafletGeoJson {
    private map = null;
    private leaflet = null;

    constructor(map: any, leaflet: any) {
        this.map = map;
        this.leaflet = leaflet;
    }

    public loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any) {
        const self = this;
        const objects = self.parseGeoJson(data, options);

        objects.forEach((elem) => self.map.addLayer(elem));

        if (self.map.options) {
            if (self.map.options.editable) {
                objects.forEach((obj) => {
                    if (obj.enableEdit) {
                        obj.enableEdit();
                    }

                    if (eventClick) {
                        obj.on('click', (event) => {
                            const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                            eventClick(param);
                        });
                    }
                });
            }
        }
    }

    private parseGeoJson(data: any, options: GeoJsonOptions) {
        const self = this;
        const parsedFeatures = [];

        if (Array.isArray(data.features)) {
            for (const feature of data.features) {
                parsedFeatures.push(self.parseGeoJsonToObject(feature, options));
            }
        } else {
            parsedFeatures.push(self.parseGeoJsonToObject(data, options));
        }

        return parsedFeatures;
    }

    private parseGeoJsonToObject(data: any, objectOptions: any) {
        const geometry = data.geometry;
        let parsedCoordinates = [];

        if (data.properties) {
            Object.assign(objectOptions, data.properties);
        }

        switch (geometry.type) {
            case 'Point':
                parsedCoordinates = geometry.coordinates.reverse();
                return new this.leaflet.Marker(parsedCoordinates, objectOptions);
            case 'Polygon':
                geometry.coordinates
                    .forEach((polygon) => parsedCoordinates.push(polygon.map((elem) => elem.reverse())));
                return new this.leaflet.Polygon(parsedCoordinates, objectOptions);
            case 'LineString':
                parsedCoordinates = geometry.coordinates.map((elem) => elem.reverse());
                return new this.leaflet.Polyline(parsedCoordinates, objectOptions);
            default:
                throw new Error('Forma de objeto desconhecida.');
        }
    }
}

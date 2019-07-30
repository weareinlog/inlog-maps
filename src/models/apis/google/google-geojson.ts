import GeoJsonOptions from "../../features/geojson/geojson-options";
import EventReturn from "../../features/events/event-return";

export default class GoogleGeoJson {
    private map = null;
    private google = null;

    constructor(map: any, google: any) {
        this.map = map;
        this.google = google;
    }

    public loadGEOJson(data: object, options: GeoJsonOptions, eventClick: any) {
        const self = this;
        const objects = self.parseGeoJson(data, options);

        objects.forEach((elem) => {
            if (eventClick) {
                elem.addListener('click', (event: any) => {
                    const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                    eventClick(param);
                });
            }
            elem.setMap(self.map);
        });
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

        if (data.properties) {
            Object.assign(objectOptions, data.properties);
        }

        switch (geometry.type) {
            case 'Point':
                objectOptions.position = {
                    lat: geometry.coordinates[1],
                    lng: geometry.coordinates[0]
                };
                return new this.google.maps.Marker(objectOptions);
            case 'Polygon':
                objectOptions.paths = [];
                geometry.coordinates.forEach((polygon) =>
                    objectOptions.paths.push(polygon.map((elem) => ({
                        lat: elem[1],
                        lng: elem[0]
                    })))
                );
                return new this.google.maps.Polygon(objectOptions);
            case 'LineString':
                objectOptions.path = geometry.coordinates.map((elem) => ({
                    lat: elem[1],
                    lng: elem[0]
                }));
                return new this.google.maps.Polyline(objectOptions);
            default:
                throw new Error('Forma de objeto desconhecida.');
        }
    }
}

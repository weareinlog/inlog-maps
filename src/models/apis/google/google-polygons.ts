import { PolygonEventType } from '../../dto/event-type';
import EventReturn from '../../features/events/event-return';
import PolygonAlterOptions from '../../features/polygons/polygon-alter-options';
import PolygonOptions from '../../features/polygons/polygon-options';

export default class GooglePolygons {
    private map = null;
    private google = null;

    constructor(map: any, google: any) {
        this.map = map;
        this.google = google;
    }

    public drawPolygon(options: PolygonOptions, eventClick: any) {
        const self = this;
        const paths = [];

        options.path.forEach((path) => {
            paths.push({
                lat: path[0],
                lng: path[1]
            });
        });

        const newOptions = {
            draggable: options.draggable,
            editable: options.editable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            object: options.object,
            paths,
            strokeColor: options.color,
            strokeOpacity: options.opacity,
            strokeWeight: options.weight,
            suppressUndo: true,
            zIndex: options.zIndex
        };

        const polygon = new this.google.maps.Polygon(newOptions);

        if (eventClick) {
            this.google.maps.event.addListener(polygon, 'click', (event: any) => {
                const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                eventClick(param, options.object);
            });
        }

        if (options.addToMap) {
            polygon.setMap(self.map);
        }

        if (options.fitBounds) {
            self.map.fitBounds(self.getPolygonBounds(polygon));
        }

        return polygon;
    }

    public togglePolygons(polygons: any[], show: boolean) {
        const self = this;
        polygons.forEach((polygon) => polygon.setMap(show ? self.map : null));
    }

    public alterPolygonOptions(polygons: any[], options: PolygonAlterOptions) {
        let newOptions = {};

        polygons.forEach((polygon) => {
            newOptions = {
                fillColor: options.fillColor ? options.fillColor : polygon.fillColor,
                fillOpacity: options.fillOpacity ? options.fillOpacity : polygon.fillOpacity,
                strokeColor: options.color ? options.color : polygon.strokeColor,
                strokeOpacity: options.opacity ? options.opacity : polygon.strokeOpacity,
                strokeWeight: options.weight ? options.weight : polygon.strokeWeight
            };

            polygon.setOptions(newOptions);
        });
    }

    public fitBoundsPolygons(polygons: any): void {
        this.map.fitBounds(this.getPolygonsBounds(polygons));
    }

    public setCenterPolygons(polygons: any): void {
        this.map.setCenter(this.getPolygonsBounds(polygons).getCenter());
    }

    public isPolygonOnMap(polygon: any): boolean {
        return polygon.map !== null;
    }

    public addPolygonEvent(polygons: any, eventType: PolygonEventType, eventFunction: any): void {
        polygons.forEach((polygon: any) => {
            switch (eventType) {
                case PolygonEventType.Move:
                    this.google.maps.event.addListener(polygon.getPath(), 'set_at', (event: any) => {
                        const param = new EventReturn([polygon.getPath()
                            .getAt(event).lat(), polygon.getPath().getAt(event).lng()]);
                        eventFunction(param, polygon.getPath().getArray().map((x: any) => [x.lat(), x.lng()]));
                    });
                    break;
                case PolygonEventType.InsertAt:
                    this.google.maps.event.addListener(polygon.getPath(), 'insert_at', (event: any) => {
                        const param = new EventReturn([polygon.getPath()
                            .getAt(event).lat(), polygon.getPath().getAt(event).lng()]);
                        eventFunction(param, polygon.getPath().getArray().map((x: any) => [x.lat(), x.lng()]));
                    });
                    break;
                case PolygonEventType.Click:
                    this.google.maps.event.addListener(polygon, 'click', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                        eventFunction(param, polygon.object);
                    });
                    break;
                default:
                    break;
            }
        });
    }

    public removePolygonEvent(polygons: any, event: PolygonEventType): void {
        polygons.forEach((polygon: any) => {
            switch (event) {
                case PolygonEventType.Move:
                    this.google.maps.event.clearListeners(polygon.getPath(), 'set_at');
                    break;
                case PolygonEventType.InsertAt:
                    this.google.maps.event.clearListeners(polygon.getPath(), 'insert_at');
                    break;
                case PolygonEventType.Click:
                    this.google.maps.event.clearListeners(polygon, 'click');
                    break;
                default:
                    break;
            }
        });
    }

    public getPolygonsBounds(polygons: any) {
        const bounds = new this.google.maps.LatLngBounds();

        polygons.forEach((polygon: any) => {
            const paths = polygon.getPaths().getArray();

            paths.forEach((path: any) => path.getArray()
                .forEach((x: any) => bounds.extend(x)));
        });

        return bounds;
    }

    private getPolygonBounds(polygon: any) {
        const bounds = new this.google.maps.LatLngBounds();
        const paths = polygon.getPaths().getArray();

        paths.forEach((path: any) => {
            path.getArray().forEach((x) => bounds.extend(x));
        });
        return bounds;
    }
}

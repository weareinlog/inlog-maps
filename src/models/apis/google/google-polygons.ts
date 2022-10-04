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
                editable: options.editable !== null && options.editable !== undefined ?
                    options.editable : polygon.editable,
                fillColor: options.fillColor ? options.fillColor : polygon.fillColor,
                fillOpacity: options.fillOpacity ? options.fillOpacity : polygon.fillOpacity,
                strokeColor: options.color ? options.color : polygon.strokeColor,
                strokeOpacity: options.opacity ? options.opacity : polygon.strokeOpacity,
                strokeWeight: options.weight ? options.weight : polygon.strokeWeight,
                draggable: options.draggable !== null && options.draggable !== undefined ?
                    options.draggable : polygon.draggable
            };

            if (options.path) {
                const paths = [];
                options.path.forEach((path) => paths.push({ lat: path[0], lng: path[1] }));
                polygon.setPath(paths);
            }

            polygon.setOptions(newOptions);

            if (options.object) {
                polygon.object = options.object;
            }
        });
    }

    public fitBoundsPolygons(polygons: any): void {
        this.map.fitBounds(this.getPolygonsBounds(polygons));
    }

    public setCenterPolygons(polygons: any): void {
        this.map.setCenter(this.getPolygonsBounds(polygons).getCenter());
    }

    public isPolygonOnMap(polygon: any): boolean {
        return !!polygon.map;
    }

    public getPolygonPath(polygon: any): number[][] {
        return polygon.getPath().getArray().map((x: any) => [x.lat(), x.lng()]);
    }

    public addPolygonEvent(polygons: any, eventType: PolygonEventType, eventFunction: any): void {
        polygons.forEach((polygon: any) => {
            switch (eventType) {
                case PolygonEventType.SetAt:
                    this.addPolygonEventMove(polygon, eventFunction);
                    break;
                case PolygonEventType.InsertAt:
                    this.addPolygonEventInsertAt(polygon, eventFunction);
                    break;
                case PolygonEventType.RemoveAt:
                    this.addPolygonEventRemoveAt(polygon, eventFunction);
                    break;
                case PolygonEventType.DragPolygon:
                    this.addPolygonEventDragPolygon(polygon, eventFunction);
                    break;
                case PolygonEventType.Click:
                    this.addPolygonEventClick(polygon, eventFunction);
                    break;
                default:
                    break;
            }
        });
    }

    public removePolygonEvent(polygons: any, event: PolygonEventType): void {
        polygons.forEach((polygon: any) => {
            switch (event) {
                case PolygonEventType.SetAt:
                    this.google.maps.event.clearListeners(polygon.getPath(), 'set_at');
                    break;
                case PolygonEventType.InsertAt:
                    this.google.maps.event.clearListeners(polygon.getPath(), 'insert_at');
                    break;
                case PolygonEventType.RemoveAt:
                    this.google.maps.event.clearListeners(polygon.getPath(), 'remove_at');
                    break;
                case PolygonEventType.DragPolygon:
                    this.google.maps.event.clearListeners(polygon, 'dragstart');
                    this.google.maps.event.clearListeners(polygon, 'dragend');
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
            paths.forEach((path: any) => path.getArray().forEach((x: any) => bounds.extend(x)));
        });

        return bounds;
    }

    private getPolygonBounds(polygon: any) {
        const bounds = new this.google.maps.LatLngBounds();
        const paths = polygon.getPaths().getArray();

        paths.forEach((path: any) => path.getArray().forEach((x: any) => bounds.extend(x)));
        return bounds;
    }

    private addPolygonEventMove(polygon, eventFunction) {
        this.google.maps.event.addListener(polygon.getPath(), 'set_at', (newEvent: any, lastEvent: any) => {
            if (polygon.dragging)
                return;

            const path = polygon.getPath().getAt(newEvent);
            const newPosition = new EventReturn([path.lat(), path.lng()]);
            const lastPosition = new EventReturn([lastEvent.lat(), lastEvent.lng()]);

            eventFunction(newPosition, lastPosition, polygon.object, newEvent, polygon.getPath().getArray().map((x: any) => new EventReturn([x.lat(), x.lng()])));
        });
    }

    private addPolygonEventInsertAt(polygon, eventFunction) {
        this.google.maps.event.addListener(polygon.getPath(), 'insert_at', (event: any) => {
            const path = polygon.getPath();
            const newPath = path.getAt(event);
            const newPoint = new EventReturn([newPath.lat(), newPath.lng()]);

            const previousPath = path.getAt(event - 1);
            const previousPoint = previousPath ? new EventReturn([previousPath.lat(), previousPath.lng()]) : null;
            eventFunction(newPoint, previousPoint, polygon.object, event, polygon.getPath().getArray().map((x: any) => new EventReturn([x.lat(), x.lng()])));
        });
    }

    private addPolygonEventRemoveAt(polygon, eventFunction) {
        this.google.maps.event.addListener(polygon.getPath(), 'remove_at', (event: any) => {
            const param = new EventReturn([polygon.getPath().getAt(event).lat(), polygon.getPath().getAt(event).lng()]);
            eventFunction(param, polygon.getPath().getArray().map((x: any) => new EventReturn([x.lat(), x.lng()])), polygon.object);
        });
    }

    private addPolygonEventDragPolygon(polygon, eventFunction) {
        this.google.maps.event.addListener(polygon, 'dragstart', (event: any) => {
            polygon.dragging = true;
        });

        this.google.maps.event.addListener(polygon, 'dragend', (event: any) => {
            polygon.dragging = false;
            eventFunction(polygon.getPath().getArray().map((x: any) => new EventReturn([x.lat(), x.lng()])), polygon.object);
        });
    }

    private addPolygonEventClick(polygon, eventFunction) {
        this.google.maps.event.addListener(polygon, 'click', (event: any) => {
            const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
            eventFunction(param, polygon.object);
        });
    }
}

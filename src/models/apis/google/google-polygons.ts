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
        let paths = this.getPathRecursiveArray(options.path);
        paths = this.getPathPolylineArray(paths);

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
        return polygon.getPaths().getArray().map((x: any) => x.getArray().map(y => new EventReturn([y.lat(), y.lng()])));
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
                    this.google.maps.event.clearListeners(polygon.getPaths(), 'set_at');
                    break;
                case PolygonEventType.InsertAt:
                    this.google.maps.event.clearListeners(polygon.getPaths(), 'insert_at');
                    break;
                case PolygonEventType.RemoveAt:
                    this.google.maps.event.clearListeners(polygon.getPaths(), 'remove_at');
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
        const polygonPathIdx = polygon.getPaths().getLength();

        for (let index = 0; index < polygonPathIdx; index++) {
            this.addPolygonEventMoveAllPaths(polygon, polygon.getPaths().getAt(index), eventFunction);
        }
    }

    private addPolygonEventMoveAllPaths(polygon, innerPolygon, eventFunction) {
        this.google.maps.event.addListener(innerPolygon, 'set_at', (newEvent: any, lastEvent: any) => {
            if (polygon.dragging)
                return;

            const path = innerPolygon.getAt(newEvent);
            const newPosition = new EventReturn([path.lat(), path.lng()]);
            const lastPosition = new EventReturn([lastEvent.lat(), lastEvent.lng()]);

            eventFunction(newPosition, lastPosition, polygon.object, newEvent, polygon.getPaths().getArray().map((x: any) => x.getArray().map(y => new EventReturn([y.lat(), y.lng()]))));
        });
    }

    private addPolygonEventInsertAt(polygon, eventFunction) {
        const polygonPathIdx = polygon.getPaths().getLength();

        for (let index = 0; index < polygonPathIdx; index++) {
            this.addPolygonEventInsertAtAllPaths(polygon, polygon.getPaths().getAt(index), eventFunction);
        }
    }

    private addPolygonEventInsertAtAllPaths(polygon, innerPolygon, eventFunction) {
        this.google.maps.event.addListener(innerPolygon, 'insert_at', (event: any) => {
            const newPath = innerPolygon.getAt(event);
            const newPoint = new EventReturn([newPath.lat(), newPath.lng()]);

            const previousPath = innerPolygon.getAt(event - 1);
            const previousPoint = previousPath ? new EventReturn([previousPath.lat(), previousPath.lng()]) : null;
            eventFunction(newPoint, previousPoint, polygon.object, event, polygon.getPaths().getArray().map((x: any) => x.getArray().map(y => new EventReturn([y.lat(), y.lng()]))));
        });
    }

    private addPolygonEventRemoveAt(polygon, eventFunction) {
        const polygonPathIdx = polygon.getPaths().getLength();

        for (let index = 0; index < polygonPathIdx; index++) {
            this.addPolygonEventRemoveAtAllPaths(polygon, polygon.getPaths().getAt(index), eventFunction)
        }
    }

    private addPolygonEventRemoveAtAllPaths(polygon, innerPolygon, eventFunction) {
        this.google.maps.event.addListener(innerPolygon, 'remove_at', (event: any) => {
            const param = new EventReturn([innerPolygon.getAt(event).lat(), innerPolygon.getAt(event).lng()]);
            eventFunction(param, polygon.getPaths().getArray().map((x: any) => x.getArray().map(y => new EventReturn([y.lat(), y.lng()]))), polygon.object);
        });
    }

    private addPolygonEventDragPolygon(polygon, eventFunction) {
        this.google.maps.event.addListener(polygon, 'dragstart', (event: any) => {
            polygon.dragging = true;
        });

        this.google.maps.event.addListener(polygon, 'dragend', (event: any) => {
            polygon.dragging = false;
            eventFunction(polygon.getPaths().getArray().map((x: any) => x.getArray().map(y => new EventReturn([y.lat(), y.lng()]))), polygon.object);
        });
    }

    private addPolygonEventClick(polygon, eventFunction) {
        this.google.maps.event.addListener(polygon, 'click', (event: any) => {
            const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
            eventFunction(param, polygon.object);
        });
    }

    private getPathRecursiveArray(path: any) {
        if (Array.isArray(path) && typeof path[0] !== 'number') {
            return path.map(x => this.getPathRecursiveArray(x));
        }
        else return { lat: path[0], lng: path[1] }
    }

    private getPathPolylineArray(path: any) {
        if (typeof path[0].lat === 'number') {
            return path;
        }
        else if (typeof path[0][0].lat !== 'number') {
            path = path[0];
            return this.getPathPolylineArray(path);
        } else return path;
    }
}

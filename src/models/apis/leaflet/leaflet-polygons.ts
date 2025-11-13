import { PolygonEventType } from '../../dto/event-type';
import EventReturn from '../../features/events/event-return';
import PolygonAlterOptions from '../../features/polygons/polygon-alter-options';
import PolygonOptions from '../../features/polygons/polygon-options';

export default class LeafletPolygons {
    private map: any = {};
    private leaflet: any = {};

    constructor(map: any, leaflet: any) {
        this.map = map;
        this.leaflet = leaflet;
    }

    public drawPolygon(options: PolygonOptions, eventClick: any) {
        const self = this;
        const newOptions = {
            color: options.color || '#000',
            draggable: options.draggable,
            fillColor: options.fillColor || '#fff',
            fillOpacity: options.fillOpacity || 1,
            opacity: options.opacity || 1,
            weight: options.weight || 2
        };
        const polygon = new this.leaflet.Polygon(options.path, newOptions);

        if (eventClick) {
            polygon.on('click', (event: any) => {
                self.leaflet.DomEvent.stopPropagation(event);
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, event.target.object);
            });
        }

        if (options.addToMap) {
            polygon.addTo(self.map);

            if (options.editable) {
                polygon.enableEdit();
            }
        }

        if (options.object) {
            polygon.object = options.object;
        }

        if (options.fitBounds) {
            self.map.fitBounds(polygon.getBounds());
        }

        return polygon;
    }

    public togglePolygons(polygons: any[], show: boolean) {
        const self = this;
        polygons.forEach((polygon) => show ? self.map.addLayer(polygon) : self.map.removeLayer(polygon));
    }

    public alterPolygonOptions(polygons: any[], options: PolygonAlterOptions) {
        polygons.forEach((polygon) => {
            const style = {
                color: options.color ? options.color : polygon.options.color,
                draggable: options.draggable ? options.draggable : polygon.options.draggable,
                fillColor: options.fillColor ? options.fillColor : polygon.options.fillColor,
                fillOpacity: options.fillOpacity ? options.fillOpacity : polygon.options.fillOpacity,
                opacity: options.opacity ? options.opacity : polygon.options.opacity,
                weight: options.weight ? options.weight : polygon.options.weight
            };

            if (options.path) {
                polygon.setLatLngs(options.path);
            }

            polygon.setStyle(style);

            if (options.editable !== null && options.editable !== undefined) {
                polygon.disableEdit();

                if (options.editable) {
                    polygon.enableEdit();
                }
            }

            if (options.object) {
                polygon.object = options.object;
            }
        });
    }

    public fitBoundsPolygons(polygons: any): void {
        this.map.fitBounds(this.getBoundsPolygons(polygons));
    }

    public setCenterPolygons(polygons: any): void {
        this.map.panTo(this.getBoundsPolygons(polygons).getCenter());
    }

    public isPolygonOnMap(polygon: any): boolean {
        return this.map.hasLayer(polygon);
    }

    public getPolygonPath(polygon: any): number[][] {
        let array = polygon.getLatLngs()[0];
        if (!array.map((x: any) => Array.isArray(x))[0]) {
            array = polygon.getLatLngs();
        }

        let coords = array.map((x: any) => x.map((y: any) => new EventReturn([y.lat, y.lng])));

        for (let item in coords) {
            // Ensure the polygon is closed
            if (coords[item][0].latlng[0] != coords[item][coords[item].length - 1].latlng[0] &&
                coords[item][0].latlng[1] != coords[item][coords[item].length - 1].latlng[1])
                coords[item].push(coords[item][0]);
        }
        return coords;
    }

    public addPolygonEvent(polygons: any, eventType: PolygonEventType, eventFunction: any): void {
        const self = this;
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
                    this.addPolygonEventClick(polygon, eventFunction, self);
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
                    polygon.off('editable:vertex:dragstart');
                    break;
                case PolygonEventType.InsertAt:
                    polygon.off('editable:vertex:new');
                    break;
                case PolygonEventType.RemoveAt:
                    polygon.off('editable:vertex:clicked');
                    polygon.off('editable:vertex:deleted');
                    break;
                case PolygonEventType.DragPolygon:
                    polygon.off('dragend');
                    break;
                case PolygonEventType.Click:
                    polygon.off('click');
                    break;
            }
        });
    }

    public getBoundsPolygons(polygons: any) {
        const group = new this.leaflet.FeatureGroup(polygons);
        return group.getBounds();
    }

    private addPolygonEventMove(polygon: any, eventFunction: any) {
        polygon.on('editable:vertex:dragstart', (eventStart: any) => {
            const lastPosition = new EventReturn([eventStart.vertex.latlng.lat, eventStart.vertex.latlng.lng]);

            polygon.on('editable:vertex:dragend', (eventEnd: any) => {
                const newPosition = new EventReturn([eventEnd.vertex.latlng.lat, eventEnd.vertex.latlng.lng]);
                const path = polygon.getLatLngs().map((x: any) => {
                    if (Array.isArray(x[0])) {
                        return x.map((y: any) => y.map((z: { lat: number; lng: number; }) => new EventReturn([z.lat, z.lng])));
                    } else {
                        return [x.map((y: any) => new EventReturn([y.lat, y.lng]))];
                    }
                });

                eventFunction(newPosition, lastPosition, eventEnd.target.object, eventEnd.vertex.getIndex(), path[0]);
                polygon.off('editable:vertex:dragend');
            });
        });
    }

    private addPolygonEventInsertAt(polygon: any, eventFunction: any) {
        polygon.on('editable:vertex:new', (eventNew: any) => {
            const latlngs = eventNew.vertex.latlngs;
            const previous = latlngs[latlngs.findIndex((x: any) => x === eventNew.vertex.latlng) - 1];

            if (previous) {
                const previousPoint = new EventReturn([previous.lat, previous.lng]);

                polygon.on('editable:vertex:dragend', (event: any) => {
                    const newPoint = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                    const path = polygon.getLatLngs().map((x: any) => {
                        if (Array.isArray(x[0])) {
                            return x.map((y: any) => y.map((z: { lat: number; lng: number; }) => new EventReturn([z.lat, z.lng])));
                        } else {
                            return [x.map((y: any) => new EventReturn([y.lat, y.lng]))];
                        }
                    });

                    eventFunction(newPoint, previousPoint, event.target.object, event.vertex.getIndex(), path[0]);
                    polygon.off('editable:vertex:dragend');
                });
            }
        });
    }

    private addPolygonEventRemoveAt(polygon: any, eventFunction: any) {
        polygon.on('editable:vertex:deleted', (event: any) => {
            const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);

            const path = polygon.getLatLngs().map((x: any) => {
                if (Array.isArray(x[0])) {
                    return x.map((y: any) => y.map((z: { lat: number; lng: number; }) => new EventReturn([z.lat, z.lng])));
                } else {
                    return [x.map((y: any) => new EventReturn([y.lat, y.lng]))];
                }
            });

            eventFunction(param, path[0], event.target.object);
        });
    }

    private addPolygonEventDragPolygon(polygon: any, eventFunction: any) {
        polygon.on('dragend', (event: any) => {
            const path = polygon.getLatLngs().map((x: any) => {
                if (Array.isArray(x[0])) {
                    return x.map((y: any) => y.map((z: { lat: number; lng: number; }) => new EventReturn([z.lat, z.lng])));
                } else {
                    return [x.map((y: any) => new EventReturn([y.lat, y.lng]))];
                }
            });

            eventFunction(path[0], event.target.object);
        });
    }

    private addPolygonEventClick(polygon: any, eventFunction: any, self: any) {
        polygon.on('click', (event: any) => {
            self.leaflet.DomEvent.stopPropagation(event);
            const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            eventFunction(param, event.target.object);
        });
    }
}

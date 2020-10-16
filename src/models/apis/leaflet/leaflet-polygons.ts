import { PolygonEventType } from '../../dto/event-type';
import EventReturn from '../../features/events/event-return';
import PolygonAlterOptions from '../../features/polygons/polygon-alter-options';
import PolygonOptions from '../../features/polygons/polygon-options';

export default class LeafletPolygons {
    private map = null;
    private leaflet = null;

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
                fillColor: options.fillColor ? options.fillColor : polygon.options.fillColor,
                fillOpacity: options.fillOpacity ? options.fillOpacity : polygon.options.fillOpacity,
                opacity: options.opacity ? options.opacity : polygon.options.opacity,
                weight: options.weight ? options.weight : polygon.options.weight
            };

            polygon.setStyle(style);

            if (options.editable !== null && options.editable !== undefined) {
                if (options.editable) {
                    polygon.enableEdit();
                } else {
                    polygon.disableEdit();
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

    public addPolygonEvent(polygons: any, eventType: PolygonEventType, eventFunction: any): void {
        const self = this;
        polygons.forEach((polygon: any) => {
            switch (eventType) {
                case PolygonEventType.Move:
                    polygon.on('dragend', (event: any) => {
                        const param = new EventReturn([event.target.getCenter().lat, event.target.getCenter().lng]);
                        eventFunction(param, event.target.getLatLngs()[0].map((x: any) => [x.lat, x.lng],
                            event.target.object));
                    });
                    break;
                case PolygonEventType.InsertAt:
                    polygon.on('editable:vertex:dragend', (event: any) => {
                        const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                        eventFunction(param, event.vertex.latlngs.map((x: any) => [x.lat, x.lng]), event.target.object);
                    });

                    polygon.on('editable:vertex:clicked', (event: any) => {
                        const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                        eventFunction(param, event.vertex.latlngs.map((x: any) => [x.lat, x.lng]), event.target.object);
                    });
                    break;
                case PolygonEventType.Click:
                    polygon.on('click', (event: any) => {
                        self.leaflet.DomEvent.stopPropagation(event);
                        const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                        eventFunction(param, event.target.object);
                    });
                    break;
            }
        });
    }

    public removePolygonEvent(polygons: any, event: PolygonEventType): void {
        polygons.forEach((polygon: any) => {
            switch (event) {
                case PolygonEventType.Move:
                    polygon.off('editable:vertex:dragstart');
                    break;
                case PolygonEventType.InsertAt:
                    polygon.off('editable:vertex:dragend');
                    break;
                case PolygonEventType.Click:
                    polygon.off('click');
                    break;
            }
        });
    }

    public getBoundsPolygons(polygons) {
        const group = new this.leaflet.FeatureGroup(polygons);
        return group.getBounds();
    }
}

import CircleOptions from "../../features/circle/circle-options";
import EventReturn from "../../features/events/event-return";
import CircleAlterOptions from "../../features/circle/circle-alter-options";
import { CircleEventType } from "../../dto/event-type";

export default class LeafletCircles {
    private map = null;
    private leaflet = null;

    constructor(map: any, leaflet: any) {
        this.map = map;
        this.leaflet = leaflet;
    }

    public drawCircle(options: CircleOptions, eventClick: any) {
        const self = this;
        const newOptions = {
            color: options.color,
            draggable: options.draggable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            opacity: options.opacity,
            radius: options.radius,
            weight: options.weight
        };
        const circle = new this.leaflet.Circle(options.center, newOptions);

        if (eventClick) {
            circle.on('click', (event: any) => {
                const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                eventClick(param, event.target.object);
            });
        }

        if (options.addToMap) {
            circle.addTo(self.map);

            if (options.editable) {
                circle.enableEdit();
            }
        }

        if (options.object) {
            circle.object = options.object;
        }

        if (options.fitBounds) {
            self.map.fitBounds(circle.getBounds());
        }

        return circle;
    }

    public toggleCircles(circles: any[], show: boolean) {
        const self = this;
        circles.forEach((circle) => show ? self.map.addLayer(circle) : self.map.removeLayer(circle));
    }

    public alterCircleOptions(circles: any[], options: CircleAlterOptions) {
        circles.forEach((circle) => {
            const style = {
                color: options.color ? options.color : circle.options.color,
                fillColor: options.fillColor ? options.fillColor : circle.options.fillColor,
                fillOpacity: options.fillOpacity ? options.fillOpacity : circle.options.fillOpacity,
                opacity: options.opacity ? options.opacity : circle.options.opacity,
                weight: options.weight ? options.weight : circle.options.weight
            };

            circle.setStyle(style);

            if (options.radius) {
                circle.setRadius(options.radius);
            }

            if (options.center) {
                circle.setLatLng(options.center);
            }
        });
    }

    public fitBoundsCircles(circles: any) {
        this.map.fitBounds(this.getBoundsCircles(circles));
    }

    public isCircleOnMap(circle: any): boolean {
        return this.map.hasLayer(circle);
    }

    public getCircleCenter(circle: any): number[] {
        const center = circle.getLatLng();

        return [center.lat, center.lng];
    }

    public addCircleEvent(circles: any, eventType: CircleEventType, eventFunction: any): void {
        circles.forEach((circle: any) => {
            switch (eventType) {
                case CircleEventType.Click:
                    circle.on('click', (event: any) => {
                        const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                        eventFunction(param, circle.object);
                    });
                case CircleEventType.CenterChanged:
                    circle.on('dragend', (event: any) => {
                        const param = new EventReturn([event.target.getLatLng().lat, event.target.getLatLng().lng]);
                        eventFunction(param, circle.object);
                    });
                case CircleEventType.RadiusChanged:
                    circle.on('editable:vertex:dragend', (event: any) => {
                        const param = new EventReturn([event.vertex.latlng.lat, event.vertex.latlng.lng]);
                        eventFunction(param, circle.object, circle.getRadius());
                    });
                default:
                    break;
            }
        });
    }

    public removeCircleEvent(circles: any, event: CircleEventType): void {
        circles.forEach((circle: any) => {
            switch (event) {
                case CircleEventType.Click:
                    circle.off('click');
                case CircleEventType.CenterChanged:
                    circle.off('dragend');
                case CircleEventType.RadiusChanged:
                    circle.off('editable:vertex:dragend');
                default:
                    break;
            }
        });
    }

    private getBoundsCircles(circles: any) {
        const group = new this.leaflet.FeatureGroup(circles);
        return group.getBounds();
    }
}

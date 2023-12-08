import { CircleEventType } from '../../dto/event-type';
import CircleAlterOptions from '../../features/circle/circle-alter-options';
import CircleOptions from '../../features/circle/circle-options';
import EventReturn from '../../features/events/event-return';

export default class GoogleCircles {
    private map: any = {};
    private google: any = {};

    constructor(map: any, google: any) {
        this.map = map;
        this.google = google;
    }

    public drawCircle(options: CircleOptions, eventClick: any) {
        const self = this;
        const latlng = {
            lat: options.center[0],
            lng: options.center[1]
        };
        const newOptions = {
            center: latlng,
            draggable: options.draggable,
            editable: options.editable,
            fillColor: options.fillColor,
            fillOpacity: options.fillOpacity,
            object: options.object,
            radius: options.radius,
            strokeColor: options.color,
            strokeOpacity: options.opacity,
            strokeWeight: options.weight,
            suppressUndo: true
        };

        const circle = new this.google.maps.Circle(newOptions);

        if (eventClick) {
            this.google.maps.event.addListener(circle, 'click', (event: any) => {
                const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                eventClick(param, options.object);
            });
        }

        if (options.addToMap) {
            circle.setMap(self.map);
        }

        if (options.fitBounds) {
            self.map.fitBounds(circle.getBounds());
        }

        return circle;
    }

    public toggleCircles(circles: any[], show: boolean) {
        const self = this;
        circles.forEach((circle) => circle.setMap(show ? self.map : null));
    }

    public alterCircleOptions(circles: any[], options: CircleAlterOptions) {
        circles.forEach((circle) => {
            const latlng = options.center && options.center.length > 0 ?
                { lat: options.center[0], lng: options.center[1] } : circle.getCenter();

            const newOptions = {
                center: latlng,
                fillColor: options.fillColor ? options.fillColor : circle.fillColor,
                fillOpacity: options.fillOpacity ? options.fillOpacity : circle.fillOpacity,
                radius: options.radius ? options.radius : circle.radius,
                strokeColor: options.color ? options.color : circle.strokeColor,
                strokeOpacity: options.opacity ? options.opacity : circle.strokeOpacity,
                strokeWeight: options.weight ? options.weight : circle.strokeWeight,
                editable: options.editable !== null && options.editable !== undefined ?
                    options.editable : circle.editable,
                draggable: options.draggable !== null && options.draggable !== undefined ?
                    options.draggable : circle.draggable
            };

            circle.setOptions(newOptions);
        });
    }

    public fitBoundsCircles(circles: any): void {
        this.map.fitBounds(this.getCirclesBounds(circles));
    }

    public isCircleOnMap(circle: any): boolean {
        return !!circle.map;
    }

    public getCircleCenter(circle: any): number[] {
        const center = circle.getCenter();

        return [center.lat(), center.lng()];
    }

    public getCircleRadius(circle: any): number {
        return circle.getRadius();
    }

    public addCircleEvent(circles: any, eventType: CircleEventType, eventFunction: any): void {
        circles.forEach((circle: any) => {
            switch (eventType) {
                case CircleEventType.Click:
                    this.google.maps.event.addListener(circle, 'click', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                        eventFunction(param, circle.object);
                    });
                    break;
                case CircleEventType.CenterChanged:
                    this.google.maps.event.addListener(circle, 'center_changed', () => {
                        const param = new EventReturn([circle.getCenter().lat(), circle.getCenter().lng()]);
                        eventFunction(param, circle.object);
                    });
                    break;
                case CircleEventType.RadiusChanged:
                    this.google.maps.event.addListener(circle, 'radius_changed', (event: any) => {
                        const param = new EventReturn([circle.getCenter().lat(), circle.getCenter().lng()]);
                        eventFunction(param, circle.object, circle.getRadius());
                    });
                    break;
                default:
                    break;
            }
        });
    }

    public removeCircleEvent(circles: any, event: CircleEventType): void {
        circles.forEach((circle: any) => {
            switch (event) {
                case CircleEventType.Click:
                    this.google.maps.event.clearListeners(circle, 'click');
                    break;
                case CircleEventType.CenterChanged:
                    this.google.maps.event.clearListeners(circle, 'center_changed');
                    break;
                case CircleEventType.RadiusChanged:
                    this.google.maps.event.clearListeners(circle, 'radius_changed');
                    break;
                default:
                    break;
            }
        });
    }

    private getCirclesBounds(circles: any) {
        const bounds = new this.google.maps.LatLngBounds();

        circles.forEach((circulo: any) => bounds.union(circulo.getBounds()));
        return bounds;
    }
}

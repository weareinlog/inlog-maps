import { MapEventType } from '../../dto/event-type';
import EventReturn from '../../features/events/event-return';

export default class GoogleMap {
    private map = null;
    private google = null;

    constructor(map: any, google: any) {
        this.map = map;
        this.google = google;
    }

    public resizeMap(): void {
        google.maps.event.trigger(this.map, 'resize');
    }

    public addEventMap(eventType: MapEventType, eventFunction: any) {
        const self = this;

        switch (eventType) {
            case MapEventType.Click:
                this.google.maps.event.addListener(self.map, 'click', (event: any) => {
                    const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                    eventFunction(param);
                });
                break;
            case MapEventType.ZoomChanged:
                self.map.addListener('zoom_changed', () => {
                    const param = new EventReturn([self.map.getCenter().lat(), self.map.getCenter().lng()]);
                    eventFunction(param);
                });
            default:
                break;
        }
    }

    public removeEventMap(eventType: MapEventType) {
        const self = this;
        switch (eventType) {
            case MapEventType.Click:
                this.google.maps.event.clearListeners(self.map, 'click');
                break;
            case MapEventType.ZoomChanged:
                this.google.maps.event.clearListeners(self.map, 'zoom_changed');
            default:
                break;
        }
    }

    public getZoom(): number {
        return this.map.getZoom();
    }

    public setZoom(zoom: number) {
        return this.map.setZoom(zoom);
    }

    public getCenter(): number[] {
        const center = this.map.getCenter();
        return [center.lat(), center.lng()];
    }

    public setCenter(position: number[]) {
        this.map.setCenter(new google.maps.LatLng(position[0], position[1]));
    }

    public pixelsToLatLng(offsetx: number, offsety: number) {
        const scale = Math.pow(2, this.map.getZoom());
        const worldCoordinateCenter = this.map.getProjection().fromLatLngToPoint(this.map.getCenter());
        const pixelOffset = new google.maps.Point(offsetx / scale || 0, offsety / scale || 0);

        const worldCoordinateNewCenter = new google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        const latlng = this.map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        return [latlng.lat(), latlng.lng()];
    }
}

import { MapEventType } from "../../dto/event-type";
import EventReturn from "../../features/events/event-return";

export default class LeafletMap {
    private map = null;
    private leaflet = null;

    constructor(map: any, leaflet: any) {
        this.map = map;
        this.leaflet = leaflet;
    }

    public resizeMap(): void {
        this.map.invalidateSize();
    }

    public addEventMap(eventType: MapEventType, eventFunction: any) {
        const self = this;

        switch (eventType) {
            case MapEventType.Click:
                self.map.on('click', (event: any) => {
                    const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
                    eventFunction(param);
                });
                break;
            case MapEventType.ZoomChanged:
                self.map.on('zoomend', (event: any) => {
                    const param = new EventReturn([event.target.getCenter().lat, event.target.getCenter().lng]);
                    eventFunction(param);
                });
            default:
                break;
        }
    }

    public removeEventMap(eventType: MapEventType) {
        const self = this;
        switch (eventType) {
            case MapEventType.Click: self.map.off('click'); break;
            case MapEventType.ZoomChanged: self.map.off('zoomend');
            default: break;
        }
    }

    public getZoom(): number {
        return this.map.getZoom();
    }

    public setZoom(zoom: number) {
        this.map.setZoom(zoom);
    }

    public getCenter(): number[] {
        return this.map.getCenter();
    }

    public setCenter(position: number[]) {
        this.map.panTo(position);
    }

    public pixelsToLatLng(offsetx: number, offsety: number) {
        const scale = Math.pow(2, this.map.getZoom());
        const worldCoordinateCenter = this.map.project(this.map.getCenter());
        const pixelOffset = new this.leaflet.Point(offsetx / scale || 0, offsety / scale || 0);

        const worldCoordinateNewCenter = new this.leaflet.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        const latlng = this.map.unproject(worldCoordinateNewCenter);
        return [latlng.lat, latlng.lng];
    }
}

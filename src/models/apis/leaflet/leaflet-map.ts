import { MapEventType } from "../../dto/event-type";
import EventReturn from "../../features/events/event-return";

export default class LeafletMap {
    private map: any = {};
    private leaflet: any = {};
    private leafletPolyline?: any = {};

    constructor(map: any, leaflet: any, leafletPolyline?: any) {
        this.map = map;
        this.leaflet = leaflet;
        this.leafletPolyline = leafletPolyline;
    }

    public resizeMap(): void {
        this.map.invalidateSize();
    }

    public addEventMap(eventType: MapEventType, eventFunction: any) {
        const self = this;

        switch (eventType) {
            case MapEventType.Click:
                self.map.on("click", (event: any) => {
                    const param = new EventReturn([
                        event.latlng.lat,
                        event.latlng.lng,
                    ]);
                    const isEdit =
                        self.leafletPolyline?.getEditModeBlockingMapClick();
                    if (!isEdit) {
                        eventFunction(param);
                    }
                });
                break;
            case MapEventType.ZoomChanged:
                self.map.on("zoomend", (event: any) => {
                    const param = new EventReturn([
                        event.target.getCenter().lat,
                        event.target.getCenter().lng,
                    ]);
                    eventFunction(param);
                });
                break;
            default:
                break;
        }
    }

    public removeEventMap(eventType: MapEventType) {
        const self = this;
        switch (eventType) {
            case MapEventType.Click:
                self.map.off("click");
                break;
            case MapEventType.ZoomChanged:
                self.map.off("zoomend");
                break;
            default:
                break;
        }
    }

    public getZoom(): number {
        return this.map.getZoom();
    }

    public setZoom(zoom: number) {
        this.map.setZoom(zoom);
    }
    public async takeScreenShot() {
        return await this.leaflet.takeMapScreenshot();
    }

    public getCenter(): number[] {
        const center = this.map.getCenter();
        return [center.lat, center.lng];
    }

    public setCenter(position: number[]) {
        this.map.panTo(position);
    }

    public pixelsToLatLng(offsetx: number, offsety: number) {
        const scale = Math.pow(2, this.map.getZoom());
        const worldCoordinateCenter = this.leaflet.CRS.Simple.project(
            this.map.getCenter()
        );
        const pixelOffset = new this.leaflet.Point(
            offsetx / scale || 0,
            offsety / scale || 0
        );

        const worldCoordinateNewCenter = new this.leaflet.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        const latlng = this.leaflet.CRS.Simple.unproject(
            worldCoordinateNewCenter
        );
        return [latlng.lat, latlng.lng];
    }

    public fitBoundsElements(
        markers: any,
        circles: any,
        polygons: any,
        polylines: any
    ): void {
        const group: any[] = [];

        if (markers && markers.length) {
            markers.forEach((marker: any) => group.push(marker));
        }

        if (circles && circles.length) {
            circles.forEach((circle: any) => group.push(circle));
        }

        if (polygons && polygons.length) {
            polygons.forEach((polygon: any) => group.push(polygon));
        }

        if (polylines && polylines.length) {
            polylines.forEach((polyline: any) => group.push(polyline));
        }

        if (group && group.length) {
            const bounds = this.leaflet.featureGroup(group).getBounds();
            this.map.fitBounds(bounds);
        }
    }
}

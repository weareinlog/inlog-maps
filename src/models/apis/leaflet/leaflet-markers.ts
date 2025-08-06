import { MarkerEventType } from "../../dto/event-type";
import EventReturn from "../../features/events/event-return";
import MarkerClustererConfig from "../../features/marker-clusterer/marker-clusterer-config";
import CircleMarkerOptions from "../../features/marker/circle-marker-options";
import MarkerAlterOptions from "../../features/marker/marker-alter-options";
import MarkerOptions from "../../features/marker/marker-options";

export default class LeafletMarkers {
    private map: any = {};
    private leaflet: any = {};

    constructor(map: any, leaflet: any) {
        this.map = map;
        this.leaflet = leaflet;
    }

    /* Markers */
    public drawMarker(options: MarkerOptions, eventClick: any) {
        const newOptions: any = {
            draggable: options.draggable,
        };

        if (options.icon) {
            newOptions.icon = new this.leaflet.Icon({
                iconUrl: options.icon.url,
            });

            const size = options.icon.size;
            if (size) {
                newOptions.icon.options.iconSize = size;
                newOptions.icon.options.iconAnchor = [size[0] / 2, size[1]];
                newOptions.icon.options.popupAnchor = [0, -size[1]];
            }
        }

        const marker = new this.leaflet.Marker(options.latlng, newOptions);

        if (options.object) {
            marker.object = options.object;
        }

        if (eventClick) {
            marker.on("click", (event: any) => {
                const param = new EventReturn([
                    event.latlng.lat,
                    event.latlng.lng,
                ]);
                eventClick(param, event.target.object);
            });
        }

        if (options.addToMap && !options.addClusterer) {
            marker.addTo(this.map);
        }

        if (options.fitBounds) {
            const group = new this.leaflet.FeatureGroup([marker]);
            this.map.fitBounds(group.getBounds());
        }

        return marker;
    }

    public drawCircleMarker(options: CircleMarkerOptions, eventClick: any) {
        const self = this;
        const marker = new this.leaflet.circleMarker(
            options.latlng,
            options.style
        );

        if (eventClick) {
            marker.on("click", (event: any) => {
                const param = new EventReturn([
                    event.latlng.lat,
                    event.latlng.lng,
                ]);
                eventClick(param, event.target.object);
            });
        }

        if (options.style.label) {
            const { text, permanent, direction, open } = options.style.label;
            const tooltipOptions = { permanent, direction };
        
            marker.bindTooltip(text, tooltipOptions);
        
            if (open) {
                marker.openTooltip();
            }
        }

        if (options.addToMap) {
            marker.addTo(self.map);
        }

        if (options.fitBounds) {
            const group = new this.leaflet.FeatureGroup([marker]);
            self.map.fitBounds(group.getBounds());
        }

        marker.object = options.object;
        return marker;
    }

    public toggleMarkers(markers: any[], show: boolean, markerClusterer?: any) {
        const self = this;
        markers.forEach((marker) => {
            if (markerClusterer) {
                if (show) {
                    self.addMarkerOnClusterer(marker, markerClusterer);
                } else {
                    self.removeMarkerFromClusterer(marker, markerClusterer);
                }
            } else {
                if (show) {
                    self.map.addLayer(marker);
                } else {
                    self.map.removeLayer(marker);
                }
            }
        });
    }

    public alterMarkerOptions(markers: any[], options: MarkerAlterOptions) {
        markers.forEach((marker) => {
            if (marker.type === "circle" && options.style) {
                const style = {
                    fillColor: options.style.fillColor
                        ? options.style.fillColor
                        : marker.options.fillColor,
                    fillOpacity: options.style.fillOpacity
                        ? options.style.fillOpacity
                        : marker.options.fillOpacity,
                    radius: options.style.radius
                        ? options.style.radius
                        : marker.options.radius,
                    strokeColor: options.style.color
                        ? options.style.color
                        : marker.options.strokeColor,
                    strokeWeight: options.style.weight
                        ? options.style.weight
                        : marker.options.strokeWeight,
                };

                marker.setStyle(style);
            }

            if (options.icon) {
                const icon = new this.leaflet.icon({
                    iconUrl: options.icon.url,
                });
                const size = options.icon.size;

                if (size) {
                    icon.options.iconSize = size;
                    icon.options.iconAnchor = [size[0] / 2, size[1]];
                }

                marker.setIcon(icon);
            }

            if (options.latlng) {
                marker.setLatLng(options.latlng);
            }
        });
    }

    public alterMarkerPosition(
        markers: any[],
        position: number[],
        addTransition: boolean
    ) {
        markers.forEach((marker) => {
            if (addTransition) {
                this.moveTransitionMarker(position, marker);
            } else {
                marker.setLatLng(position);
            }
        });
    }

    public fitBoundsPositions(markers: any[]) {
        const group = new this.leaflet.featureGroup(markers);
        this.map.fitBounds(group.getBounds());
    }

    public isMarkerOnMap(marker: any): boolean {
        return this.map.hasLayer(marker);
    }

    public setCenterMarker(marker: any) {
        this.map.panTo(marker.getLatLng());
    }

    public addMarkerEvent(
        markers: any,
        eventType: MarkerEventType,
        eventFunction: any
    ) {
        markers.forEach((marker: any) => {
            switch (eventType) {
                case MarkerEventType.Click:
                    marker.on("click", (event: any) => {
                        const param = new EventReturn([
                            event.latlng.lat,
                            event.latlng.lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.RightClick:
                    marker.on("contextmenu", (event: any) => {
                        const param = new EventReturn([
                            event.latlng.lat,
                            event.latlng.lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.AfterDrag:
                    marker.on("dragend", (event: any) => {
                        const param = new EventReturn([
                            event.target.getLatLng().lat,
                            event.target.getLatLng().lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.MouseOver:
                    marker.on("mouseover", (event: any) => {
                        const param = new EventReturn([
                            event.latlng.lat,
                            event.latlng.lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.MouseOut:
                    marker.on("mouseout", (event: any) => {
                        const param = new EventReturn([
                            event.latlng.lat,
                            event.latlng.lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.BeforeDrag:
                    marker.on("dragstart", (event: any) => {
                        const param = new EventReturn([
                            event.target.getLatLng().lat,
                            event.target.getLatLng().lng,
                        ]);
                        eventFunction(param, marker.object);
                    });
                    break;
                default:
                    break;
            }
        });
    }

    public removeMarkerEvent(markers: any, event: MarkerEventType): void {
        markers.forEach((marker: any) => {
            switch (event) {
                case MarkerEventType.Click:
                    marker.off("click");
                    break;
                case MarkerEventType.RightClick:
                    marker.off("contextmenu");
                    break;
                case MarkerEventType.AfterDrag:
                    marker.off("dragend");
                    break;
                case MarkerEventType.MouseOver:
                    marker.off("mouseover");
                    break;
                case MarkerEventType.MouseOut:
                    marker.off("mouseout");
                    break;
                case MarkerEventType.BeforeDrag:
                    marker.off("dragstart");
                    break;
                default:
                    break;
            }
        });
    }

    /* Marker Clusterer */
    public addMarkerClusterer(config: MarkerClustererConfig): any {
        const layer = this.leaflet.markerClusterGroup({
            maxClusterRadius: 50,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: config.clusterZoomOnClick,
        });

        this.map.addLayer(layer);
        return layer;
    }

    public alterMarkerClustererConfig(
        markerClusterer: any,
        config: MarkerClustererConfig
    ): void {
        markerClusterer.options.zoomToBoundsOnClick = config.clusterZoomOnClick;
    }

    public refreshClusterer(markerClusterer: any): void {
        markerClusterer.refreshClusters();
    }

    public addMarkerOnClusterer(marker: any, markerClusterer: any): void {
        markerClusterer.addLayer(marker);
    }

    public removeMarkerFromClusterer(marker: any, markerClusterer: any): void {
        markerClusterer.removeLayer(marker);
    }

    public clearMarkersClusterer(markerClusterer: any): void {
        markerClusterer.clearLayers();
    }

    public countMarkersOnCluster(markerClusterer: any): number {
        return markerClusterer.getLayers().length;
    }

    private moveTransitionMarker(position: any, marker: any) {
        const numDeltas = 5;
        const reference = {
            deltaLat: (position[0] - marker.getLatLng().lat) / numDeltas,
            deltaLng: (position[1] - marker.getLatLng().lng) / numDeltas,
            i: 0,
            position: [marker.getLatLng().lat, marker.getLatLng().lng],
            lastPosition: position,
        };

        this.moveMarker(marker, reference, numDeltas);
    }

    private moveMarker(marker: any, reference: any, numDeltas: number) {
        reference.position[0] += reference.deltaLat;
        reference.position[1] += reference.deltaLng;
        marker.setLatLng(reference.position);
        if (reference.i < numDeltas) {
            reference.i++;
            setTimeout(() => this.moveMarker(marker, reference, numDeltas), 20);
        } else if (reference.i === numDeltas) {
            setTimeout(() => marker.setLatLng(reference.lastPosition), 20);
        }
    }
}

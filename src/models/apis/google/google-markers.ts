import { MarkerEventType } from '../../dto/event-type';
import EventReturn from '../../features/events/event-return';
import MarkerClustererConfig from '../../features/marker-clusterer/marker-clusterer-config';
import CircleMarkerOptions from '../../features/marker/circle-marker-options';
import MarkerAlterOptions from '../../features/marker/marker-alter-options';
import MarkerOptions from '../../features/marker/marker-options';

const MarkerClusterer = require('@google/markerclustererplus');

export default class GoogleMarkers {
    private map = null;
    private google = null;

    constructor(map: any, google: any) {
        this.map = map;
        this.google = google;
    }

    public drawMarker(options: MarkerOptions, eventClick: any) {
        const newOptions = {
            draggable: options.draggable,
            icon: null,
            object: options.object,
            position: {
                lat: options.latlng[0],
                lng: options.latlng[1]
            }
        };

        if (options.icon) {
            newOptions.icon = {
                url: options.icon.url
            };

            if (options.icon.size) {
                newOptions.icon.size = new this.google.maps.Size(options.icon.size[0], options.icon.size[1]);
            }
        }
        const marker = new this.google.maps.Marker(newOptions);

        if (eventClick) {
            this.google.maps.event.addListener(marker, 'click', (event: any) => {
                const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);

                eventClick(param, options.object);
            });
        }

        if (options.addToMap) {
            marker.setMap(this.map);
        }

        if (options.fitBounds) {
            const bounds = new this.google.maps.LatLngBounds();

            bounds.extend(marker.getPosition());
            this.map.fitBounds(bounds);
        }

        return marker;
    }

    public drawCircleMarker(options: CircleMarkerOptions, eventClick: any) {
        const self = this;
        const newOptions = {
            icon: {
                fillColor: options.style.fillColor,
                fillOpacity: options.style.fillOpacity,
                path: this.google.maps.SymbolPath.CIRCLE,
                scale: options.style.radius,
                strokeColor: options.style.color,
                strokeWeight: options.style.weight
            },
            object: options.object,
            position: {
                lat: options.latlng[0],
                lng: options.latlng[1]
            }
        };

        const marker = new this.google.maps.Marker(newOptions);

        if (eventClick) {
            this.google.maps.event.addListener(marker, 'click', (event: any) => {
                const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                eventClick(param, options.object);
            });
        }

        if (options.addToMap) {
            marker.setMap(self.map);
        }

        if (options.fitBounds) {
            const bounds = new this.google.maps.LatLngBounds();
            bounds.extend(marker.getPosition());
            self.map.fitBounds(bounds);
        }

        return marker;
    }

    public toggleMarkers(markers: any[], show: boolean, markerClusterer?: any) {
        const self = this;
        markers.forEach((marker) => {
            marker.setMap(show ? self.map : null);

            if (markerClusterer) {
                if (show) {
                    self.addMarkerOnClusterer(marker, markerClusterer);
                } else {
                    self.removeMarkerFromClusterer(marker, markerClusterer);
                }
            }
        });
    }

    public alterMarkerOptions(markers: any[], options: MarkerAlterOptions) {
        let icon = null;
        let position = null;

        if (options.latlng) {
            position = {
                lat: options.latlng[0],
                lng: options.latlng[1]
            };
        }

        if (options.icon) {
            icon = options.icon;

            if (options.icon.size) {
                icon.size = new this.google.maps.Size(options.icon.size[0], options.icon.size[1]);
            }
        }

        markers.forEach((marker) => {
            if (options.style) {
                icon = {
                    fillColor: options.style.fillColor ? options.style.fillColor : marker.icon.fillColor,
                    fillOpacity: options.style.fillOpacity ? options.style.fillOpacity : marker.icon.fillOpacity,
                    path: this.google.maps.SymbolPath.CIRCLE,
                    scale: options.style.radius ? options.style.radius : marker.icon.scale,
                    strokeColor: options.style.color ? options.style.color : marker.icon.strokeColor,
                    strokeWeight: options.style.weight ? options.style.weight : marker.icon.strokeWeight
                };
            }

            let newOptions = null;
            if (position && icon) {
                newOptions = { icon, position };
            } else if (position) {
                newOptions = { position };
            } else {
                newOptions = { icon };
            }

            marker.setOptions(newOptions);
        });
    }

    public alterMarkerPosition(markers: any[], position: number[], addTransition: boolean) {
        const newPosition = {
            lat: position[0],
            lng: position[1]
        };

        markers.forEach((marker) => {
            if (addTransition) {
                this.moveTransitionMarker(newPosition, marker);
            } else {
                marker.setPosition(newPosition);
            }
        });
    }

    public fitBoundsPositions(markers: any[]) {
        const bounds = new this.google.maps.LatLngBounds();
        markers.map((marker) => marker.position).forEach((position) => bounds.extend(position));
        this.map.fitBounds(bounds);
    }

    public isMarkerOnMap(marker: any): boolean {
        return !!marker.map;
    }

    public setCenterMarker(marker: any) {
        this.map.setCenter(marker.getPosition());
    }

    public addMarkerEvent(markers: any, eventType: MarkerEventType, eventFunction: any) {
        markers.forEach((marker: any) => {
            switch (eventType) {
                case MarkerEventType.Click:
                    this.google.maps.event.addListener(marker, 'click', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.AfterDrag:
                    this.google.maps.event.addListener(marker, 'dragend', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.MouseOver:
                    this.google.maps.event.addListener(marker, 'mouseover', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.MouseOut:
                    this.google.maps.event.addListener(marker, 'mouseout', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
                        eventFunction(param, marker.object);
                    });
                    break;
                case MarkerEventType.BeforeDrag:
                    this.google.maps.event.addListener(marker, 'dragstart', (event: any) => {
                        const param = new EventReturn([event.latLng.lat(), event.latLng.lng()]);
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
                    this.google.maps.event.clearListeners(marker, 'click');
                    break;
                case MarkerEventType.AfterDrag:
                    this.google.maps.event.clearListeners(marker, 'dragend');
                    break;
                case MarkerEventType.MouseOver:
                    this.google.maps.event.clearListeners(marker, 'mouseover');
                    break;
                case MarkerEventType.MouseOut:
                    this.google.maps.event.clearListeners(marker, 'mouseout');
                    break;
                case MarkerEventType.BeforeDrag:
                    this.google.maps.event.clearListeners(marker, "dragstart");
                    break;
                default:
                    break;
            }
        });
    }

    /* Marker Clusterer */
    public addMarkerClusterer(config: MarkerClustererConfig): any {
        return new MarkerClusterer(this.map, [], {
            maxZoom: config.clusterMaxZoom,
            minimumClusterSize: config.clusterMinSize,
            zoomOnClick: config.clusterZoomOnClick
        });
    }

    public alterMarkerClustererConfig(markerClusterer: any, config: MarkerClustererConfig): void {
        markerClusterer.setZoomOnClick(config.clusterZoomOnClick);
        markerClusterer.setMinimumClusterSize(config.clusterMinSize);
        markerClusterer.setMaxZoom(config.clusterMaxZoom);
    }

    public refreshClusterer(markerClusterer: any): void {
        markerClusterer.repaint();
    }

    public addMarkerOnClusterer(marker: any, markerClusterer: any): void {
        if (markerClusterer.getMarkers().indexOf(marker) === -1) {
            markerClusterer.addMarker(marker, true);
        }
    }

    public removeMarkerFromClusterer(marker: any, markerClusterer: any): void {
        markerClusterer.removeMarker(marker);
    }

    public clearMarkersClusterer(markerClusterer: any): void {
        markerClusterer.clearMarkers();
    }

    public countMarkersOnCluster(markerClusterer: any): number {
        return markerClusterer.getMarkers().length;
    }

    private moveTransitionMarker(position: any, marker: any) {
        const numDeltas = 5;
        const reference = {
            deltaLat: (position.lat - marker.getPosition().lat()) / numDeltas,
            deltaLng: (position.lng - marker.getPosition().lng()) / numDeltas,
            i: 0,
            position: [marker.getPosition().lat(), marker.getPosition().lng()],
            lastPosition: position
        };

        this.moveMarker(marker, reference, numDeltas);
    }

    private moveMarker(marker: any, reference: any, numDeltas: number) {
        reference.position[0] += reference.deltaLat;
        reference.position[1] += reference.deltaLng;
        marker.setPosition(new google.maps.LatLng(reference.position[0], reference.position[1]));
        if (reference.i < numDeltas) {
            reference.i++;
            setTimeout(() => this.moveMarker(marker, reference, numDeltas), 20);
        } else if (reference.i === numDeltas) {
            setTimeout(() => marker.setPosition(reference.lastPosition), 20);
        }
    }
}

// import { Polyline } from "leaflet";
import { PolylineEventType } from "../../dto/event-type";
import { PolylineType } from "../../dto/polyline-type";
import EventReturn from "../../features/events/event-return";
import NavigationOptions from "../../features/polyline/navigations-options";
import PolylineOptions from "../../features/polyline/polyline-options";
import LeafletPopup from "./leaflet-popup";

export default class LeafletPolylines {
    private map: any = {};
    private leaflet: any = {};
    private leafletPopup: LeafletPopup;

    private selectedPolyline: any | null = null;
    private selectedPath: any | null = null;
    private navigateInfoWindow: any | null = null;
    private directionForward: boolean | null = false;
    private multiSelectionForward: boolean | null = false;
    private multiSelection: boolean | null = false;
    private navigateByPoint: boolean = false;
    private navigationOptions: NavigationOptions | any = {};
    private editModeBlockingMapClick: boolean;

    constructor(map: any, leaflet: any, leafletPopup: LeafletPopup) {
        this.map = map;
        this.leaflet = leaflet;
        this.leafletPopup = leafletPopup;
        this.editModeBlockingMapClick = false;
    }

    public drawPolyline(options: PolylineOptions, eventClick: any) {
        const self = this;
        const newOptions: any = {
            color: options.color || "#000000",
            dashArray: null,
            draggable: options.draggable,
            editable: options.editable,
            infowindows: options.infowindows,
            opacity: options.opacity || 1,
            weight: options.weight || 3,
            zIndex: options.zIndex,
        };

        if (options.style !== null) {
            switch (options.style) {
                case PolylineType.Dotted:
                    console.warn(
                        "PolylineType.Dotted is deprecated, instead use PolylineType.Dashed."
                    );
                    break;
                case PolylineType.Dashed:
                    newOptions.opacity = 0.7;
                    newOptions.dashArray = "20,15";
                    break;
                default:
                    break;
            }
        }

        const polyline = new this.leaflet.Polyline(
            options.path || [],
            newOptions
        );
        polyline.on("editable:vertex:rawclick", (e: { cancel: () => any }) =>
            e.cancel()
        );

        if (eventClick) {
            polyline.on("click", (event: any) => {
                self.leaflet.DomEvent.stopPropagation(event);
                if (!this.getEditModeBlockingMapClick()) {
                    const param = new EventReturn([
                        event.latlng.lat,
                        event.latlng.lng,
                    ]);
                    eventClick(param, event.target.object);
                }
            });

            polyline.on(
                "editable:vertex:rawclick",
                (event: {
                    cancel: () => void;
                    latlng: { lat: number; lng: number };
                    target: { object: any };
                }) => {
                    event.cancel();
                    if (!this.getEditModeBlockingMapClick()) {
                        const param = new EventReturn([
                            event.latlng.lat,
                            event.latlng.lng,
                        ]);
                        eventClick(param, event.target.object);
                    }
                }
            );
        }

        if (options.style && options.style === PolylineType.Arrow) {
            const pathOptions = {
                fillOpacity: 1,
                weight: 0,
                color: polyline.options.color,
            };

            polyline.decorator = self.leaflet.polylineDecorator(polyline, {
                patterns: [
                    {
                        offset: "20%",
                        repeat: "90px",
                        symbol: self.leaflet.Symbol.arrowHead({
                            pixelSize: 20,
                            pathOptions,
                        }),
                    },
                    {
                        offset: "0%",
                        symbol: self.leaflet.Symbol.arrowHead({
                            pathOptions,
                            pixelSize: 20,
                        }),
                    },
                    {
                        offset: "100%",
                        symbol: self.leaflet.Symbol.arrowHead({
                            pixelSize: 20,
                            pathOptions,
                        }),
                    },
                ],
            });
        }

        if (options.addToMap) {
            polyline.addTo(self.map);
            if (polyline.decorator) {
                polyline.decorator.addTo(self.map);
            }
            if (options.editable) {
                polyline.enableEdit();
            }
        }

        if (options.object) {
            polyline.object = options.object;
        }

        if (options.fitBounds) {
            self.map.fitBounds(polyline.getBounds());
        }

        return polyline;
    }

    public drawPolylineWithNavigation(
        options: PolylineOptions,
        eventClick?: any
    ) {
        const polyline = this.drawPolyline(options, null);

        polyline.navigationHandlerClick = eventClick;
        this.navigationOptions = options.navigateOptions;
        this.navigateByPoint = this.navigationOptions
            ? this.navigationOptions.navigateByPoint
            : true;
        this.addNavigation(polyline);
        return polyline;
    }

    public togglePolylines(polylines: any, show: boolean) {
        const self = this;
        polylines.forEach((polyline: any) => {
            if (show) {
                self.map.addLayer(polyline);
                if (polyline.options.editable) {
                    polyline.enableEdit();
                }
                if (polyline.decorator) {
                    self.map.addLayer(polyline.decorator);
                }
            } else {
                self.map.removeLayer(polyline);
                if (polyline.options.editable) {
                    polyline.disableEdit();
                }
                if (polyline.decorator) {
                    self.map.removeLayer(polyline.decorator);
                }
            }
        });
    }

    public alterPolylineOptions(polylines: any, options: PolylineOptions) {
        const self = this;

        polylines.forEach((polyline: any) => {
            const style: any = {
                color: options.color ? options.color : polyline.options.color,
                draggable: options.draggable
                    ? options.draggable
                    : polyline.options.draggable,
                opacity: options.opacity
                    ? options.opacity
                    : polyline.options.opacity,
                weight: options.weight
                    ? options.weight
                    : polyline.options.weight,
                zIndex: options.zIndex
                    ? options.zIndex
                    : polyline.options.zIndex,
            };

            if (options.path) {
                polyline.setLatLngs(options.path);
            }

            switch (options.style) {
                case PolylineType.Dotted:
                    console.warn(
                        "PolylineType.Dotted is deprecated, instead use PolylineType.Dashed."
                    );
                    break;
                case PolylineType.Dashed:
                    style.dashArray = "20,15";
                    break;
                case PolylineType.Arrow:
                    const pathOptions = {
                        fillOpacity: 1,
                        weight: 0,
                        color: style.color,
                    };

                    if (polyline.decorator) {
                        self.map.removeLayer(polyline.decorator);
                    }

                    polyline.decorator = self.leaflet.polylineDecorator(
                        polyline,
                        {
                            patterns: [
                                {
                                    offset: "20%",
                                    repeat: "90px",
                                    symbol: self.leaflet.Symbol.arrowHead({
                                        pixelSize: 20,
                                        pathOptions,
                                    }),
                                },
                                {
                                    offset: "0%",
                                    symbol: self.leaflet.Symbol.arrowHead({
                                        pixelSize: 20,
                                        pathOptions,
                                    }),
                                },
                                {
                                    offset: "100%",
                                    symbol: self.leaflet.Symbol.arrowHead({
                                        pixelSize: 20,
                                        pathOptions,
                                    }),
                                },
                            ],
                        }
                    );

                    if (self.map.hasLayer(polyline)) {
                        polyline.decorator.addTo(self.map);
                    }
                    break;
                default:
                    if (polyline.decorator) {
                        self.map.removeLayer(polyline.decorator);
                        polyline.decorator = null;
                    }
                    break;
            }

            polyline.setStyle(style);

            if (options.object) {
                polyline.object = options.object;
            }

            if (options.editable) {
                polyline.disableEdit();
                polyline.enableEdit();
            }
        });
    }

    public fitBoundsPolylines(polylines: any) {
        const self = this;
        self.map.fitBounds(self.getBoundsPolylines(polylines));
    }

    public isPolylineOnMap(polyline: any): boolean {
        return this.map.hasLayer(polyline);
    }

    public getEditModeBlockingMapClick() {
        return this.editModeBlockingMapClick;
    }

    public setEditModeBlockingMapClick(newState: boolean) {
        this.editModeBlockingMapClick = newState;
    }

    // TODO: Fazer uma função tipo getEditModelBlockingMap
    // Fazer o leaflet-map ter acesso a essa função.
    // Antes de dar o click do evento, perguntar se pode.
    // Se puder deixar ou não executa o click.

    public addPolylinePath(polylines: any, position: number[]) {
        // TODO: Só adiciona linha se não estiver editando no mesmo momento.
        if (!this.getEditModeBlockingMapClick) {
            polylines.forEach((polyline: any) => {
                const path = polyline.getLatLngs();

                path.push(new this.leaflet.LatLng(position[0], position[1]));
                polyline.setLatLngs(path);

                if (polyline.editEnabled && polyline.editEnabled()) {
                    polyline.disableEdit();
                    polyline.enableEdit();
                }
            });
        }
    }

    public getPolylinePath(polyline: any): number[][] {
        return polyline.getLatLngs().map((x: any) => [x.lat, x.lng]);
    }

    public removePolylineHighlight() {
        const self = this;

        if (self.selectedPath) {
            if (this.selectedPath.decorator) {
                this.map.removeLayer(this.selectedPath.decorator);
            }

            this.map.removeLayer(self.selectedPath);
            self.selectedPath = null;
        }

        if (self.navigateInfoWindow) {
            self.navigateInfoWindow.remove();
        }

        document.onkeyup = null;
        document.onkeydown = null;
    }

    public addPolylineEvent(
        polylines: any,
        eventType: PolylineEventType,
        eventFunction: any
    ) {
        polylines.forEach((polyline: any) => {
            switch (eventType) {
                case PolylineEventType.SetAt:
                    this.addPolylineEventMove(polyline, eventFunction);
                    break;
                case PolylineEventType.RightClick:
                    this.addPolylineEventRightClick(polyline, eventFunction);
                    break;
                case PolylineEventType.InsertAt:
                    this.addPolylineEventInsertAt(polyline, eventFunction);
                    break;
                case PolylineEventType.RemoveAt:
                    this.addPolylineEventRemoveAt(polyline, eventFunction);
                    break;
                case PolylineEventType.MouseOver:
                    this.addPolylineEventMouseOver(polyline, eventFunction);
                    break;
                case PolylineEventType.MouseOut:
                    this.addPolylineEventMouseOut(polyline, eventFunction);
                    break;
                case PolylineEventType.DragPolyline:
                    this.addPolylineEventDragPolyline(polyline, eventFunction);
                    break;
                default:
                    break;
            }
        });
    }

    public removePolylineEvent(polylines: any, event: PolylineEventType) {
        polylines.forEach((polyline: any) => {
            switch (event) {
                case PolylineEventType.SetAt:
                    polyline.off("editable:vertex:dragstart");
                    break;
                case PolylineEventType.RightClick:
                    polyline.off("contextmenu");
                    polyline.off("editable:vertex:contextmenu");
                    break;
                case PolylineEventType.InsertAt:
                    polyline.off("editable:vertex:new");
                    break;
                case PolylineEventType.RemoveAt:
                    polyline.off("editable:vertex:deleted");
                    break;
                case PolylineEventType.DragPolyline:
                    polyline.off("dragend");
                    break;
                case PolylineEventType.MouseOver:
                    polyline.off("mouseover");
                    break;
                case PolylineEventType.MouseOut:
                    polyline.off("mouseout");
                    break;
                default:
                    break;
            }
        });
    }

    public setIndexPolylineHighlight(polyline: any, index: number) {
        this.directionForward = false;
        polyline.initialIdx = index;
        polyline.finalIdx = index + 1;

        this.moveSelectedPath(polyline, this.navigationOptions);
        this.selectedPolyline = polyline;

        if (this.navigationOptions.navegateOnKeyPress) {
            document.onkeydown = this.onKeyUp.bind(this);
        } else {
            document.onkeyup = this.onKeyUp.bind(this);
        }
    }

    public getObjectPolyline(polyline: any): object {
        return polyline.object;
    }

    public getObjectPolylineHighlight(): object | null {
        if (this.selectedPath) {
            return this.selectedPath.object;
        }

        return null;
    }

    public addPolylineHighlightEvent(
        eventType: PolylineEventType,
        eventFunction: any
    ) {
        if (this.selectedPolyline) {
            this.addPolylineEvent(
                [this.selectedPath],
                eventType,
                eventFunction
            );
        }
    }

    public getPolylineHighlightIndex() {
        if (this.selectedPath) {
            return [this.selectedPath.initialIdx, this.selectedPath.finalIdx];
        }

        return null;
    }

    /* Private methods */
    private addNavigation(polyline: any) {
        polyline.clearAllEventListeners();
        polyline.on("click", this.onClickPolyline.bind(this, polyline));
    }

    private onClickPolyline(polyline: any, event: any) {
        const index = this.checkIdx(polyline, event.latlng);

        polyline.initialIdx = index;
        polyline.finalIdx = index + 1;

        this.moveSelectedPath(polyline, this.navigationOptions);
        this.selectedPolyline = polyline;

        if (this.navigationOptions.navegateOnKeyPress) {
            document.onkeydown = this.onKeyUp.bind(this);
        } else {
            document.onkeyup = this.onKeyUp.bind(this);
        }

        if (polyline.navigationHandlerClick) {
            const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            polyline.navigationHandlerClick(param, event.target.object);
        }
    }

    private onKeyUp(event: any) {
        const self = this;

        if (self.selectedPath) {
            if (event.ctrlKey) {
                console.warn(
                    "Deprecated: CTRL is not needed in navigation anymore"
                );
            }

            switch (event.which ? event.which : event.keyCode) {
                case 38:
                case 39:
                    // up arrow or right arrow
                    self.moveFowards(event.shiftKey);
                    break;
                case 37:
                case 40:
                    // left arrow or down arrow
                    self.moveBackwards(event.shiftKey);
                    break;
            }
        }
    }

    private moveFowards(multiselection: boolean) {
        const polyline = this.selectedPolyline;

        if (
            (!this.navigateByPoint || this.directionForward) &&
            polyline.finalIdx < polyline.getLatLngs().length - 1
        ) {
            this.navigateFoward(multiselection, polyline);
        }
        this.directionForward = true;
        this.moveSelectedPath(polyline, null);
    }

    private navigateFoward(multiSelection: boolean, polyline: any) {
        if (!multiSelection) {
            polyline.finalIdx++;
            polyline.initialIdx = this.multiSelection
                ? polyline.finalIdx - 1
                : polyline.initialIdx + 1;
            this.multiSelection = false;
        } else {
            this.multiSelection = true;
            if (this.multiSelectionForward) {
                polyline.finalIdx++;
            }
            this.multiSelectionForward = true;
        }
    }

    private moveBackwards(multiSelection: boolean) {
        const polyline = this.selectedPolyline;

        if (
            (!this.navigateByPoint || !this.directionForward) &&
            polyline.initialIdx > 0
        ) {
            this.navigateBackward(multiSelection, polyline);
        }
        this.directionForward = false;
        this.moveSelectedPath(polyline, null);
    }

    private navigateBackward(multiSelection: boolean, polyline: any) {
        const self = this;
        if (!multiSelection) {
            polyline.initialIdx--;
            polyline.finalIdx = !self.multiSelection
                ? polyline.finalIdx - 1
                : polyline.initialIdx + 1;
            self.multiSelection = false;
        } else {
            self.multiSelection = true;
            if (!self.multiSelectionForward) {
                polyline.initialIdx--;
            }
            self.multiSelectionForward = false;
        }
    }

    private moveSelectedPath(polyline: any, options: NavigationOptions | null) {
        const self = this;
        const pathSelected = polyline
            .getLatLngs()
            .map((x: any) => [x.lat, x.lng])
            .slice(polyline.initialIdx, polyline.finalIdx + 1);

        if (self.selectedPath) {
            self.selectedPath.setLatLngs(pathSelected);
            this.selectedPath.object = polyline.object;
        } else {
            this.addNewSelectedPath(pathSelected, options, polyline.object);
            this.selectedPath.addTo(this.map);
        }

        if (this.selectedPath.decorator) {
            this.map.removeLayer(this.selectedPath.decorator);
            this.setArrowSelectedPath();
        }

        if (
            (options && options.editable) ||
            (this.selectedPath.editEnabled && this.selectedPath.editEnabled())
        ) {
            this.selectedPath.disableEdit();
            this.selectedPath.enableEdit();
        }

        this.selectedPath.initialIdx = polyline.initialIdx;
        this.selectedPath.finalIdx = polyline.finalIdx;

        let idx = self.directionForward
            ? polyline.finalIdx
            : polyline.initialIdx;
        if (!this.navigateByPoint) {
            idx =
                polyline.finalIdx > polyline.initialIdx
                    ? polyline.finalIdx
                    : polyline.initialIdx;
        }

        const infowindow = polyline.options.infowindows
            ? polyline.options.infowindows[idx]
            : null;
        if (infowindow) {
            const point = polyline.getLatLngs()[idx];

            if (self.navigateInfoWindow) {
                self.leafletPopup.alterPopup(self.navigateInfoWindow, {
                    content: infowindow,
                    latlng: [point.lat, point.lng],
                });
            } else {
                self.navigateInfoWindow = self.leafletPopup.drawPopup({
                    content: infowindow,
                    latlng: [point.lat, point.lng],
                });
            }
        }
    }

    private setArrowSelectedPath() {
        const pathOptions = {
            fillOpacity: 1,
            weight: 0,
            color: this.selectedPath.options.color,
        };
        this.selectedPath.decorator = this.leaflet.polylineDecorator(
            this.selectedPath,
            {
                patterns: [
                    {
                        offset: "100%",
                        symbol: this.leaflet.Symbol.arrowHead({
                            pixelSize: 20,
                            pathOptions,
                        }),
                    },
                ],
            }
        );

        this.selectedPath.decorator.addTo(this.map);
    }

    private addNewSelectedPath(
        pathSelected: any,
        options: NavigationOptions | null,
        object: any
    ) {
        const newOptions: any = {
            color: (options && options.color) || "#FF0000",
            draggable: false,
            editable: options?.editable,
            opacity: (options && options.opacity) || 1,
            weight: (options && options.weight) || 10,
            zIndex: 9999,
        };

        if (options?.style !== null) {
            switch (options?.style) {
                case PolylineType.Dotted:
                    console.warn(
                        "PolylineType.Dotted is deprecated, instead use PolylineType.Dashed."
                    );
                    break;
                case PolylineType.Dashed:
                    newOptions.opacity = 0.7;
                    newOptions.dashArray = "20,15";
                    break;
                default:
                    break;
            }
        }

        this.selectedPath = new this.leaflet.Polyline(pathSelected, newOptions);
        this.selectedPath.on("editable:vertex:rawclick", (e: any) =>
            e.cancel()
        );

        if (options?.style && options.style === PolylineType.Arrow) {
            this.setArrowSelectedPath();
        }

        this.selectedPath.object = object;
        this.selectedPath.highlight = true;
    }

    private checkIdx(polyline: any, point: any) {
        const self = this;
        const path = polyline.getLatLngs();
        let distance = 0;
        let minDistance = Number.MAX_VALUE;
        let returnValue = -1;

        for (let i = 0; i < path.length - 1; i++) {
            distance = self.distanceToLine(path[i], path[i + 1], point);

            if (distance < minDistance) {
                minDistance = distance;
                returnValue = i;
            }
        }
        return returnValue;
    }

    private distanceToLine(pt1: any, pt2: any, pt: any) {
        const self = this;
        const deltaX = pt2.lng - pt1.lng;
        const deltaY = pt2.lat - pt1.lat;
        let incIntersect = (pt.lng - pt1.lng) * deltaX;
        const deltaSum = deltaX * deltaX + deltaY * deltaY;

        incIntersect += (pt.lat - pt1.lat) * deltaY;
        if (deltaSum > 0) {
            incIntersect /= deltaSum;
        } else {
            incIntersect = -1;
        }

        // The intersection occurs outside the line segment, 'before' pt1.
        if (incIntersect < 0) {
            return self.kmTo(pt, pt1);
        } else if (incIntersect > 1) {
            return self.kmTo(pt, pt2);
        }

        // Intersection point calculation.
        const intersect = new this.leaflet.LatLng(
            pt1.lat + incIntersect * deltaY,
            pt1.lng + incIntersect * deltaX
        );

        return self.kmTo(pt, intersect);
    }

    private kmTo(pt1: any, pt2: any) {
        const e = Math;
        const ra = e.PI / 180;
        const b = pt1.lat * ra;
        const c = pt2.lat * ra;
        const d = b - c;
        const g = pt1.lng * ra - pt2.lng * ra;
        const f =
            2 *
            e.asin(
                e.sqrt(
                    e.pow(e.sin(d / 2), 2) +
                        e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)
                )
            );

        return f * 6378.137 * 1000;
    }

    private getBoundsPolylines(polylines: any) {
        const group = new this.leaflet.FeatureGroup(polylines);
        return group.getBounds();
    }

    private addPolylineEventMove(polyline: any, eventFunction: any) {
        const self = this;
        polyline.on("editable:vertex:dragstart", (eventStart: any) => {
            console.log("DRAG START");
            this.setEditModeBlockingMapClick(true)
            // TODO: Se estiver editando um trecho na polyline, não libera para novos trechos. (duplo clique)
            const lastPosition = new EventReturn([
                eventStart.vertex.latlng.lat,
                eventStart.vertex.latlng.lng,
            ]);

            polyline.on("editable:vertex:dragend", (eventEnd: any) => {
                if (polyline.highlight && polyline.decorator) {
                    self.map.removeLayer(polyline.decorator);
                    self.setArrowSelectedPath();
                }

                const newPosition = new EventReturn([
                    eventEnd.vertex.latlng.lat,
                    eventEnd.vertex.latlng.lng,
                ]);
                eventFunction(
                    newPosition,
                    lastPosition,
                    eventEnd.target.object,
                    eventEnd.vertex.getIndex(),
                    polyline
                        .getLatLngs()
                        .map((x: any) => new EventReturn([x.lat, x.lng]))
                );
                polyline.off("editable:vertex:dragend");
                setTimeout(() => {
                    this.setEditModeBlockingMapClick(false);
                }, 300);
            });
        });
    }

    private addPolylineEventInsertAt(polyline: any, eventFunction: any) {
        const self = this;
        polyline.on("editable:vertex:new", (eventNew: any) => {
            const latlngs = eventNew.vertex.latlngs;
            const previous =
                latlngs[
                    latlngs.findIndex(
                        (x: any) => x === eventNew.vertex.latlng
                    ) - 1
                ];
            const previousPoint = new EventReturn([previous.lat, previous.lng]);

            polyline.on("editable:vertex:dragend", (event: any) => {
                if (polyline.highlight && polyline.decorator) {
                    self.map.removeLayer(polyline.decorator);
                    self.setArrowSelectedPath();
                }

                const newPoint = new EventReturn([
                    event.vertex.latlng.lat,
                    event.vertex.latlng.lng,
                ]);
                eventFunction(
                    newPoint,
                    previousPoint,
                    event.target.object,
                    event.vertex.getIndex(),
                    polyline
                        .getLatLngs()
                        .map((x: any) => new EventReturn([x.lat, x.lng]))
                );
                polyline.off("editable:vertex:dragend");
            });
        });
    }

    private addPolylineEventRemoveAt(polyline: any, eventFunction: any) {
        polyline.on("editable:vertex:deleted", (event: any) => {
            const param = new EventReturn([
                event.vertex.latlng.lat,
                event.vertex.latlng.lng,
            ]);
            eventFunction(
                param,
                event.target.object,
                polyline
                    .getLatLngs()
                    .map((x: any) => new EventReturn([x.lat, x.lng]))
            );
        });
    }

    private addPolylineEventRightClick(polyline: any, eventFunction: any) {
        polyline.on("contextmenu", (event: any) => {
            const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            eventFunction(param, polyline.object);
        });
        polyline.on("editable:vertex:contextmenu", (event: any) => {
            const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            eventFunction(param, polyline.object);
        });
    }

    private addPolylineEventMouseOver(polyline: any, eventFunction: any) {
        polyline.on("mouseover", (event: any) => {
            const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            eventFunction(param, event.target.object);
        });
    }

    private addPolylineEventMouseOut(polyline: any, eventFunction: any) {
        polyline.on("mouseout", (event: any) => {
            const param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            eventFunction(param, event.target.object);
        });
    }

    private addPolylineEventDragPolyline(polyline: any, eventFunction: any) {
        polyline.on("dragend", (event: any) => {
            this.editModeBlockingMapClick = true;
            const param = event.target
                .getLatLngs()
                .map((x: any) => new EventReturn([x.lat, x.lng]));
            eventFunction(param, event.target.object);
            setTimeout(() => {
                this.editModeBlockingMapClick = false;
            }, 300);
        });
    }
}

import { PolylineEventType } from "../../dto/event-type";
import { PolylineType } from "../../dto/polyline-type";
import EventReturn from "../../features/events/event-return";
import NavigationOptions from "../../features/polyline/navigations-options";
import PolylineOptions from "../../features/polyline/polyline-options";
import GooglePopups from "./google-popup";

export default class GooglePolylines {
    private map: any | null = null;
    private google: any | null = null;
    private googlePopups: GooglePopups | null = null;

    private selectedPolyline: any | null = null;
    private selectedPath: any | null = null;
    private navigateInfoWindow: any | null = null;
    private directionForward: boolean | null = false;
    private multiSelectionForward: boolean | null = false;
    private multiSelection: boolean | null = false;
    private navigateByPoint: boolean | null = false;
    private navigationOptions: NavigationOptions | any = {};
    private editModeBlockingMapClick: boolean;

    constructor(map: any, google: any, googlePopups: GooglePopups) {
        this.map = map;
        this.google = google;
        this.googlePopups = googlePopups;
        this.editModeBlockingMapClick = false;
    }

    public drawPolyline(
        options: PolylineOptions,
        eventClick: any,
        callBackEdit?: (params: any) => void
    ) {
        const self = this;
        const newOptions: any = {
            draggable: options.draggable,
            editable: options.editable,
            icons: null,
            infowindows: options.infowindows,
            object: options.object,
            path: null,
            strokeColor: options.color,
            strokeOpacity: options.opacity || 1,
            strokeWeight: options.weight,
            suppressUndo: true,
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
                    newOptions.strokeOpacity = 0;
                    newOptions.icons = [
                        {
                            icon: {
                                path: "M 0,-1 0,1",
                                scale: 2,
                                strokeOpacity: 1,
                                strokeWeight: options.weight,
                            },
                            offset: "0",
                            repeat: "10px",
                        },
                    ];
                    break;
                case PolylineType.Arrow:
                    newOptions.icons = [
                        {
                            icon: {
                                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                                scaledSize: new google.maps.Size(20, 20),
                                size: new google.maps.Size(20, 20),
                            },
                            offset: "100%",
                            repeat: "100px",
                        },
                        {
                            icon: {
                                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                            },
                            offset: "0%",
                        },
                        {
                            icon: {
                                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                            },
                            offset: "100%",
                        },
                    ];
                    break;
                default:
                    break;
            }
        }

        newOptions.path = options.path
            ? options.path.map((x) => {
                  return {
                      lat: x[0],
                      lng: x[1],
                  };
              })
            : [];

        const polyline = new this.google.maps.Polyline(newOptions);

        if (options.editable) {
            this.attachVertexDragEvents(polyline, callBackEdit);
        }

        if (eventClick) {
            this.google.maps.event.addListener(
                polyline,
                "click",
                (event: any) => {
                    const param = new EventReturn([
                        event.latLng.lat(),
                        event.latLng.lng(),
                    ]);
                    eventClick(param, polyline.object);
                }
            );
        }

        if (options.addToMap) {
            polyline.setMap(self.map);
        }

        if (options.fitBounds) {
            self.map.fitBounds(self.getPolylineBounds(polyline));
        }

        return polyline;
    }

    private attachVertexDragEvents(
        polyline: any,
        callBackEdit?: (params: any) => void
    ) {
        const path = polyline.getPath();
        let isDragging = false;
        let lastEditedVertexIndex = -1;

        // Este evento é disparado quando um vértice na polilinha é modificado
        google.maps.event.addListener(path, "set_at", (index: number) => {
            isDragging = true;
            lastEditedVertexIndex = index;
            this.setEditModeBlockingMapClick(true);
        });

        google.maps.event.addListener(path, "insert_at", (index: number) => {
            isDragging = true;
            lastEditedVertexIndex = index;
            this.setEditModeBlockingMapClick(true);
        });

        // Monitorar quando o arrasto de qualquer vértice termina
        google.maps.event.addListener(polyline, "mouseup", () => {
            if (isDragging && lastEditedVertexIndex !== -1) {
                callBackEdit
                    ? callBackEdit({
                          _latLng: this.getPolylinePath(polyline).map((el) => {
                              return {
                                  lat: el[0],
                                  long: el[1],
                              };
                          }),
                          origin: polyline.path,
                      })
                    : null;
                setTimeout(() => {
                    this.setEditModeBlockingMapClick(false);
                }, 500);
                isDragging = false;
                lastEditedVertexIndex = -1;
            }
        });
    }

    public setEditModeBlockingMapClick(newState: boolean) {
        this.editModeBlockingMapClick = newState;
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
        polylines.forEach((polyline: any) => {
            const self = this;
            polyline.setMap(show ? self.map : null);
        });
    }

    public alterPolylineOptions(polylines: any[], options: PolylineOptions) {
        polylines.forEach((polyline: any) => {
            const newOptions: any = {
                draggable: options.draggable
                    ? options.draggable
                    : polyline.draggable,
                editable: options.editable
                    ? options.editable
                    : polyline.editable,
                infowindows: options.infowindows
                    ? options.infowindows
                    : polyline.infowindows,
                object: options.object ? options.object : polyline.object,
                strokeColor: options.color
                    ? options.color
                    : polyline.strokeColor,
                strokeOpacity: options.opacity
                    ? options.opacity
                    : polyline.strokeOpacity,
                strokeWeight: options.weight
                    ? options.weight
                    : polyline.strokeWeight,
                zIndex: options.zIndex ? options.zIndex : polyline.zIndex,
            };

            if (options.path) {
                polyline.setPath(
                    options.path.map((x) => new google.maps.LatLng(x[0], x[1]))
                );
            }

            switch (options.style) {
                case PolylineType.Dotted:
                    console.warn(
                        "PolylineType.Dotted is deprecated, instead use PolylineType.Dashed."
                    );
                    break;
                case PolylineType.Dashed:
                    newOptions.strokeOpacity = 0;
                    newOptions.icons = [
                        {
                            icon: {
                                path: "M 0,-1 0,1",
                                scale: 2,
                                strokeOpacity: 1,
                            },
                            offset: "0",
                            repeat: "10px",
                        },
                    ];
                    break;
                case PolylineType.Arrow:
                    newOptions.icons = [
                        {
                            icon: {
                                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                                scaledSize: new google.maps.Size(20, 20),
                                size: new google.maps.Size(20, 20),
                            },
                            offset: "90%",
                            repeat: "20%",
                        },
                        {
                            icon: {
                                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                            },
                            offset: "0%",
                        },
                        {
                            icon: {
                                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                            },
                            offset: "100%",
                        },
                    ];
                    break;
                default:
                    newOptions.icons = null;
                    break;
            }

            polyline.setOptions(newOptions);
        });
    }

    public fitBoundsPolylines(polylines: any) {
        const self = this;
        self.map.fitBounds(self.getPolylinesBounds(polylines));
    }

    public isPolylineOnMap(polyline: any): boolean {
        return !!polyline.map;
    }

    public addPolylinePath(polylines: any, position: number[]) {
        polylines.forEach((polyline: any) => {
            const path = polyline.getPath();

            path.push(new this.google.maps.LatLng(position[0], position[1]));
            polyline.setPath(path);
        });
    }

    public getPolylinePath(polyline: any): number[][] {
        return polyline
            .getPath()
            .getArray()
            .map((x: any) => [x.lat(), x.lng()]);
    }

    public removePolylineHighlight() {
        this.google.maps.event.clearListeners(document, "keyup");
        this.google.maps.event.clearListeners(document, "keydown");
        if (this.selectedPath) {
            this.selectedPath.setMap(null);
            this.selectedPath = null;
        }
        if (this.navigateInfoWindow) {
            this.navigateInfoWindow.close();
        }
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
                case PolylineEventType.DragPolyline:
                    this.addPolylineEventDragPolyline(polyline, eventFunction);
                    break;
                case PolylineEventType.MouseOver:
                    this.addPolylineEventMouseOver(polyline, eventFunction);
                    break;
                case PolylineEventType.MouseOut:
                    this.addPolylineEventMouseOut(polyline, eventFunction);
                    break;
                default:
                    break;
            }
        });
    }

    public removePolylineEvent(polylines: any, event: PolylineEventType) {
        polylines.forEach((polyline: any) =>
            this.google.maps.event.clearListeners(polyline, "click")
        );

        polylines.forEach((polyline: any) => {
            switch (event) {
                case PolylineEventType.SetAt:
                    this.google.maps.event.clearListeners(
                        polyline.getPath(),
                        "set_at"
                    );
                    break;
                case PolylineEventType.RightClick:
                    this.google.maps.event.clearListeners(
                        polyline,
                        "rightclick"
                    );
                    break;
                case PolylineEventType.InsertAt:
                    this.google.maps.event.clearListeners(
                        polyline.getPath(),
                        "insert_at"
                    );
                    break;
                case PolylineEventType.RemoveAt:
                    this.google.maps.event.clearListeners(
                        polyline.getPath(),
                        "remove_at"
                    );
                    break;
                case PolylineEventType.DragPolyline:
                    this.google.maps.event.clearListeners(
                        polyline,
                        "dragstart"
                    );
                    this.google.maps.event.clearListeners(polyline, "dragend");
                    break;
                case PolylineEventType.MouseOver:
                    this.google.maps.event.clearListeners(
                        polyline,
                        "mouseover"
                    );
                    break;
                case PolylineEventType.MouseOut:
                    this.google.maps.event.clearListeners(polyline, "mouseout");
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
            this.google.maps.event.clearListeners(document, "keydown");
            this.google.maps.event.addDomListener(
                document,
                "keydown",
                this.onKeyUp.bind(this)
            );
        } else {
            this.google.maps.event.clearListeners(document, "keyup");
            this.google.maps.event.addDomListener(
                document,
                "keyup",
                this.onKeyUp.bind(this)
            );
        }
    }

    public getObjectPolyline(polyline: any): object {
        return polyline.object;
    }

    public getObjectPolylineHighlight() {
        if (this.selectedPath) {
            return this.selectedPath.object;
        }

        return null;
    }

    public addPolylineHighlightEvent(
        eventType: PolylineEventType,
        eventFunction: any
    ) {
        if (this.selectedPath) {
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
        const self = this;

        this.google.maps.event.clearListeners(polyline, "click");
        this.google.maps.event.addListener(
            polyline,
            "click",
            self.onClickPolyline.bind(self, polyline)
        );
    }

    private onClickPolyline(polyline: any, event: any) {
        const index = this.checkIdx(polyline, event.latLng);

        polyline.initialIdx = index;
        polyline.finalIdx = index + 1;

        this.moveSelectedPath(polyline, this.navigationOptions);
        this.selectedPolyline = polyline;

        if (this.navigationOptions.navegateOnKeyPress) {
            this.google.maps.event.clearListeners(document, "keydown");
            this.google.maps.event.addDomListener(
                document,
                "keydown",
                this.onKeyUp.bind(this)
            );
        } else {
            this.google.maps.event.clearListeners(document, "keyup");
            this.google.maps.event.addDomListener(
                document,
                "keyup",
                this.onKeyUp.bind(this)
            );
        }

        if (polyline.navigationHandlerClick) {
            const param = new EventReturn([
                event.latLng.lat(),
                event.latLng.lng(),
            ]);
            polyline.navigationHandlerClick(param, polyline.object);
        }
    }

    private onKeyUp(event: any) {
        const self = this;

        if (self.selectedPath) {
            switch (event.which ? event.which : event.keyCode) {
                case 38:
                case 39:
                    // up arrow or right arrow
                    self.moveForwards(event.shiftKey);
                    break;
                case 37:
                case 40:
                    // left arrow or down arrow
                    self.moveBackwards(event.shiftKey);
                    break;
            }
        }
    }

    private moveForwards(multiSelection: boolean) {
        const self = this;
        const polyline = self.selectedPolyline;

        if (
            (!self.navigateByPoint || self.directionForward) &&
            polyline.finalIdx < polyline.getPath().getArray().length - 1
        ) {
            self.navigateForward(multiSelection, polyline);
        }
        self.directionForward = true;
        self.moveSelectedPath(polyline, null);
    }

    private navigateForward(multiSelection: boolean, polyline: any) {
        const self = this;
        if (!multiSelection) {
            polyline.finalIdx++;
            polyline.initialIdx = self.multiSelection
                ? polyline.finalIdx - 1
                : polyline.initialIdx + 1;
            self.multiSelection = false;
        } else {
            self.multiSelection = true;
            if (self.multiSelectionForward) {
                polyline.finalIdx++;
            }
            self.multiSelectionForward = true;
        }
    }

    private moveBackwards(multiSelection: boolean) {
        const self = this;
        const polyline = self.selectedPolyline;

        if (
            (!self.navigateByPoint || !self.directionForward) &&
            polyline.initialIdx > 0
        ) {
            self.navigateBackward(multiSelection, polyline);
        }
        self.directionForward = false;
        self.moveSelectedPath(polyline, null);
    }

    private navigateBackward(
        multiSelection: boolean,
        polyline: { initialIdx: number; finalIdx: number }
    ) {
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
        const pathSelected = polyline
            .getPath()
            .getArray()
            .slice(polyline.initialIdx, polyline.finalIdx + 1);

        if (this.selectedPath) {
            this.selectedPath.setPath(pathSelected);
            this.selectedPath.object = polyline.object;
            this.updateSelectedPathListeners();
        } else {
            const newOptions: any = {
                editable: options?.editable,
                keyboardShortcuts: false,
                map: this.map,
                object: polyline.object,
                path: pathSelected,
                strokeColor: (options && options.color) || "#FF0000",
                strokeOpacity: (options && options.opacity) || 1,
                strokeWeight: (options && options.weight) || 10,
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
                        newOptions.strokeOpacity = 0;
                        newOptions.icons = [
                            {
                                icon: {
                                    path: "M 0,-1 0,1",
                                    scale: 2,
                                    strokeOpacity: 1,
                                },
                                offset: "0",
                                repeat: "10px",
                            },
                        ];
                        break;
                    case PolylineType.Arrow:
                        newOptions.icons = [
                            {
                                icon: {
                                    anchor: new google.maps.Point(0, 2),
                                    fillColor: "#000",
                                    fillOpacity: 0.7,
                                    path: google.maps.SymbolPath
                                        .FORWARD_OPEN_ARROW,
                                    scale: 4,
                                    strokeColor: "#000",
                                    strokeWeight: 5,
                                },
                                offset: "100%",
                            },
                        ];
                        break;
                    default:
                        break;
                }
            }

            this.selectedPath = new this.google.maps.Polyline(newOptions);
        }

        this.selectedPath.initialIdx = polyline.initialIdx;
        this.selectedPath.finalIdx = polyline.finalIdx;

        this.drawPopupNavigation(polyline);
    }

    private addPolylineEventMove(polyline: any, eventFunction: any) {
        polyline.moveListener = (newEvent: any, lastEvent: any) => {
            if (polyline.dragging) return;

            const path = polyline.getPath().getAt(newEvent);
            const newPosition = new EventReturn([path.lat(), path.lng()]);
            const lastPosition = new EventReturn([
                lastEvent.lat(),
                lastEvent.lng(),
            ]);

            eventFunction(
                newPosition,
                lastPosition,
                polyline.object,
                newEvent,
                polyline
                    .getPath()
                    .getArray()
                    .map((x: any) => new EventReturn([x.lat(), x.lng()]))
            );
        };
        this.google.maps.event.addListener(
            polyline.getPath(),
            "set_at",
            polyline.moveListener
        );
    }

    private addPolylineEventInsertAt(polyline: any, eventFunction: any) {
        polyline.insertAtListener = (event: any) => {
            const path = polyline.getPath();
            const newPath = path.getAt(event);
            const newPoint = new EventReturn([newPath.lat(), newPath.lng()]);

            const previousPath = path.getAt(event - 1);
            const previousPoint = previousPath
                ? new EventReturn([previousPath.lat(), previousPath.lng()])
                : null;
            eventFunction(
                newPoint,
                previousPoint,
                polyline.object,
                event,
                polyline
                    .getPath()
                    .getArray()
                    .map((x: any) => new EventReturn([x.lat(), x.lng()]))
            );
        };
        this.google.maps.event.addListener(
            polyline.getPath(),
            "insert_at",
            polyline.insertAtListener
        );
    }

    private addPolylineEventRemoveAt(polyline: any, eventFunction: any) {
        polyline.removeAtListener = (event: any) => {
            const param = new EventReturn([
                polyline.getPath().getAt(event).lat(),
                polyline.getPath().getAt(event).lng(),
            ]);
            eventFunction(
                param,
                polyline.object,
                polyline
                    .getPath()
                    .getArray()
                    .map((x: any) => new EventReturn([x.lat(), x.lng()]))
            );
        };
        this.google.maps.event.addListener(
            polyline.getPath(),
            "remove_at",
            polyline.removeAtListener
        );
    }

    private addPolylineEventRightClick(polyline: any, eventFunction: any) {
        polyline.rightClickPolylineListener = (event: any) => {
            polyline.dragging = false;
            const param = new EventReturn([
                event.latLng.lat(),
                event.latLng.lng(),
            ]);
            eventFunction(param, polyline.object);
        };

        this.google.maps.event.addListener(
            polyline,
            "rightclick",
            polyline.rightClickPolylineListener
        );
    }

    private addPolylineEventMouseOver(polyline: any, eventFunction: any) {
        polyline.overPolylineListener = (event: any) => {
            polyline.dragging = false;
            const param = new EventReturn([
                event.latLng.lat(),
                event.latLng.lng(),
            ]);
            eventFunction(param, polyline.object);
        };

        this.google.maps.event.addListener(
            polyline,
            "mouseover",
            polyline.overPolylineListener
        );
    }

    private addPolylineEventMouseOut(polyline: any, eventFunction: any) {
        polyline.outPolylineListener = (event: any) => {
            polyline.dragging = false;
            const param = new EventReturn([
                event.latLng.lat(),
                event.latLng.lng(),
            ]);
            eventFunction(param, polyline.object);
        };

        this.google.maps.event.addListener(
            polyline,
            "mouseout",
            polyline.outPolylineListener
        );
    }

    private addPolylineEventDragPolyline(polyline: any, eventFunction: any) {
        polyline.dragPolylineListener = () => {
            polyline.dragging = false;
            const param = polyline
                .getPath()
                .getArray()
                .map((x: any) => new EventReturn([x.lat(), x.lng()]));
            eventFunction(param, polyline.object);
        };

        this.google.maps.event.addListener(
            polyline,
            "dragend",
            polyline.dragPolylineListener
        );
        this.google.maps.event.addListener(
            polyline,
            "dragstart",
            () => (polyline.dragging = true)
        );
    }

    private updateSelectedPathListeners() {
        if (this.selectedPath.moveListener) {
            this.google.maps.event.clearListeners(
                this.selectedPath.getPath(),
                "set_at"
            );
            this.google.maps.event.addListener(
                this.selectedPath.getPath(),
                "set_at",
                this.selectedPath.moveListener
            );
        }

        if (this.selectedPath.insertAtListener) {
            this.google.maps.event.clearListeners(
                this.selectedPath.getPath(),
                "insert_at"
            );
            this.google.maps.event.addListener(
                this.selectedPath.getPath(),
                "insert_at",
                this.selectedPath.insertAtListener
            );
        }

        if (this.selectedPath.removeAtListener) {
            this.google.maps.event.clearListeners(
                this.selectedPath.getPath(),
                "remove_at"
            );
            this.google.maps.event.addListener(
                this.selectedPath.getPath(),
                "remove_at",
                this.selectedPath.removeAtListener
            );
        }
    }

    private drawPopupNavigation(polyline: any) {
        const self = this;
        let idx = self.directionForward
            ? polyline.finalIdx
            : polyline.initialIdx;
        if (!self.navigateByPoint) {
            idx =
                polyline.finalIdx > polyline.initialIdx
                    ? polyline.finalIdx
                    : polyline.initialIdx;
        }

        const infowindow = polyline.infowindows
            ? polyline.infowindows[idx]
            : null;

        if (infowindow) {
            const point = polyline.getPath().getArray()[idx];

            if (self.navigateInfoWindow) {
                this.googlePopups?.alterPopup(self.navigateInfoWindow, {
                    content: infowindow,
                    latlng: [point.lat(), point.lng()],
                });
            } else {
                self.navigateInfoWindow = this.googlePopups?.drawPopup({
                    content: infowindow,
                    latlng: [point.lat(), point.lng()],
                });
            }
        }
    }

    public checkIdx(
        polyline: any,
        point: { lat: () => number; lng: () => number }
    ): number {
        const self = this;
        const path = polyline.getPath();
        let distance = 0;
        let minDistance = Number.MAX_VALUE;
        let returnValue = -1;

        for (let i = 0; i < path.length - 1; i++) {
            distance = self.distanceToLine(
                path.getAt(i),
                path.getAt(i + 1),
                point
            );

            if (distance < minDistance) {
                minDistance = distance;
                returnValue = i;
            }
        }
        return returnValue;
    }

    private distanceToLine(pt1: any, pt2: any, pt: any) {
        const self = this;
        const deltaX = pt2.lng() - pt1.lng();
        const deltaY = pt2.lat() - pt1.lat();
        let incIntersect = (pt.lng() - pt1.lng()) * deltaX;
        const deltaSum = deltaX * deltaX + deltaY * deltaY;

        incIntersect += (pt.lat() - pt1.lat()) * deltaY;
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
        const intersect = new this.google.maps.LatLng(
            pt1.lat() + incIntersect * deltaY,
            pt1.lng() + incIntersect * deltaX
        );

        return self.kmTo(pt, intersect);
    }

    private kmTo(pt1: any, pt2: any) {
        const e = Math;
        const ra = e.PI / 180;
        const b = pt1.lat() * ra;
        const c = pt2.lat() * ra;
        const d = b - c;
        const g = pt1.lng() * ra - pt2.lng() * ra;
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

    private getPolylinesBounds(polylines: any) {
        const bounds = new this.google.maps.LatLngBounds();

        polylines.forEach((polyline: any) => {
            const paths = polyline.getPath().getArray();
            paths.forEach((path: any) => bounds.extend(path));
        });

        return bounds;
    }

    private getPolylineBounds(polyline: any) {
        const bounds = new this.google.maps.LatLngBounds();
        const paths = polyline.getPath().getArray();

        paths.forEach((path: any) => bounds.extend(path));
        return bounds;
    }
}

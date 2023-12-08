import { PolylineEventType } from "../../dto/event-type";
import { PolylineType } from "../../dto/polyline-type";
import EventReturn from "../../features/events/event-return";
var GooglePolylines = /** @class */ (function () {
    function GooglePolylines(map, google, googlePopups) {
        this.map = null;
        this.google = null;
        this.googlePopups = null;
        this.selectedPolyline = null;
        this.selectedPath = null;
        this.navigateInfoWindow = null;
        this.directionForward = false;
        this.multiSelectionForward = false;
        this.multiSelection = false;
        this.navigateByPoint = false;
        this.navigationOptions = {};
        this.map = map;
        this.google = google;
        this.googlePopups = googlePopups;
    }
    GooglePolylines.prototype.drawPolyline = function (options, eventClick) {
        var self = this;
        var newOptions = {
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
                    console.warn("PolylineType.Dotted is deprecated, instead use PolylineType.Dashed.");
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
            ? options.path.map(function (x) {
                return {
                    lat: x[0],
                    lng: x[1],
                };
            })
            : [];
        var polyline = new this.google.maps.Polyline(newOptions);
        if (eventClick) {
            this.google.maps.event.addListener(polyline, "click", function (event) {
                var param = new EventReturn([
                    event.latLng.lat(),
                    event.latLng.lng(),
                ]);
                eventClick(param, polyline.object);
            });
        }
        if (options.addToMap) {
            polyline.setMap(self.map);
        }
        if (options.fitBounds) {
            self.map.fitBounds(self.getPolylineBounds(polyline));
        }
        return polyline;
    };
    GooglePolylines.prototype.drawPolylineWithNavigation = function (options, eventClick) {
        var polyline = this.drawPolyline(options, null);
        polyline.navigationHandlerClick = eventClick;
        this.navigationOptions = options.navigateOptions;
        this.navigateByPoint = this.navigationOptions
            ? this.navigationOptions.navigateByPoint
            : true;
        this.addNavigation(polyline);
        return polyline;
    };
    GooglePolylines.prototype.togglePolylines = function (polylines, show) {
        var _this = this;
        polylines.forEach(function (polyline) {
            var self = _this;
            polyline.setMap(show ? self.map : null);
        });
    };
    GooglePolylines.prototype.alterPolylineOptions = function (polylines, options) {
        polylines.forEach(function (polyline) {
            var newOptions = {
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
                polyline.setPath(options.path.map(function (x) { return new google.maps.LatLng(x[0], x[1]); }));
            }
            switch (options.style) {
                case PolylineType.Dotted:
                    console.warn("PolylineType.Dotted is deprecated, instead use PolylineType.Dashed.");
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
    };
    GooglePolylines.prototype.fitBoundsPolylines = function (polylines) {
        var self = this;
        self.map.fitBounds(self.getPolylinesBounds(polylines));
    };
    GooglePolylines.prototype.isPolylineOnMap = function (polyline) {
        return !!polyline.map;
    };
    GooglePolylines.prototype.addPolylinePath = function (polylines, position) {
        var _this = this;
        polylines.forEach(function (polyline) {
            var path = polyline.getPath();
            path.push(new _this.google.maps.LatLng(position[0], position[1]));
            polyline.setPath(path);
        });
    };
    GooglePolylines.prototype.getPolylinePath = function (polyline) {
        return polyline
            .getPath()
            .getArray()
            .map(function (x) { return [x.lat(), x.lng()]; });
    };
    GooglePolylines.prototype.removePolylineHighlight = function () {
        this.google.maps.event.clearListeners(document, "keyup");
        this.google.maps.event.clearListeners(document, "keydown");
        if (this.selectedPath) {
            this.selectedPath.setMap(null);
            this.selectedPath = null;
        }
        if (this.navigateInfoWindow) {
            this.navigateInfoWindow.close();
        }
    };
    GooglePolylines.prototype.addPolylineEvent = function (polylines, eventType, eventFunction) {
        var _this = this;
        polylines.forEach(function (polyline) {
            switch (eventType) {
                case PolylineEventType.SetAt:
                    _this.addPolylineEventMove(polyline, eventFunction);
                    break;
                case PolylineEventType.RightClick:
                    _this.addPolylineEventRightClick(polyline, eventFunction);
                    break;
                case PolylineEventType.InsertAt:
                    _this.addPolylineEventInsertAt(polyline, eventFunction);
                    break;
                case PolylineEventType.RemoveAt:
                    _this.addPolylineEventRemoveAt(polyline, eventFunction);
                    break;
                case PolylineEventType.DragPolyline:
                    _this.addPolylineEventDragPolyline(polyline, eventFunction);
                    break;
                case PolylineEventType.MouseOver:
                    _this.addPolylineEventMouseOver(polyline, eventFunction);
                    break;
                case PolylineEventType.MouseOut:
                    _this.addPolylineEventMouseOut(polyline, eventFunction);
                    break;
                default:
                    break;
            }
        });
    };
    GooglePolylines.prototype.removePolylineEvent = function (polylines, event) {
        var _this = this;
        polylines.forEach(function (polyline) {
            return _this.google.maps.event.clearListeners(polyline, "click");
        });
        polylines.forEach(function (polyline) {
            switch (event) {
                case PolylineEventType.SetAt:
                    _this.google.maps.event.clearListeners(polyline.getPath(), "set_at");
                    break;
                case PolylineEventType.RightClick:
                    _this.google.maps.event.clearListeners(polyline, "rightclick");
                    break;
                case PolylineEventType.InsertAt:
                    _this.google.maps.event.clearListeners(polyline.getPath(), "insert_at");
                    break;
                case PolylineEventType.RemoveAt:
                    _this.google.maps.event.clearListeners(polyline.getPath(), "remove_at");
                    break;
                case PolylineEventType.DragPolyline:
                    _this.google.maps.event.clearListeners(polyline, "dragstart");
                    _this.google.maps.event.clearListeners(polyline, "dragend");
                    break;
                case PolylineEventType.MouseOver:
                    _this.google.maps.event.clearListeners(polyline, "mouseover");
                    break;
                case PolylineEventType.MouseOut:
                    _this.google.maps.event.clearListeners(polyline, "mouseout");
                    break;
                default:
                    break;
            }
        });
    };
    GooglePolylines.prototype.setIndexPolylineHighlight = function (polyline, index) {
        this.directionForward = false;
        polyline.initialIdx = index;
        polyline.finalIdx = index + 1;
        this.moveSelectedPath(polyline, this.navigationOptions);
        this.selectedPolyline = polyline;
        if (this.navigationOptions.navegateOnKeyPress) {
            this.google.maps.event.clearListeners(document, "keydown");
            this.google.maps.event.addDomListener(document, "keydown", this.onKeyUp.bind(this));
        }
        else {
            this.google.maps.event.clearListeners(document, "keyup");
            this.google.maps.event.addDomListener(document, "keyup", this.onKeyUp.bind(this));
        }
    };
    GooglePolylines.prototype.getObjectPolyline = function (polyline) {
        return polyline.object;
    };
    GooglePolylines.prototype.getObjectPolylineHighlight = function () {
        if (this.selectedPath) {
            return this.selectedPath.object;
        }
        return null;
    };
    GooglePolylines.prototype.addPolylineHighlightEvent = function (eventType, eventFunction) {
        if (this.selectedPath) {
            this.addPolylineEvent([this.selectedPath], eventType, eventFunction);
        }
    };
    GooglePolylines.prototype.getPolylineHighlightIndex = function () {
        if (this.selectedPath) {
            return [this.selectedPath.initialIdx, this.selectedPath.finalIdx];
        }
        return null;
    };
    /* Private methods */
    GooglePolylines.prototype.addNavigation = function (polyline) {
        var self = this;
        this.google.maps.event.clearListeners(polyline, "click");
        this.google.maps.event.addListener(polyline, "click", self.onClickPolyline.bind(self, polyline));
    };
    GooglePolylines.prototype.onClickPolyline = function (polyline, event) {
        var index = this.checkIdx(polyline, event.latLng);
        polyline.initialIdx = index;
        polyline.finalIdx = index + 1;
        this.moveSelectedPath(polyline, this.navigationOptions);
        this.selectedPolyline = polyline;
        if (this.navigationOptions.navegateOnKeyPress) {
            this.google.maps.event.clearListeners(document, "keydown");
            this.google.maps.event.addDomListener(document, "keydown", this.onKeyUp.bind(this));
        }
        else {
            this.google.maps.event.clearListeners(document, "keyup");
            this.google.maps.event.addDomListener(document, "keyup", this.onKeyUp.bind(this));
        }
        if (polyline.navigationHandlerClick) {
            var param = new EventReturn([
                event.latLng.lat(),
                event.latLng.lng(),
            ]);
            polyline.navigationHandlerClick(param, polyline.object);
        }
    };
    GooglePolylines.prototype.onKeyUp = function (event) {
        var self = this;
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
    };
    GooglePolylines.prototype.moveForwards = function (multiSelection) {
        var self = this;
        var polyline = self.selectedPolyline;
        if ((!self.navigateByPoint || self.directionForward) &&
            polyline.finalIdx < polyline.getPath().getArray().length - 1) {
            self.navigateForward(multiSelection, polyline);
        }
        self.directionForward = true;
        self.moveSelectedPath(polyline, null);
    };
    GooglePolylines.prototype.navigateForward = function (multiSelection, polyline) {
        var self = this;
        if (!multiSelection) {
            polyline.finalIdx++;
            polyline.initialIdx = self.multiSelection
                ? polyline.finalIdx - 1
                : polyline.initialIdx + 1;
            self.multiSelection = false;
        }
        else {
            self.multiSelection = true;
            if (self.multiSelectionForward) {
                polyline.finalIdx++;
            }
            self.multiSelectionForward = true;
        }
    };
    GooglePolylines.prototype.moveBackwards = function (multiSelection) {
        var self = this;
        var polyline = self.selectedPolyline;
        if ((!self.navigateByPoint || !self.directionForward) &&
            polyline.initialIdx > 0) {
            self.navigateBackward(multiSelection, polyline);
        }
        self.directionForward = false;
        self.moveSelectedPath(polyline, null);
    };
    GooglePolylines.prototype.navigateBackward = function (multiSelection, polyline) {
        var self = this;
        if (!multiSelection) {
            polyline.initialIdx--;
            polyline.finalIdx = !self.multiSelection
                ? polyline.finalIdx - 1
                : polyline.initialIdx + 1;
            self.multiSelection = false;
        }
        else {
            self.multiSelection = true;
            if (!self.multiSelectionForward) {
                polyline.initialIdx--;
            }
            self.multiSelectionForward = false;
        }
    };
    GooglePolylines.prototype.moveSelectedPath = function (polyline, options) {
        var pathSelected = polyline
            .getPath()
            .getArray()
            .slice(polyline.initialIdx, polyline.finalIdx + 1);
        if (this.selectedPath) {
            this.selectedPath.setPath(pathSelected);
            this.selectedPath.object = polyline.object;
            this.updateSelectedPathListeners();
        }
        else {
            var newOptions = {
                editable: options === null || options === void 0 ? void 0 : options.editable,
                keyboardShortcuts: false,
                map: this.map,
                object: polyline.object,
                path: pathSelected,
                strokeColor: (options && options.color) || "#FF0000",
                strokeOpacity: (options && options.opacity) || 1,
                strokeWeight: (options && options.weight) || 10,
                zIndex: 9999,
            };
            if ((options === null || options === void 0 ? void 0 : options.style) !== null) {
                switch (options === null || options === void 0 ? void 0 : options.style) {
                    case PolylineType.Dotted:
                        console.warn("PolylineType.Dotted is deprecated, instead use PolylineType.Dashed.");
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
    };
    GooglePolylines.prototype.addPolylineEventMove = function (polyline, eventFunction) {
        polyline.moveListener = function (newEvent, lastEvent) {
            if (polyline.dragging)
                return;
            var path = polyline.getPath().getAt(newEvent);
            var newPosition = new EventReturn([path.lat(), path.lng()]);
            var lastPosition = new EventReturn([
                lastEvent.lat(),
                lastEvent.lng(),
            ]);
            eventFunction(newPosition, lastPosition, polyline.object, newEvent, polyline
                .getPath()
                .getArray()
                .map(function (x) { return new EventReturn([x.lat(), x.lng()]); }));
        };
        this.google.maps.event.addListener(polyline.getPath(), "set_at", polyline.moveListener);
    };
    GooglePolylines.prototype.addPolylineEventInsertAt = function (polyline, eventFunction) {
        polyline.insertAtListener = function (event) {
            var path = polyline.getPath();
            var newPath = path.getAt(event);
            var newPoint = new EventReturn([newPath.lat(), newPath.lng()]);
            var previousPath = path.getAt(event - 1);
            var previousPoint = previousPath
                ? new EventReturn([previousPath.lat(), previousPath.lng()])
                : null;
            eventFunction(newPoint, previousPoint, polyline.object, event, polyline
                .getPath()
                .getArray()
                .map(function (x) { return new EventReturn([x.lat(), x.lng()]); }));
        };
        this.google.maps.event.addListener(polyline.getPath(), "insert_at", polyline.insertAtListener);
    };
    GooglePolylines.prototype.addPolylineEventRemoveAt = function (polyline, eventFunction) {
        polyline.removeAtListener = function (event) {
            var param = new EventReturn([
                polyline.getPath().getAt(event).lat(),
                polyline.getPath().getAt(event).lng(),
            ]);
            eventFunction(param, polyline.object, polyline
                .getPath()
                .getArray()
                .map(function (x) { return new EventReturn([x.lat(), x.lng()]); }));
        };
        this.google.maps.event.addListener(polyline.getPath(), "remove_at", polyline.removeAtListener);
    };
    GooglePolylines.prototype.addPolylineEventRightClick = function (polyline, eventFunction) {
        polyline.rightClickPolylineListener = function (event) {
            polyline.dragging = false;
            var param = new EventReturn([
                event.latLng.lat(),
                event.latLng.lng(),
            ]);
            eventFunction(param, polyline.object);
        };
        this.google.maps.event.addListener(polyline, "rightclick", polyline.rightClickPolylineListener);
    };
    GooglePolylines.prototype.addPolylineEventMouseOver = function (polyline, eventFunction) {
        polyline.overPolylineListener = function (event) {
            polyline.dragging = false;
            var param = new EventReturn([
                event.latLng.lat(),
                event.latLng.lng(),
            ]);
            eventFunction(param, polyline.object);
        };
        this.google.maps.event.addListener(polyline, "mouseover", polyline.overPolylineListener);
    };
    GooglePolylines.prototype.addPolylineEventMouseOut = function (polyline, eventFunction) {
        polyline.outPolylineListener = function (event) {
            polyline.dragging = false;
            var param = new EventReturn([
                event.latLng.lat(),
                event.latLng.lng(),
            ]);
            eventFunction(param, polyline.object);
        };
        this.google.maps.event.addListener(polyline, "mouseout", polyline.outPolylineListener);
    };
    GooglePolylines.prototype.addPolylineEventDragPolyline = function (polyline, eventFunction) {
        polyline.dragPolylineListener = function () {
            polyline.dragging = false;
            var param = polyline
                .getPath()
                .getArray()
                .map(function (x) { return new EventReturn([x.lat(), x.lng()]); });
            eventFunction(param, polyline.object);
        };
        this.google.maps.event.addListener(polyline, "dragend", polyline.dragPolylineListener);
        this.google.maps.event.addListener(polyline, "dragstart", function () { return (polyline.dragging = true); });
    };
    GooglePolylines.prototype.updateSelectedPathListeners = function () {
        if (this.selectedPath.moveListener) {
            this.google.maps.event.clearListeners(this.selectedPath.getPath(), "set_at");
            this.google.maps.event.addListener(this.selectedPath.getPath(), "set_at", this.selectedPath.moveListener);
        }
        if (this.selectedPath.insertAtListener) {
            this.google.maps.event.clearListeners(this.selectedPath.getPath(), "insert_at");
            this.google.maps.event.addListener(this.selectedPath.getPath(), "insert_at", this.selectedPath.insertAtListener);
        }
        if (this.selectedPath.removeAtListener) {
            this.google.maps.event.clearListeners(this.selectedPath.getPath(), "remove_at");
            this.google.maps.event.addListener(this.selectedPath.getPath(), "remove_at", this.selectedPath.removeAtListener);
        }
    };
    GooglePolylines.prototype.drawPopupNavigation = function (polyline) {
        var _a, _b;
        var self = this;
        var idx = self.directionForward
            ? polyline.finalIdx
            : polyline.initialIdx;
        if (!self.navigateByPoint) {
            idx =
                polyline.finalIdx > polyline.initialIdx
                    ? polyline.finalIdx
                    : polyline.initialIdx;
        }
        var infowindow = polyline.infowindows
            ? polyline.infowindows[idx]
            : null;
        if (infowindow) {
            var point = polyline.getPath().getArray()[idx];
            if (self.navigateInfoWindow) {
                (_a = this.googlePopups) === null || _a === void 0 ? void 0 : _a.alterPopup(self.navigateInfoWindow, {
                    content: infowindow,
                    latlng: [point.lat(), point.lng()],
                });
            }
            else {
                self.navigateInfoWindow = (_b = this.googlePopups) === null || _b === void 0 ? void 0 : _b.drawPopup({
                    content: infowindow,
                    latlng: [point.lat(), point.lng()],
                });
            }
        }
    };
    GooglePolylines.prototype.checkIdx = function (polyline, point) {
        var self = this;
        var path = polyline.getPath();
        var distance = 0;
        var minDistance = Number.MAX_VALUE;
        var returnValue = -1;
        for (var i = 0; i < path.length - 1; i++) {
            distance = self.distanceToLine(path.getAt(i), path.getAt(i + 1), point);
            if (distance < minDistance) {
                minDistance = distance;
                returnValue = i;
            }
        }
        return returnValue;
    };
    GooglePolylines.prototype.distanceToLine = function (pt1, pt2, pt) {
        var self = this;
        var deltaX = pt2.lng() - pt1.lng();
        var deltaY = pt2.lat() - pt1.lat();
        var incIntersect = (pt.lng() - pt1.lng()) * deltaX;
        var deltaSum = deltaX * deltaX + deltaY * deltaY;
        incIntersect += (pt.lat() - pt1.lat()) * deltaY;
        if (deltaSum > 0) {
            incIntersect /= deltaSum;
        }
        else {
            incIntersect = -1;
        }
        // The intersection occurs outside the line segment, 'before' pt1.
        if (incIntersect < 0) {
            return self.kmTo(pt, pt1);
        }
        else if (incIntersect > 1) {
            return self.kmTo(pt, pt2);
        }
        // Intersection point calculation.
        var intersect = new this.google.maps.LatLng(pt1.lat() + incIntersect * deltaY, pt1.lng() + incIntersect * deltaX);
        return self.kmTo(pt, intersect);
    };
    GooglePolylines.prototype.kmTo = function (pt1, pt2) {
        var e = Math;
        var ra = e.PI / 180;
        var b = pt1.lat() * ra;
        var c = pt2.lat() * ra;
        var d = b - c;
        var g = pt1.lng() * ra - pt2.lng() * ra;
        var f = 2 *
            e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) +
                e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));
        return f * 6378.137 * 1000;
    };
    GooglePolylines.prototype.getPolylinesBounds = function (polylines) {
        var bounds = new this.google.maps.LatLngBounds();
        polylines.forEach(function (polyline) {
            var paths = polyline.getPath().getArray();
            paths.forEach(function (path) { return bounds.extend(path); });
        });
        return bounds;
    };
    GooglePolylines.prototype.getPolylineBounds = function (polyline) {
        var bounds = new this.google.maps.LatLngBounds();
        var paths = polyline.getPath().getArray();
        paths.forEach(function (path) { return bounds.extend(path); });
        return bounds;
    };
    return GooglePolylines;
}());
export default GooglePolylines;
//# sourceMappingURL=google-polylines.js.map
// import { Polyline } from "leaflet";
import { PolylineEventType } from "../../dto/event-type";
import { PolylineType } from "../../dto/polyline-type";
import EventReturn from "../../features/events/event-return";
var LeafletPolylines = /** @class */ (function () {
    function LeafletPolylines(map, leaflet, leafletPopup) {
        this.map = {};
        this.leaflet = {};
        this.selectedPolyline = null;
        this.selectedPath = null;
        this.navigateInfoWindow = null;
        this.directionForward = false;
        this.multiSelectionForward = false;
        this.multiSelection = false;
        this.navigateByPoint = false;
        this.navigationOptions = {};
        this.map = map;
        this.leaflet = leaflet;
        this.leafletPopup = leafletPopup;
    }
    LeafletPolylines.prototype.drawPolyline = function (options, eventClick) {
        var self = this;
        var newOptions = {
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
                    console.warn("PolylineType.Dotted is deprecated, instead use PolylineType.Dashed.");
                    break;
                case PolylineType.Dashed:
                    newOptions.opacity = 0.7;
                    newOptions.dashArray = "20,15";
                    break;
                default:
                    break;
            }
        }
        var polyline = new this.leaflet.Polyline(options.path || [], newOptions);
        polyline.on("editable:vertex:rawclick", function (e) {
            return e.cancel();
        });
        if (eventClick) {
            polyline.on("click", function (event) {
                self.leaflet.DomEvent.stopPropagation(event);
                var param = new EventReturn([
                    event.latlng.lat,
                    event.latlng.lng,
                ]);
                eventClick(param, event.target.object);
            });
            polyline.on("editable:vertex:rawclick", function (event) {
                event.cancel();
                var param = new EventReturn([
                    event.latlng.lat,
                    event.latlng.lng,
                ]);
                eventClick(param, event.target.object);
            });
        }
        if (options.style && options.style === PolylineType.Arrow) {
            var pathOptions = {
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
                            pathOptions: pathOptions,
                        }),
                    },
                    {
                        offset: "0%",
                        symbol: self.leaflet.Symbol.arrowHead({
                            pathOptions: pathOptions,
                            pixelSize: 20,
                        }),
                    },
                    {
                        offset: "100%",
                        symbol: self.leaflet.Symbol.arrowHead({
                            pixelSize: 20,
                            pathOptions: pathOptions,
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
    };
    LeafletPolylines.prototype.drawPolylineWithNavigation = function (options, eventClick) {
        var polyline = this.drawPolyline(options, null);
        polyline.navigationHandlerClick = eventClick;
        this.navigationOptions = options.navigateOptions;
        this.navigateByPoint = this.navigationOptions
            ? this.navigationOptions.navigateByPoint
            : true;
        this.addNavigation(polyline);
        return polyline;
    };
    LeafletPolylines.prototype.togglePolylines = function (polylines, show) {
        var self = this;
        polylines.forEach(function (polyline) {
            if (show) {
                self.map.addLayer(polyline);
                if (polyline.options.editable) {
                    polyline.enableEdit();
                }
                if (polyline.decorator) {
                    self.map.addLayer(polyline.decorator);
                }
            }
            else {
                self.map.removeLayer(polyline);
                if (polyline.options.editable) {
                    polyline.disableEdit();
                }
                if (polyline.decorator) {
                    self.map.removeLayer(polyline.decorator);
                }
            }
        });
    };
    LeafletPolylines.prototype.alterPolylineOptions = function (polylines, options) {
        var self = this;
        polylines.forEach(function (polyline) {
            var style = {
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
                    console.warn("PolylineType.Dotted is deprecated, instead use PolylineType.Dashed.");
                    break;
                case PolylineType.Dashed:
                    style.dashArray = "20,15";
                    break;
                case PolylineType.Arrow:
                    var pathOptions = {
                        fillOpacity: 1,
                        weight: 0,
                        color: style.color,
                    };
                    if (polyline.decorator) {
                        self.map.removeLayer(polyline.decorator);
                    }
                    polyline.decorator = self.leaflet.polylineDecorator(polyline, {
                        patterns: [
                            {
                                offset: "20%",
                                repeat: "90px",
                                symbol: self.leaflet.Symbol.arrowHead({
                                    pixelSize: 20,
                                    pathOptions: pathOptions,
                                }),
                            },
                            {
                                offset: "0%",
                                symbol: self.leaflet.Symbol.arrowHead({
                                    pixelSize: 20,
                                    pathOptions: pathOptions,
                                }),
                            },
                            {
                                offset: "100%",
                                symbol: self.leaflet.Symbol.arrowHead({
                                    pixelSize: 20,
                                    pathOptions: pathOptions,
                                }),
                            },
                        ],
                    });
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
    };
    LeafletPolylines.prototype.fitBoundsPolylines = function (polylines) {
        var self = this;
        self.map.fitBounds(self.getBoundsPolylines(polylines));
    };
    LeafletPolylines.prototype.isPolylineOnMap = function (polyline) {
        return this.map.hasLayer(polyline);
    };
    LeafletPolylines.prototype.addPolylinePath = function (polylines, position) {
        var _this = this;
        polylines.forEach(function (polyline) {
            var path = polyline.getLatLngs();
            path.push(new _this.leaflet.LatLng(position[0], position[1]));
            polyline.setLatLngs(path);
            if (polyline.editEnabled && polyline.editEnabled()) {
                polyline.disableEdit();
                polyline.enableEdit();
            }
        });
    };
    LeafletPolylines.prototype.getPolylinePath = function (polyline) {
        return polyline.getLatLngs().map(function (x) { return [x.lat, x.lng]; });
    };
    LeafletPolylines.prototype.removePolylineHighlight = function () {
        var self = this;
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
    };
    LeafletPolylines.prototype.addPolylineEvent = function (polylines, eventType, eventFunction) {
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
                case PolylineEventType.MouseOver:
                    _this.addPolylineEventMouseOver(polyline, eventFunction);
                    break;
                case PolylineEventType.MouseOut:
                    _this.addPolylineEventMouseOut(polyline, eventFunction);
                    break;
                case PolylineEventType.DragPolyline:
                    _this.addPolylineEventDragPolyline(polyline, eventFunction);
                    break;
                default:
                    break;
            }
        });
    };
    LeafletPolylines.prototype.removePolylineEvent = function (polylines, event) {
        polylines.forEach(function (polyline) {
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
    };
    LeafletPolylines.prototype.setIndexPolylineHighlight = function (polyline, index) {
        this.directionForward = false;
        polyline.initialIdx = index;
        polyline.finalIdx = index + 1;
        this.moveSelectedPath(polyline, this.navigationOptions);
        this.selectedPolyline = polyline;
        if (this.navigationOptions.navegateOnKeyPress) {
            document.onkeydown = this.onKeyUp.bind(this);
        }
        else {
            document.onkeyup = this.onKeyUp.bind(this);
        }
    };
    LeafletPolylines.prototype.getObjectPolyline = function (polyline) {
        return polyline.object;
    };
    LeafletPolylines.prototype.getObjectPolylineHighlight = function () {
        if (this.selectedPath) {
            return this.selectedPath.object;
        }
        return null;
    };
    LeafletPolylines.prototype.addPolylineHighlightEvent = function (eventType, eventFunction) {
        if (this.selectedPolyline) {
            this.addPolylineEvent([this.selectedPath], eventType, eventFunction);
        }
    };
    LeafletPolylines.prototype.getPolylineHighlightIndex = function () {
        if (this.selectedPath) {
            return [this.selectedPath.initialIdx, this.selectedPath.finalIdx];
        }
        return null;
    };
    /* Private methods */
    LeafletPolylines.prototype.addNavigation = function (polyline) {
        polyline.clearAllEventListeners();
        polyline.on("click", this.onClickPolyline.bind(this, polyline));
    };
    LeafletPolylines.prototype.onClickPolyline = function (polyline, event) {
        var index = this.checkIdx(polyline, event.latlng);
        polyline.initialIdx = index;
        polyline.finalIdx = index + 1;
        this.moveSelectedPath(polyline, this.navigationOptions);
        this.selectedPolyline = polyline;
        if (this.navigationOptions.navegateOnKeyPress) {
            document.onkeydown = this.onKeyUp.bind(this);
        }
        else {
            document.onkeyup = this.onKeyUp.bind(this);
        }
        if (polyline.navigationHandlerClick) {
            var param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            polyline.navigationHandlerClick(param, event.target.object);
        }
    };
    LeafletPolylines.prototype.onKeyUp = function (event) {
        var self = this;
        if (self.selectedPath) {
            if (event.ctrlKey) {
                console.warn("Deprecated: CTRL is not needed in navigation anymore");
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
    };
    LeafletPolylines.prototype.moveFowards = function (multiselection) {
        var polyline = this.selectedPolyline;
        if ((!this.navigateByPoint || this.directionForward) &&
            polyline.finalIdx < polyline.getLatLngs().length - 1) {
            this.navigateFoward(multiselection, polyline);
        }
        this.directionForward = true;
        this.moveSelectedPath(polyline, null);
    };
    LeafletPolylines.prototype.navigateFoward = function (multiSelection, polyline) {
        if (!multiSelection) {
            polyline.finalIdx++;
            polyline.initialIdx = this.multiSelection
                ? polyline.finalIdx - 1
                : polyline.initialIdx + 1;
            this.multiSelection = false;
        }
        else {
            this.multiSelection = true;
            if (this.multiSelectionForward) {
                polyline.finalIdx++;
            }
            this.multiSelectionForward = true;
        }
    };
    LeafletPolylines.prototype.moveBackwards = function (multiSelection) {
        var polyline = this.selectedPolyline;
        if ((!this.navigateByPoint || !this.directionForward) &&
            polyline.initialIdx > 0) {
            this.navigateBackward(multiSelection, polyline);
        }
        this.directionForward = false;
        this.moveSelectedPath(polyline, null);
    };
    LeafletPolylines.prototype.navigateBackward = function (multiSelection, polyline) {
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
    LeafletPolylines.prototype.moveSelectedPath = function (polyline, options) {
        var self = this;
        var pathSelected = polyline
            .getLatLngs()
            .map(function (x) { return [x.lat, x.lng]; })
            .slice(polyline.initialIdx, polyline.finalIdx + 1);
        if (self.selectedPath) {
            self.selectedPath.setLatLngs(pathSelected);
            this.selectedPath.object = polyline.object;
        }
        else {
            this.addNewSelectedPath(pathSelected, options, polyline.object);
            this.selectedPath.addTo(this.map);
        }
        if (this.selectedPath.decorator) {
            this.map.removeLayer(this.selectedPath.decorator);
            this.setArrowSelectedPath();
        }
        if ((options && options.editable) ||
            (this.selectedPath.editEnabled && this.selectedPath.editEnabled())) {
            this.selectedPath.disableEdit();
            this.selectedPath.enableEdit();
        }
        this.selectedPath.initialIdx = polyline.initialIdx;
        this.selectedPath.finalIdx = polyline.finalIdx;
        var idx = self.directionForward
            ? polyline.finalIdx
            : polyline.initialIdx;
        if (!this.navigateByPoint) {
            idx =
                polyline.finalIdx > polyline.initialIdx
                    ? polyline.finalIdx
                    : polyline.initialIdx;
        }
        var infowindow = polyline.options.infowindows
            ? polyline.options.infowindows[idx]
            : null;
        if (infowindow) {
            var point = polyline.getLatLngs()[idx];
            if (self.navigateInfoWindow) {
                self.leafletPopup.alterPopup(self.navigateInfoWindow, {
                    content: infowindow,
                    latlng: [point.lat, point.lng],
                });
            }
            else {
                self.navigateInfoWindow = self.leafletPopup.drawPopup({
                    content: infowindow,
                    latlng: [point.lat, point.lng],
                });
            }
        }
    };
    LeafletPolylines.prototype.setArrowSelectedPath = function () {
        var pathOptions = {
            fillOpacity: 1,
            weight: 0,
            color: this.selectedPath.options.color,
        };
        this.selectedPath.decorator = this.leaflet.polylineDecorator(this.selectedPath, {
            patterns: [
                {
                    offset: "100%",
                    symbol: this.leaflet.Symbol.arrowHead({
                        pixelSize: 20,
                        pathOptions: pathOptions,
                    }),
                },
            ],
        });
        this.selectedPath.decorator.addTo(this.map);
    };
    LeafletPolylines.prototype.addNewSelectedPath = function (pathSelected, options, object) {
        var newOptions = {
            color: (options && options.color) || "#FF0000",
            draggable: false,
            editable: options === null || options === void 0 ? void 0 : options.editable,
            opacity: (options && options.opacity) || 1,
            weight: (options && options.weight) || 10,
            zIndex: 9999,
        };
        if ((options === null || options === void 0 ? void 0 : options.style) !== null) {
            switch (options === null || options === void 0 ? void 0 : options.style) {
                case PolylineType.Dotted:
                    console.warn("PolylineType.Dotted is deprecated, instead use PolylineType.Dashed.");
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
        this.selectedPath.on("editable:vertex:rawclick", function (e) {
            return e.cancel();
        });
        if ((options === null || options === void 0 ? void 0 : options.style) && options.style === PolylineType.Arrow) {
            this.setArrowSelectedPath();
        }
        this.selectedPath.object = object;
        this.selectedPath.highlight = true;
    };
    LeafletPolylines.prototype.checkIdx = function (polyline, point) {
        var self = this;
        var path = polyline.getLatLngs();
        var distance = 0;
        var minDistance = Number.MAX_VALUE;
        var returnValue = -1;
        for (var i = 0; i < path.length - 1; i++) {
            distance = self.distanceToLine(path[i], path[i + 1], point);
            if (distance < minDistance) {
                minDistance = distance;
                returnValue = i;
            }
        }
        return returnValue;
    };
    LeafletPolylines.prototype.distanceToLine = function (pt1, pt2, pt) {
        var self = this;
        var deltaX = pt2.lng - pt1.lng;
        var deltaY = pt2.lat - pt1.lat;
        var incIntersect = (pt.lng - pt1.lng) * deltaX;
        var deltaSum = deltaX * deltaX + deltaY * deltaY;
        incIntersect += (pt.lat - pt1.lat) * deltaY;
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
        var intersect = new this.leaflet.LatLng(pt1.lat + incIntersect * deltaY, pt1.lng + incIntersect * deltaX);
        return self.kmTo(pt, intersect);
    };
    LeafletPolylines.prototype.kmTo = function (pt1, pt2) {
        var e = Math;
        var ra = e.PI / 180;
        var b = pt1.lat * ra;
        var c = pt2.lat * ra;
        var d = b - c;
        var g = pt1.lng * ra - pt2.lng * ra;
        var f = 2 *
            e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) +
                e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));
        return f * 6378.137 * 1000;
    };
    LeafletPolylines.prototype.getBoundsPolylines = function (polylines) {
        var group = new this.leaflet.FeatureGroup(polylines);
        return group.getBounds();
    };
    LeafletPolylines.prototype.addPolylineEventMove = function (polyline, eventFunction) {
        var self = this;
        polyline.on("editable:vertex:dragstart", function (eventStart) {
            var lastPosition = new EventReturn([
                eventStart.vertex.latlng.lat,
                eventStart.vertex.latlng.lng,
            ]);
            polyline.on("editable:vertex:dragend", function (eventEnd) {
                if (polyline.highlight && polyline.decorator) {
                    self.map.removeLayer(polyline.decorator);
                    self.setArrowSelectedPath();
                }
                var newPosition = new EventReturn([
                    eventEnd.vertex.latlng.lat,
                    eventEnd.vertex.latlng.lng,
                ]);
                eventFunction(newPosition, lastPosition, eventEnd.target.object, eventEnd.vertex.getIndex(), polyline
                    .getLatLngs()
                    .map(function (x) { return new EventReturn([x.lat, x.lng]); }));
                polyline.off("editable:vertex:dragend");
            });
        });
    };
    LeafletPolylines.prototype.addPolylineEventInsertAt = function (polyline, eventFunction) {
        var self = this;
        polyline.on("editable:vertex:new", function (eventNew) {
            var latlngs = eventNew.vertex.latlngs;
            var previous = latlngs[latlngs.findIndex(function (x) { return x === eventNew.vertex.latlng; }) - 1];
            var previousPoint = new EventReturn([previous.lat, previous.lng]);
            polyline.on("editable:vertex:dragend", function (event) {
                if (polyline.highlight && polyline.decorator) {
                    self.map.removeLayer(polyline.decorator);
                    self.setArrowSelectedPath();
                }
                var newPoint = new EventReturn([
                    event.vertex.latlng.lat,
                    event.vertex.latlng.lng,
                ]);
                eventFunction(newPoint, previousPoint, event.target.object, event.vertex.getIndex(), polyline
                    .getLatLngs()
                    .map(function (x) { return new EventReturn([x.lat, x.lng]); }));
                polyline.off("editable:vertex:dragend");
            });
        });
    };
    LeafletPolylines.prototype.addPolylineEventRemoveAt = function (polyline, eventFunction) {
        polyline.on("editable:vertex:deleted", function (event) {
            var param = new EventReturn([
                event.vertex.latlng.lat,
                event.vertex.latlng.lng,
            ]);
            eventFunction(param, event.target.object, polyline
                .getLatLngs()
                .map(function (x) { return new EventReturn([x.lat, x.lng]); }));
        });
    };
    LeafletPolylines.prototype.addPolylineEventRightClick = function (polyline, eventFunction) {
        polyline.on("contextmenu", function (event) {
            var param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            eventFunction(param, polyline.object);
        });
        polyline.on("editable:vertex:contextmenu", function (event) {
            var param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            eventFunction(param, polyline.object);
        });
    };
    LeafletPolylines.prototype.addPolylineEventMouseOver = function (polyline, eventFunction) {
        polyline.on("mouseover", function (event) {
            var param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            eventFunction(param, event.target.object);
        });
    };
    LeafletPolylines.prototype.addPolylineEventMouseOut = function (polyline, eventFunction) {
        polyline.on("mouseout", function (event) {
            var param = new EventReturn([event.latlng.lat, event.latlng.lng]);
            eventFunction(param, event.target.object);
        });
    };
    LeafletPolylines.prototype.addPolylineEventDragPolyline = function (polyline, eventFunction) {
        polyline.on("dragend", function (event) {
            var param = event.target
                .getLatLngs()
                .map(function (x) { return new EventReturn([x.lat, x.lng]); });
            eventFunction(param, event.target.object);
        });
    };
    return LeafletPolylines;
}());
export default LeafletPolylines;
//# sourceMappingURL=leaflet-polylines.js.map
export var MapEventType;
(function (MapEventType) {
    MapEventType[MapEventType["Click"] = 0] = "Click";
    MapEventType[MapEventType["ZoomChanged"] = 1] = "ZoomChanged";
})(MapEventType || (MapEventType = {}));
export var MarkerEventType;
(function (MarkerEventType) {
    MarkerEventType[MarkerEventType["Click"] = 0] = "Click";
    MarkerEventType[MarkerEventType["RightClick"] = 1] = "RightClick";
    MarkerEventType[MarkerEventType["AfterDrag"] = 2] = "AfterDrag";
    MarkerEventType[MarkerEventType["MouseOver"] = 3] = "MouseOver";
    MarkerEventType[MarkerEventType["MouseOut"] = 4] = "MouseOut";
    MarkerEventType[MarkerEventType["BeforeDrag"] = 5] = "BeforeDrag";
})(MarkerEventType || (MarkerEventType = {}));
export var CircleEventType;
(function (CircleEventType) {
    CircleEventType[CircleEventType["Click"] = 0] = "Click";
    CircleEventType[CircleEventType["CenterChanged"] = 1] = "CenterChanged";
    CircleEventType[CircleEventType["RadiusChanged"] = 2] = "RadiusChanged";
})(CircleEventType || (CircleEventType = {}));
export var PolygonEventType;
(function (PolygonEventType) {
    PolygonEventType[PolygonEventType["SetAt"] = 0] = "SetAt";
    PolygonEventType[PolygonEventType["InsertAt"] = 1] = "InsertAt";
    PolygonEventType[PolygonEventType["RemoveAt"] = 2] = "RemoveAt";
    PolygonEventType[PolygonEventType["DragPolygon"] = 3] = "DragPolygon";
    PolygonEventType[PolygonEventType["Click"] = 4] = "Click";
})(PolygonEventType || (PolygonEventType = {}));
export var PolylineEventType;
(function (PolylineEventType) {
    PolylineEventType[PolylineEventType["SetAt"] = 0] = "SetAt";
    PolylineEventType[PolylineEventType["InsertAt"] = 1] = "InsertAt";
    PolylineEventType[PolylineEventType["RemoveAt"] = 2] = "RemoveAt";
    PolylineEventType[PolylineEventType["DragPolyline"] = 3] = "DragPolyline";
    PolylineEventType[PolylineEventType["MouseOver"] = 4] = "MouseOver";
    PolylineEventType[PolylineEventType["MouseOut"] = 5] = "MouseOut";
    PolylineEventType[PolylineEventType["RightClick"] = 6] = "RightClick";
})(PolylineEventType || (PolylineEventType = {}));
//# sourceMappingURL=event-type.js.map
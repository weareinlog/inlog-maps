var OverlayOptions = /** @class */ (function () {
    function OverlayOptions(divElement, addToMap, position, object, polygon, conditionPolygon, draggable) {
        if (draggable === void 0) { draggable = false; }
        this.position = position;
        this.divElement = divElement;
        this.addToMap = addToMap;
        this.object = object;
        this.polygon = polygon;
        this.conditionPolygon = conditionPolygon;
        this.draggable = draggable;
    }
    return OverlayOptions;
}());
export default OverlayOptions;
//# sourceMappingURL=overlay-options.js.map
var MarkerOptions = /** @class */ (function () {
    function MarkerOptions(latlng, addToMap, draggable, icon, fitBounds, object, addClusterer) {
        if (addToMap === void 0) { addToMap = false; }
        if (draggable === void 0) { draggable = false; }
        if (fitBounds === void 0) { fitBounds = false; }
        if (addClusterer === void 0) { addClusterer = false; }
        this.latlng = latlng;
        this.addToMap = addToMap;
        this.draggable = draggable;
        this.icon = icon;
        this.fitBounds = fitBounds;
        this.object = object;
        this.addClusterer = addClusterer;
    }
    return MarkerOptions;
}());
export default MarkerOptions;
//# sourceMappingURL=marker-options.js.map
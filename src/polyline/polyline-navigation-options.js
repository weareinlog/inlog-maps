export default class PolylineNavigationOptions {
    constructor(path, infowindows, addToMap, fitBounds, editable, draggable, color, weight, object,
        navigateOptions) {
        this.path = path;
        this.infowindows = infowindows;
        this.addToMap = addToMap;
        this.fitBounds = fitBounds;
        this.editable = editable;
        this.draggable = draggable;
        this.color = color;
        this.weight = weight;
        this.object = object;
        this.navigateOptions = navigateOptions;
    }
}

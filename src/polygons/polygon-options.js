export default class PolygonOptions {
    constructor(path, weight, addToMap, color, opacity, fillColor, fillOpacity, draggable,
        editable, fitBounds, object) {

        this.path = path;
        this.weight = weight;
        this.addToMap = addToMap;
        this.color = color;
        this.opacity = opacity;
        this.fillColor = fillColor;
        this.fillOpacity = fillOpacity;
        this.draggable = draggable;
        this.editable = editable;
        this.fitBounds = fitBounds;
        this.object = object;
    }
}

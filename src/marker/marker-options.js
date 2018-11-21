export default class MarkerOptions {
    constructor(latlng, addToMap, draggable, icon, fitBounds, object) {
        this.latlng = latlng;
        this.addToMap = addToMap;
        this.draggable = draggable;
        this.icon = icon;
        this.fitBounds = fitBounds;
        this.object = object;
    }
}


export default class GeoJsonOptions {
    public draggable?: boolean;
    public editable?: boolean;

    constructor(draggable?: boolean, editable?: boolean) {
        this.draggable = draggable;
        this.editable = editable;
    }
}

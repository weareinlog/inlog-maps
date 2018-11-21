import MarkerIcon from './marker-icon';
export default class MarkerOptions {
    latlng: number[];
    addToMap?: boolean;
    draggable?: boolean;
    icon?: MarkerIcon;
    fitBounds?: boolean;
    object?: object;
    constructor(latlng: number[], addToMap?: boolean, draggable?: boolean, icon?: MarkerIcon, fitBounds?: boolean, object?: object);
}

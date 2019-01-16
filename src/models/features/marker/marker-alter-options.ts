import CircleMarkerStyle from './circle-marker-style';
import MarkerIcon from './marker-icon';

export default class MarkerAlterOptions {
    public latlng?: number[];
    public icon?: MarkerIcon;
    public style?: CircleMarkerStyle;

    constructor(latlng?: number[], icon?: MarkerIcon, style?: CircleMarkerStyle) {
        this.latlng = latlng;
        this.icon = icon;
        this.style = style;
    }
}

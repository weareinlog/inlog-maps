import CircleMarkerStyle from './circle-marker-style';
import MarkerIcon from './marker-icon';
export default class MarkerAlterOptions {
    latlng?: number;
    icon?: MarkerIcon;
    style?: CircleMarkerStyle;
    constructor(latlng?: number, icon?: MarkerIcon, style?: CircleMarkerStyle);
}

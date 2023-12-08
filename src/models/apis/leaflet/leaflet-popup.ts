import PopupOptions from '../../features/popup/popup-options';

export default class LeafletPopup {
    private map: any = {};
    private leaflet: any = {};

    constructor(map: any, leaflet: any) {
        this.map = map;
        this.leaflet = leaflet;
    }

    public drawPopup(options: PopupOptions, marker?: any) {
        const self = this;
        let popup = null;

        if (!marker) {
            popup = new this.leaflet.Popup();
            popup.setLatLng(options.latlng);
            popup.setContent(options.content);
            popup.openOn(self.map);

        } else {
            popup = self.drawPopupOnMarker(marker, options);
        }

        if (options.object) {
            popup.object = options.object;
        }
        return popup;
    }

    public alterPopup(popup: any, options: PopupOptions, marker?: any) {
        const self = this;

        if (marker && !marker.getPopup()) {
            popup = self.drawPopup(options, marker);
        } else {
            self.alterPopupContent(popup, options, marker);

            if (!popup.isOpen()) {
                if (!marker) {
                    popup.openOn(self.map);
                } else if (options.notCalledByMap) {
                    marker.openPopup();
                }
            }
        }

        if (options.object) {
            popup.object = options.object;
        }

        return popup;
    }

    public alterPopupContent(popup: any, options: PopupOptions, marker?: any) {
        if (marker) {
            popup = marker._popup;
        }

        if (popup) {
            if (options.content) {
                popup.setContent(options.content);
            }

            if (options.latlng) {
                popup.setLatLng(options.latlng);
            }
        }

        if (options.object) {
            popup.object = options.object;
        }
    }

    public closePopup(popup: any) {
        popup.remove();
    }

    private drawPopupOnMarker(marker: any, options: PopupOptions) {
        marker.bindPopup(options.content);
        const popup = marker.getPopup();

        marker.openPopup();
        return popup;
    }
}

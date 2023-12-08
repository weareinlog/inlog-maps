import PopupOptions from "../../features/popup/popup-options";

export default class GooglePopups {
    private map: any = {};
    private google: any = {};

    constructor(map: any, google: any) {
        this.map = map;
        this.google = google;
    }

    public drawPopup(options: PopupOptions, marker?: any) {
        const self = this;
        const infowindow = new this.google.maps.InfoWindow({
            content: options.content,
        });

        if (options.latlng) {
            infowindow.setPosition({
                lat: options.latlng[0],
                lng: options.latlng[1],
            });
        }

        infowindow.open(self.map, marker || null);

        if (options.object) {
            infowindow.object = options.object;
        }
        return infowindow;
    }

    public alterPopup(popup: any, options: PopupOptions, marker?: any) {
        const self = this;
        self.alterPopupContent(popup, options, marker);

        if (!popup.getMap()) {
            popup.open(self.map, marker || null);
        }

        if (options.object) {
            popup.object = options.object;
        }

        return popup;
    }

    public alterPopupContent(popup: any, options: PopupOptions, marker?: any) {
        if (options.content) {
            popup.setContent(options.content);
        }

        if (options.latlng) {
            popup.setPosition({
                lat: options.latlng[0],
                lng: options.latlng[1],
            });
        } else if (marker) {
            popup.setPosition(marker.getPosition());
        }

        if (options.object) {
            popup.object = options.object;
        }
    }

    public closePopup(popup: any) {
        popup.close();
    }
}

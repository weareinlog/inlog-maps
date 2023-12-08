var GooglePopups = /** @class */ (function () {
    function GooglePopups(map, google) {
        this.map = {};
        this.google = {};
        this.map = map;
        this.google = google;
    }
    GooglePopups.prototype.drawPopup = function (options, marker) {
        var self = this;
        var infowindow = new this.google.maps.InfoWindow({
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
    };
    GooglePopups.prototype.alterPopup = function (popup, options, marker) {
        var self = this;
        self.alterPopupContent(popup, options, marker);
        if (!popup.getMap()) {
            popup.open(self.map, marker || null);
        }
        if (options.object) {
            popup.object = options.object;
        }
        return popup;
    };
    GooglePopups.prototype.alterPopupContent = function (popup, options, marker) {
        if (options.content) {
            popup.setContent(options.content);
        }
        if (options.latlng) {
            popup.setPosition({
                lat: options.latlng[0],
                lng: options.latlng[1],
            });
        }
        else if (marker) {
            popup.setPosition(marker.getPosition());
        }
        if (options.object) {
            popup.object = options.object;
        }
    };
    GooglePopups.prototype.closePopup = function (popup) {
        popup.close();
    };
    return GooglePopups;
}());
export default GooglePopups;
//# sourceMappingURL=google-popup.js.map
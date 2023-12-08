var LeafletPopup = /** @class */ (function () {
    function LeafletPopup(map, leaflet) {
        this.map = {};
        this.leaflet = {};
        this.map = map;
        this.leaflet = leaflet;
    }
    LeafletPopup.prototype.drawPopup = function (options, marker) {
        var self = this;
        var popup = null;
        if (!marker) {
            popup = new this.leaflet.Popup();
            popup.setLatLng(options.latlng);
            popup.setContent(options.content);
            popup.openOn(self.map);
        }
        else {
            popup = self.drawPopupOnMarker(marker, options);
        }
        if (options.object) {
            popup.object = options.object;
        }
        return popup;
    };
    LeafletPopup.prototype.alterPopup = function (popup, options, marker) {
        var self = this;
        if (marker && !marker.getPopup()) {
            popup = self.drawPopup(options, marker);
        }
        else {
            self.alterPopupContent(popup, options, marker);
            if (!popup.isOpen()) {
                if (!marker) {
                    popup.openOn(self.map);
                }
                else if (options.notCalledByMap) {
                    marker.openPopup();
                }
            }
        }
        if (options.object) {
            popup.object = options.object;
        }
        return popup;
    };
    LeafletPopup.prototype.alterPopupContent = function (popup, options, marker) {
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
    };
    LeafletPopup.prototype.closePopup = function (popup) {
        popup.remove();
    };
    LeafletPopup.prototype.drawPopupOnMarker = function (marker, options) {
        marker.bindPopup(options.content);
        var popup = marker.getPopup();
        marker.openPopup();
        return popup;
    };
    return LeafletPopup;
}());
export default LeafletPopup;
//# sourceMappingURL=leaflet-popup.js.map
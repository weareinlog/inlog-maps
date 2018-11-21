"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_type_1 = require("../models/dto/map-type");
var url_builder_1 = require("./url-builder");
var MapsApiLoaderService = /** @class */ (function () {
    function MapsApiLoaderService() {
    }
    MapsApiLoaderService.loadGoogleAPI = function (params) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url_builder_1.urlBuilder({
            apiKey: params.apiKey,
            base: 'https://maps.googleapis.com/maps/api/js',
            callback: 'mapsAPILoadCallback',
            client: params.client,
            language: params.language,
            libraries: params.libraries || []
        });
        document.querySelector('head').appendChild(script);
    };
    MapsApiLoaderService.loadLeafletAPI = function (params) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url_builder_1.urlBuilder({
            base: 'https://unpkg.com/leaflet@1.3.3/dist/leaflet.js',
            callback: 'mapsAPILoadCallback',
            crossorigin: params.crossorigin,
            integrity: params.integrity
        });
        document.querySelector('head').appendChild(script);
    };
    // TODO: needs refactoring
    MapsApiLoaderService.prototype.loadApi = function (mapType, params) {
        if (MapsApiLoaderService.mapsApi) {
            return Promise.resolve(MapsApiLoaderService.mapsApi);
        }
        MapsApiLoaderService.windowRef = window ? window : { api: null, mapsAPILoadCallback: null };
        var deferred = function (resolve, reject) {
            if (mapType === map_type_1.MapType.Google) {
                MapsApiLoaderService.loadGoogleAPI(params);
            }
            else {
                MapsApiLoaderService.loadLeafletAPI(params);
            }
            // Temporaria para testar Leaflet
            if (mapType === map_type_1.MapType.Leaflet) {
                setTimeout(function () {
                    MapsApiLoaderService.mapsApi = MapsApiLoaderService.windowRef.L;
                    resolve(MapsApiLoaderService.mapsApi);
                }, 2000);
            }
            else {
                MapsApiLoaderService.windowRef.mapsAPILoadCallback = function () {
                    MapsApiLoaderService.mapsApi = MapsApiLoaderService.windowRef.google;
                    resolve(MapsApiLoaderService.mapsApi);
                };
            }
            setTimeout(function () {
                if (!MapsApiLoaderService.windowRef.api) {
                    reject(new Error('Loading took too long'));
                }
            }, 5000);
        };
        return new Promise(deferred);
    };
    MapsApiLoaderService.windowRef = null;
    MapsApiLoaderService.mapsApi = null;
    return MapsApiLoaderService;
}());
exports.MapsApiLoaderService = MapsApiLoaderService;
//# sourceMappingURL=maps-api-loader.service.js.map
// @ts-nocheck
import { MapType } from "../models/dto/map-type";
import { urlBuilder } from "./url-builder";
var MapsApiLoaderService = /** @class */ (function () {
    function MapsApiLoaderService() {
        /* */
    }
    MapsApiLoaderService.loadGoogleAPI = function (params) {
        var _a, _b;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.setAttribute("data-google-inlogmaps", "true");
        script.src = urlBuilder({
            apiKey: params.apiKey,
            base: "https://maps.googleapis.com/maps/api/js",
            callback: "mapsAPILoadCallback",
            client: params.client,
            language: params.language,
            libraries: params.libraries || [],
        });
        var has_script = (_a = document
            .querySelector("script")) === null || _a === void 0 ? void 0 : _a.hasAttribute("data-google-inlogmaps");
        if (!has_script)
            (_b = document.querySelector("head")) === null || _b === void 0 ? void 0 : _b.appendChild(script);
    };
    MapsApiLoaderService.loadLeafletAPI = function (params) {
        var _a, _b;
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://desenvolvimentoweb.blob.core.windows.net/inlog-leaflet/leaflet.css";
        // link.integrity = params.cssIntegrity;
        // link.setAttribute('crossorigin', params.crossorigin);
        (_a = document.querySelector("head")) === null || _a === void 0 ? void 0 : _a.appendChild(link);
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = urlBuilder({
            base: "https://desenvolvimentoweb.blob.core.windows.net/inlog-leaflet/leaflet.js",
            callback: "mapsAPILoadCallback",
            // crossorigin: params.crossorigin,
            // integrity: params.integrity
        });
        (_b = document === null || document === void 0 ? void 0 : document.querySelector("head")) === null || _b === void 0 ? void 0 : _b.appendChild(script);
    };
    // TODO: needs refactoring
    MapsApiLoaderService.prototype.loadApi = function (mapType, params) {
        if (MapsApiLoaderService.mapsApi) {
            return Promise.resolve(MapsApiLoaderService.mapsApi);
        }
        MapsApiLoaderService.windowRef = window
            ? window
            : { api: null, mapsAPILoadCallback: null };
        var deferred = function (resolve, reject) {
            if (mapType === MapType.Google) {
                MapsApiLoaderService.loadGoogleAPI(params);
            }
            else {
                MapsApiLoaderService.loadLeafletAPI(params);
            }
            // Temporaria para testar Leaflet
            if (mapType === MapType.Leaflet) {
                setTimeout(function () {
                    MapsApiLoaderService.mapsApi =
                        MapsApiLoaderService.windowRef.L;
                    resolve(MapsApiLoaderService.mapsApi);
                }, 2000);
            }
            else {
                MapsApiLoaderService.windowRef.mapsAPILoadCallback = function () {
                    MapsApiLoaderService.mapsApi =
                        MapsApiLoaderService.windowRef.google;
                    resolve(MapsApiLoaderService.mapsApi);
                };
            }
            setTimeout(function () {
                var _a;
                if (!((_a = MapsApiLoaderService === null || MapsApiLoaderService === void 0 ? void 0 : MapsApiLoaderService.windowRef) === null || _a === void 0 ? void 0 : _a.api)) {
                    reject(new Error("Loading took too long"));
                }
            }, 5000);
        };
        return new Promise(deferred);
    };
    MapsApiLoaderService.windowRef = null;
    MapsApiLoaderService.mapsApi = null;
    return MapsApiLoaderService;
}());
export { MapsApiLoaderService };
//# sourceMappingURL=maps-api-loader.service.js.map
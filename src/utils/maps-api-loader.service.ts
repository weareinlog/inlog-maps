// @ts-nocheck
import { MapType } from "../models/dto/map-type";
import { urlBuilder } from "./url-builder";

export class MapsApiLoaderService {
    public static loadGoogleAPI(params: {
        apiKey: any;
        client: any;
        language: any;
        libraries: any;
    }) {
        const script = document.createElement("script");

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

        var has_script = document
            .querySelector("script")
            ?.hasAttribute("data-google-inlogmaps");

        if (!has_script) document.querySelector("head")?.appendChild(script);
    }

    public static loadLeafletAPI(params: any) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://desenvolvimentoweb.blob.core.windows.net/inlog-leaflet/leaflet.css";
        // link.integrity = params.cssIntegrity;
        // link.setAttribute('crossorigin', params.crossorigin);

        document.querySelector("head")?.appendChild(link);

        const script = document.createElement("script");
        script.type = "text/javascript";

        script.src = urlBuilder({
            base: "https://desenvolvimentoweb.blob.core.windows.net/inlog-leaflet/leaflet.js",
            callback: "mapsAPILoadCallback",
            // crossorigin: params.crossorigin,
            // integrity: params.integrity
        });

        document?.querySelector("head")?.appendChild(script);
    }

    private static windowRef = null;
    private static mapsApi = null;

    constructor() {
        /* */
    }

    // TODO: needs refactoring
    public loadApi(mapType: MapType, params: any): Promise<any> {
        if (MapsApiLoaderService.mapsApi) {
            return Promise.resolve(MapsApiLoaderService.mapsApi);
        }

        MapsApiLoaderService.windowRef = window
            ? window
            : { api: null, mapsAPILoadCallback: null };

        const deferred = (
            resolve: (arg0: null) => void,
            reject: (arg0: Error) => void
        ) => {
            if (mapType === MapType.Google) {
                MapsApiLoaderService.loadGoogleAPI(params);
            } else {
                MapsApiLoaderService.loadLeafletAPI(params);
            }

            // Temporaria para testar Leaflet
            if (mapType === MapType.Leaflet) {
                setTimeout(() => {
                    MapsApiLoaderService.mapsApi =
                        MapsApiLoaderService.windowRef.L;
                    resolve(MapsApiLoaderService.mapsApi);
                }, 2000);
            } else {
                MapsApiLoaderService.windowRef.mapsAPILoadCallback = () => {
                    MapsApiLoaderService.mapsApi =
                        MapsApiLoaderService.windowRef.google;
                    resolve(MapsApiLoaderService.mapsApi);
                };
            }

            setTimeout(() => {
                if (!MapsApiLoaderService?.windowRef?.api) {
                    reject(new Error("Loading took too long"));
                }
            }, 5000);
        };

        return new Promise(deferred);
    }
}

import { MapType } from '../models/dto/map-type';
import { urlBuilder } from './url-builder';

export class MapsApiLoaderService {
    public static loadGoogleAPI(params) {
        const script = document.createElement('script');

        script.type = 'text/javascript';

        script.src = urlBuilder({
            apiKey: params.apiKey,
            base: 'https://maps.googleapis.com/maps/api/js',
            callback: 'mapsAPILoadCallback',
            client: params.client,
            language: params.language,
            libraries: params.libraries || []
        });

        document.querySelector('head').appendChild(script);
    }

    public static loadLeafletAPI(params) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.css';
        // link.integrity = params.cssIntegrity;
        // link.setAttribute('crossorigin', params.crossorigin);

        document.querySelector('head').appendChild(link);

        const script = document.createElement('script');
        script.type = 'text/javascript';

        script.src = urlBuilder({
            base: 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js',
            callback: 'mapsAPILoadCallback',
            // crossorigin: params.crossorigin,
            // integrity: params.integrity
        });

        document.querySelector('head').appendChild(script);
    }

    private static windowRef = null;
    private static mapsApi = null;

    constructor() { /* */ }

    // TODO: needs refactoring
    public loadApi(mapType: MapType, params) {
        if (MapsApiLoaderService.mapsApi) {
            return Promise.resolve(MapsApiLoaderService.mapsApi);
        }

        MapsApiLoaderService.windowRef = window ? window : { api: null, mapsAPILoadCallback: null };

        const deferred = (resolve, reject) => {
            if (mapType === MapType.Google) {
                MapsApiLoaderService.loadGoogleAPI(params);
            } else {
                MapsApiLoaderService.loadLeafletAPI(params);
            }

            // Temporaria para testar Leaflet
            if (mapType === MapType.Leaflet) {
                setTimeout(() => {
                    MapsApiLoaderService.mapsApi = MapsApiLoaderService.windowRef.L;
                    resolve(MapsApiLoaderService.mapsApi);
                }, 2000);
            } else {
                MapsApiLoaderService.windowRef.mapsAPILoadCallback = () => {
                    MapsApiLoaderService.mapsApi = MapsApiLoaderService.windowRef.google;
                    resolve(MapsApiLoaderService.mapsApi);
                };
            }

            setTimeout(() => {
                if (!MapsApiLoaderService.windowRef.api) {
                    reject(new Error('Loading took too long'));
                }
            }, 5000);
        };

        return new Promise(deferred);
    }
}

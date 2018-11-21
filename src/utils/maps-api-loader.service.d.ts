import { MapType } from '../models/dto/map-type';
export declare class MapsApiLoaderService {
    static loadGoogleAPI(params: any): void;
    static loadLeafletAPI(params: any): void;
    private static windowRef;
    private static mapsApi;
    constructor();
    loadApi(mapType: MapType, params: any): Promise<any>;
}

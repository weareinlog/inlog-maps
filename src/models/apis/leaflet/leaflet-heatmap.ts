import HeatMapOptions from "../../features/heatmap/heatmap-options";

export default class LeafletHeatMap {
    private map: any = {};
    private leaflet: any = {};

    constructor(map: any, leaflet: any) {
        this.map = map;
        this.leaflet = leaflet;
    }

    public drawHeatMap(options: HeatMapOptions): any {
        // Verificar se o plugin leaflet.heat está disponível
        if (!this.leaflet.heatLayer) {
            console.error('Leaflet.heat plugin is required. Please include leaflet-heat.js');
            return null;
        }

        // Converter dados para o formato esperado pelo leaflet.heat
        const heatData = this.convertDataFormat(options.data);

        // Configurar opções do heatmap
        const heatOptions: any = {};
        
        if (options.radius !== undefined) heatOptions.radius = options.radius;
        if (options.blur !== undefined) heatOptions.blur = options.blur;
        if (options.maxZoom !== undefined) heatOptions.maxZoom = options.maxZoom;
        if (options.maxIntensity !== undefined) heatOptions.max = options.maxIntensity;
        if (options.minOpacity !== undefined) heatOptions.minOpacity = options.minOpacity;
        if (options.gradient !== undefined) heatOptions.gradient = options.gradient;

        // Criar o layer de heatmap
        const heatmapLayer = this.leaflet.heatLayer(heatData, heatOptions);

        // Adicionar ao mapa se especificado
        if (options.addToMap) {
            heatmapLayer.addTo(this.map);
        }

        // Ajustar bounds se especificado
        if (options.fitBounds && heatData.length > 0) {
            const group = new this.leaflet.FeatureGroup();
            heatData.forEach((point: number[]) => {
                const marker = this.leaflet.marker([point[0], point[1]]);
                group.addLayer(marker);
            });
            this.map.fitBounds(group.getBounds());
        }

        // Adicionar propriedades customizadas
        if (options.object) {
            heatmapLayer.object = options.object;
        }

        return heatmapLayer;
    }

    public toggleHeatMap(heatmap: any, show: boolean): void {
        if (!heatmap) return;

        if (show) {
            if (!this.map.hasLayer(heatmap)) {
                this.map.addLayer(heatmap);
            }
        } else {
            if (this.map.hasLayer(heatmap)) {
                this.map.removeLayer(heatmap);
            }
        }
    }

    public updateHeatMapData(heatmap: any, data: number[][]): void {
        if (!heatmap || !heatmap.setLatLngs) return;

        const heatData = this.convertDataFormat(data);
        heatmap.setLatLngs(heatData);
    }

    public setHeatMapOptions(heatmap: any, options: Partial<HeatMapOptions>): void {
        if (!heatmap || !heatmap.setOptions) return;

        const heatOptions: any = {};
        
        if (options.radius !== undefined) heatOptions.radius = options.radius;
        if (options.blur !== undefined) heatOptions.blur = options.blur;
        if (options.maxZoom !== undefined) heatOptions.maxZoom = options.maxZoom;
        if (options.maxIntensity !== undefined) heatOptions.max = options.maxIntensity;
        if (options.minOpacity !== undefined) heatOptions.minOpacity = options.minOpacity;
        if (options.gradient !== undefined) heatOptions.gradient = options.gradient;

        heatmap.setOptions(heatOptions);
    }

    public isHeatMapOnMap(heatmap: any): boolean {
        if (!heatmap) return false;
        return this.map.hasLayer(heatmap);
    }

    private convertDataFormat(data: number[][]): number[][] {
        // Converter formato [lat, lng, intensity] para o formato esperado pelo leaflet.heat
        return data.map(point => {
            if (point.length >= 3) {
                return [point[0], point[1], point[2]]; // lat, lng, intensity
            } else if (point.length >= 2) {
                return [point[0], point[1]]; // lat, lng (intensity padrão = 1)
            }
            return point;
        });
    }
} 
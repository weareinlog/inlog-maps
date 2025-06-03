import HeatMapOptions from "../../features/heatmap/heatmap-options";

export default class GoogleHeatMap {
    private map: any = {};
    private google: any = {};

    constructor(map: any, google: any) {
        this.map = map;
        this.google = google;
    }

    public drawHeatMap(options: HeatMapOptions): any {
        // Verificar se a biblioteca de visualização está disponível
        if (!this.google.maps.visualization || !this.google.maps.visualization.HeatmapLayer) {
            console.error('Google Maps Visualization library is required. Please include libraries=visualization');
            return null;
        }

        // Converter dados para o formato esperado pelo Google Maps
        const heatData = this.convertDataFormat(options.data);

        // Configurar opções do heatmap
        const heatOptions: any = {
            data: heatData
        };

        if (options.radius !== undefined) heatOptions.radius = options.radius;
        if (options.maxIntensity !== undefined) heatOptions.maxIntensity = options.maxIntensity;
        if (options.opacity !== undefined) heatOptions.opacity = options.opacity;
        if (options.dissipating !== undefined) heatOptions.dissipating = options.dissipating;
        if (options.gradient !== undefined) {
            heatOptions.gradient = this.convertGradient(options.gradient);
        }

        // Criar o layer de heatmap
        const heatmapLayer = new this.google.maps.visualization.HeatmapLayer(heatOptions);

        // Adicionar ao mapa se especificado
        if (options.addToMap) {
            heatmapLayer.setMap(this.map);
        }

        // Ajustar bounds se especificado
        if (options.fitBounds && options.data.length > 0) {
            const bounds = new this.google.maps.LatLngBounds();
            options.data.forEach((point: number[]) => {
                bounds.extend(new this.google.maps.LatLng(point[0], point[1]));
            });
            this.map.fitBounds(bounds);
        }

        // Adicionar propriedades customizadas
        if (options.object) {
            (heatmapLayer as any).object = options.object;
        }

        return heatmapLayer;
    }

    public toggleHeatMap(heatmap: any, show: boolean): void {
        if (!heatmap) return;

        if (show) {
            heatmap.setMap(this.map);
        } else {
            heatmap.setMap(null);
        }
    }

    public updateHeatMapData(heatmap: any, data: number[][]): void {
        if (!heatmap || !heatmap.setData) return;

        const heatData = this.convertDataFormat(data);
        heatmap.setData(heatData);
    }

    public setHeatMapOptions(heatmap: any, options: Partial<HeatMapOptions>): void {
        if (!heatmap) return;

        if (options.radius !== undefined) {
            heatmap.set('radius', options.radius);
        }
        if (options.maxIntensity !== undefined) {
            heatmap.set('maxIntensity', options.maxIntensity);
        }
        if (options.opacity !== undefined) {
            heatmap.set('opacity', options.opacity);
        }
        if (options.dissipating !== undefined) {
            heatmap.set('dissipating', options.dissipating);
        }
        if (options.gradient !== undefined) {
            heatmap.set('gradient', this.convertGradient(options.gradient));
        }
        if (options.data !== undefined) {
            const heatData = this.convertDataFormat(options.data);
            heatmap.setData(heatData);
        }
    }

    public isHeatMapOnMap(heatmap: any): boolean {
        if (!heatmap) return false;
        return heatmap.getMap() !== null;
    }

    private convertDataFormat(data: number[][]): any[] {
        // Converter formato [lat, lng, intensity] para o formato esperado pelo Google Maps
        return data.map(point => {
            if (point.length >= 3) {
                // Com peso/intensidade
                return {
                    location: new this.google.maps.LatLng(point[0], point[1]),
                    weight: point[2]
                };
            } else if (point.length >= 2) {
                // Apenas coordenadas (peso padrão = 1)
                return new this.google.maps.LatLng(point[0], point[1]);
            }
            return null;
        }).filter(point => point !== null);
    }

    private convertGradient(gradient: string[] | { [key: number]: string }): string[] {
        if (Array.isArray(gradient)) {
            return gradient;
        } else if (typeof gradient === 'object') {
            // Converter objeto para array ordenado
            const keys = Object.keys(gradient).map(Number).sort((a, b) => a - b);
            return keys.map(key => gradient[key]);
        }
        return [];
    }
} 
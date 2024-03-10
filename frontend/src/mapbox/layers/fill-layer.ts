import { FillLayer as MapboxFillLayer, Map } from "mapbox-gl";
import { Layer } from "./layer";

export class FillLayer extends Layer {

    constructor(map: Map, id: string, sourceId: string, sourceLayerId?: string) {
        super(map, id);
        this.createLayer(id, sourceId, sourceLayerId);
    }

    private createLayer(id: string, sourceId: string, sourceLayerId?: string): void {
        const fillLayer: MapboxFillLayer = {
            id, 
            source: sourceId,
            type: "fill",
            paint: {
                "fill-color": "blue",
                "fill-opacity": 0.6
            }
        };

        if (sourceLayerId) {
            fillLayer["source-layer"] = sourceLayerId;
        }

        this.map.addLayer(fillLayer);
    }

}
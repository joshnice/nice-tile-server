import { Map, LineLayer } from "mapbox-gl";
import { Layer } from "./layer";

export class MapboxLineLayer extends Layer {

    constructor(map: Map, id: string, sourceId: string, sourceLayerId?: string) {
        super(map);
        this.createLayer(id, sourceId, sourceLayerId);
    }

    private createLayer(id: string, sourceId: string, sourceLayerId?: string) {
        const lineLayer: LineLayer = {
            id,
            type: "line",
            paint: {
                "line-color": "green",
                "line-width": 10
            },
            source: sourceId, 
        };

        if (sourceLayerId) {
            lineLayer["source-layer"] = sourceLayerId;
        }
        
        this.map.addLayer(lineLayer);
    }
}
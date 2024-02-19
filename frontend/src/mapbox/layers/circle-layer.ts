import { CircleLayer, Map } from "mapbox-gl";
import { Layer } from "./layer";

export class MapboxCircleLayer extends Layer {

    constructor(map: Map, id: string, sourceId: string, sourceLayerId?: string) {
        super(map);
        this.createLayer(id, sourceId, sourceLayerId);
    }

    private createLayer(id: string, sourceId: string, sourceLayerId?: string): void {
        const circleLayer: CircleLayer = {
            id, 
            source: sourceId,
            type: "circle",
            paint: {
                "circle-color": "red",
            }
        };

        if (sourceLayerId) {
            circleLayer["source-layer"] = sourceLayerId;
        }

        this.map.addLayer(circleLayer);
        
    }

}
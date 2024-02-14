import { Map } from "mapbox-gl";
import { Layer } from "./layer";

export class MapboxCircleLayer extends Layer {

    constructor(map: Map, id: string, sourceId: string) {
        super(map);
        this.createLayer(id, sourceId);
    }

    private createLayer(id: string, sourceId: string): void {
        this.map.addLayer({
            id, 
            source: sourceId,
            "source-layer": "layer_a",
            type: "circle",
            paint: {
                "circle-color": "red",
            }
        });
    }

}
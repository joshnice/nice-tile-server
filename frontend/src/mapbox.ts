import { Map } from "mapbox-gl";

export class Mapbox {

    private readonly map: Map;

    private readonly sourceId = "vector-tile-source";

    private layers: {[layerId: string]: MapboxLayer} = {}

    constructor(mapContainerElement: HTMLDivElement) {
        this.map = new Map({
            container: mapContainerElement,
            center: [-0.54588, 53.22821], 
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 15,
            testMode: true,
            accessToken: "pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJja2VtcnFwNGQwbXdnMndvODNzYm9wNzE3In0.hNLvS8f4FVGbgnwF7Xepow",
            hash: true,
        });

        this.map.showTileBoundaries = true; 

        this.map.once("load", () => {
            this.addSource();
            this.addLayers();
        });
    }

    public onDrawingClicked(type: "Point" | "Line" | "Area") {
        console.log("type", type);
    }

    private addLayers() {
        const circleLayer = new MapboxCircleLayer(this.map, "circle-layer", this.sourceId);
        this.layers["circle-layer"] = circleLayer;
    }

    private addSource() {
        this.map.addSource(this.sourceId, { type: "vector", tiles: ["http://localhost:3000/object/{z}/{x}/{y}"] });
    }

    public destory() {
        this.map.remove();
    }
}

abstract class MapboxLayer {

    public readonly map: Map;

    constructor(map: Map) {
        this.map = map;
    }
        
}

class MapboxCircleLayer extends MapboxLayer {

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
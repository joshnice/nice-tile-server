import { Map } from "mapbox-gl";
import { Api } from "./api";
import { createPointFeature } from "./geojson-helpers";

interface MapboxOptions {
    containerElement: HTMLDivElement;
    api: Api;
}

export class Mapbox {

    private readonly map: Map;

    private readonly sourceId = "vector-tile-source";

    private readonly api: Api;

    private layers: {[layerId: string]: MapboxLayer} = {}


    constructor(options: MapboxOptions) {
        this.map = new Map({
            container: options.containerElement,
            center: [-0.54588, 53.22821], 
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 15,
            testMode: true,
            accessToken: "pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJja2VtcnFwNGQwbXdnMndvODNzYm9wNzE3In0.hNLvS8f4FVGbgnwF7Xepow",
            hash: true,
        });

        this.api = options.api;

        this.map.once("load", () => {
            this.addSource();
            this.addLayers();
        });
    }

    public onDrawingClicked(type: "Point" | "Line" | "Area") {
        switch (type) {
            case "Point": 
                new PointDrawing(this.map, this.api);
                break;
            default: 
                throw new Error("not handled");
        }

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

abstract class Drawing {

    public readonly map: Map;

    public readonly api: Api;

    constructor(map: Map, api: Api) {
        this.map = map;
        this.api = api;
        this.addEventListeners();
    }

    public abstract addEventListeners(): void;

    public abstract onClick(): void;    
}

class PointDrawing extends Drawing {
    
    public addEventListeners(): void {
        this.onClick();
    }

    public onClick(): void {
        this.map.on("click", (event) => {
            const lngLat = event.lngLat.toArray();
            const pointObject = createPointFeature(lngLat);
            this.api.createObject(pointObject);
        });
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

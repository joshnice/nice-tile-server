import { Map } from "mapbox-gl";
import { Api } from "./api";
import { MapboxOptions } from "./mapbox-types";
import { Layer } from "./layers/layer";
import { PointDrawing } from "./drawing/point-drawing";
import { MapboxCircleLayer } from "./layers/circle-layer";

export class Mapbox {

    private readonly map: Map;

    private readonly sourceId = "vector-tile-source";

    private readonly api: Api;

    private layers: {[layerId: string]: Layer} = {}


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
                new PointDrawing(this.map, this.api, this.refreshSource.bind(this));
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

    private refreshSource() {
        const source = this.map.getSource(this.sourceId);
        console.log("refreshSource", source);
        if (source.type === "vector") {
            const key = Math.random();
            source.setTiles([`http://localhost:3000/object/{z}/{x}/{y}?bustCache=${key}`])
        } 
    }

    public destory() {
        this.map.remove();
    }
}








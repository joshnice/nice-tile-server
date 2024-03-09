import { Map } from "mapbox-gl";
import { Api } from "./api";
import { MapboxOptions } from "./mapbox-types";
import { Layer } from "./layers/layer";
import { PointDrawing } from "./drawing/point-drawing";
import { MapboxCircleLayer } from "./layers/circle-layer";
import { Drawing } from "./drawing/drawing";
import { VectorSource } from "./sources/vector-source";
import { MapboxLineLayer } from "./layers/line-layer";
import { LineDrawing } from "./drawing/line-drawing";

export class Mapbox {

    private readonly map: Map;

    private tileSource: VectorSource | null = null;

    private readonly api: Api;

    private layers: {[layerId: string]: Layer} = {}

    private drawing: Drawing | null = null;

    constructor(options: MapboxOptions) {
        this.map = new Map({
            container: options.containerElement,
            center: [-0.54588, 53.22821], 
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 15,
            accessToken: "pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJja2VtcnFwNGQwbXdnMndvODNzYm9wNzE3In0.hNLvS8f4FVGbgnwF7Xepow",
            hash: true,
        });

        this.api = options.api;

        this.map.doubleClickZoom.disable();

        this.map.once("load", () => {
            this.addSource();
            this.addLayers();
        });
    }

    public onDrawingClicked(type: "Point" | "Line" | "Area") {
        switch (type) {
            case "Point": 
                if (this.drawing?.type !== "Point") {
                    this.drawing = new PointDrawing(this.map, this.api, "Point");
                } else {
                    this.drawing.remove();
                    this.drawing = null; 
                }
                break;
            case "Line": 
                if (this.drawing?.type !== "Line") {
                    this.drawing = new LineDrawing(this.map, this.api, "Line");
                } else {
                    this.drawing.remove();
                    this.drawing = null;
                }
                break;
            default: 
                throw new Error("not handled");
        }

    }

    private addLayers() {

        if (this.tileSource == null) {
            throw new Error("Tile source has to be created before adding any layers");
        }

        const circleLayer = new MapboxCircleLayer(this.map, "circle-layer", this.tileSource.id, "Circle");
        const lineLayer = new MapboxLineLayer(this.map, "line-layer", this.tileSource.id, "Line");

        this.layers["circle-layer"] = circleLayer;
        this.layers["line-layer"] = lineLayer;
    }

    private addSource() {
        this.tileSource = new VectorSource(this.map, "vector-tile-source", "http://localhost:3000/object/{z}/{x}/{y}");
    }

    public destory() {
        this.map.remove();
    }
}








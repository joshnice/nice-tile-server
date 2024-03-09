import { Map } from "mapbox-gl";
import { Api } from "./api";
import { MapboxOptions } from "./mapbox-types";
import { MapboxLayer } from "./layers/layer";
import { PointDrawing } from "./drawing/point-drawing";
import { MapboxCircleLayer } from "./layers/circle-layer";
import { Drawing } from "./drawing/drawing";
import { VectorSource } from "./sources/vector-source";
import { MapboxLineLayer } from "./layers/line-layer";
import { LineDrawing } from "./drawing/line-drawing";
import { GeoJsonSource } from "./sources/geojson-source";

export class Mapbox {

    private readonly map: Map;

    private tileSource: VectorSource | null = null;

    private readonly api: Api;

    private layers: {[layerId: string]: MapboxLayer} = {}

    private localSources: {[sourceId: string]: GeoJsonSource} = {}

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
            this.addTileSource();
            this.addLayers();
            this.addLocalSources();
            this.addLocalLayers();
        });
    }

    public onDrawingClicked(type: "Point" | "Line" | "Area") {

        // Toggle the same drawing tool
        if (this.drawing?.type === type) {
            this.drawing.remove();
            this.drawing = null;
            return;
        }

        if (this.drawing != null) {
            this.drawing.remove();
        }

        switch (type) {
            case "Point": 
                this.drawing = new PointDrawing(this.map, this.api, "Point", this.localSources["local-point-layer-source"]);
                break;
            case "Line": 
                this.drawing = new LineDrawing(this.map, this.api, "Line", this.localSources["local-line-layer-source"]);
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

    private addTileSource() {
        this.tileSource = new VectorSource(this.map, "vector-tile-source", "http://localhost:3000/object/{z}/{x}/{y}");
    }

    private addLocalLayers() {
        this.layers["local-circle-layer"] = new MapboxCircleLayer(this.map, "local-circle-layer", "local-point-layer-source");
        this.layers["local-line-layer"] = new MapboxLineLayer(this.map, "local-line-layer", "local-line-layer-source");

    }

    private addLocalSources() {
        this.localSources["local-point-layer-source"] = new GeoJsonSource(this.map, "local-point-layer-source", null);
        this.localSources["local-line-layer-source"] = new GeoJsonSource(this.map, "local-line-layer-source", null);
    }

    public destory() {
        this.map.remove();
    }
}








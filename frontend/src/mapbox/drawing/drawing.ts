import { Map } from "mapbox-gl";
import { Api } from "../api";
import { GeoJsonSource } from "../sources/geojson-source";
import { MapboxLayer } from "../layers/layer";

export abstract class Drawing {

    public readonly map: Map;

    public readonly api: Api;

    public readonly type: "Point" | "Line" | "Area";

    public readonly localSource: GeoJsonSource;

    // Rename layer class
    public drawingLayer: MapboxLayer | null = null;

    public drawingSource: GeoJsonSource | null = null;

    public onClickReference: any;

    public onMouseMoveReference: any;

    constructor(map: Map, api: Api,  type: "Point" | "Line" | "Area", localSource: GeoJsonSource) {
        this.map = map;
        this.api = api;
        this.type = type;
        this.localSource = localSource;
        this.addEventListeners();
    }

    public abstract addEventListeners(): void;

    public abstract onClick(): void;

    public abstract onMouseMove(): void;

    public remove() {
        this.map.off("click", this.onClickReference);
        this.map.off("mousemove", this.onMouseMoveReference);
    }
}

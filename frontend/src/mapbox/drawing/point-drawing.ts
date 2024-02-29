import { MapMouseEvent, EventData, Map } from "mapbox-gl"
import { Drawing } from "./drawing";
import { createPointFeature } from "../../geojson-helpers";
import { Api } from "../api";
import { MapboxCircleLayer } from "../layers/circle-layer";
import { GeoJsonSource } from "../sources/geojson-source";

export class PointDrawing extends Drawing {

    public readonly localSource: GeoJsonSource;

    public readonly localLayer: MapboxCircleLayer;

    constructor(map: Map, api: Api,  type: "Point" | "Line" | "Area") {
        super(map, api,type);

        const layerId = "local-point-layer";
        const sourceId = `${layerId}-source`
        this.localSource = new GeoJsonSource(this.map, sourceId , null);
        this.localLayer = new MapboxCircleLayer(this.map, layerId, sourceId);
    }

    public addEventListeners(): void {
        this.onClick();
    }
    
    public onClick(): void {
        this.onClickReference = this.onClickHandler.bind(this);
        this.map.on("click", this.onClickReference);
    }

    private async onClickHandler(event: MapMouseEvent & EventData) {
        const pointObject = createPointFeature(event.lngLat.toArray());
        await this.api.createObject(pointObject);
        this.localSource.updateSource(pointObject);
    }
}
import { MapMouseEvent, EventData, Map } from "mapbox-gl";
import { LineString } from "geojson";
import { createLineFeature } from "../../geojson-helpers";
import { Api } from "../api";
import { GeoJsonSource } from "../sources/geojson-source";
import { Drawing } from "./drawing";
import { MapboxLineLayer } from "../layers/line-layer";

export class LineDrawing extends Drawing {

    public readonly localSource: GeoJsonSource;

    public readonly localLayer: MapboxLineLayer;

    private drawingSourceCoordiantes: LineString["coordinates"] = [];

    private readonly drawingSource: GeoJsonSource;

    private readonly drawingLayer: MapboxLineLayer;

    private clickedRecently = false;

    private isDoubleClick = false;

    constructor(map: Map, api: Api,  type: "Point" | "Line" | "Area") {
        super(map, api, type);

        const layerId = "local-line-layer";
        const sourceId = `${layerId}-source`

        this.localSource = new GeoJsonSource(this.map, sourceId, null);
        this.localLayer = new MapboxLineLayer(this.map, layerId, sourceId);

        this.drawingSource = new GeoJsonSource(this.map, "line-drawing", null);
        this.drawingLayer = new MapboxLineLayer(this.map, "line-drawing-layer", "line-drawing", undefined);
    }

    public addEventListeners(): void {
        this.onClick();
        this.onMouseMove();
    }
    
    public onClick(): void {
        this.onClickReference = this.onClickHandler.bind(this);
        this.map.on("click", this.onClickReference);
    }

    public onMouseMove(): void {
        this.onMouseMoveReference = this.onMouseMoveHandler.bind(this);
        this.map.on("mousemove", this.onMouseMoveReference);    }


    private async onClickHandler(event: MapMouseEvent & EventData) {
        if (this.clickedRecently) {
            this.isDoubleClick = true;
            this.onDoubleClick(event);
            await new Promise<void>((res) => setTimeout(() => res(),250));
            this.isDoubleClick = false;
            this.clickedRecently = false;
        } else {
            this.clickedRecently = true;

            await new Promise<void>((res) => setTimeout(() => res(),250));
    
            this.clickedRecently = false;
    
            if (!this.isDoubleClick) {
                this.onSingleClick(event);
            }
        }
    }

    private onSingleClick(event: MapMouseEvent & EventData) {
        this.drawingSourceCoordiantes = [...this.drawingSourceCoordiantes, event.lngLat.toArray()];
        if (this.drawingSourceCoordiantes.length > 1) {
            this.drawingSource.overwriteSource(createLineFeature(this.drawingSourceCoordiantes));
        }
    }

    private onDoubleClick(event: MapMouseEvent & EventData) {
        const newObject = createLineFeature([...this.drawingSourceCoordiantes, event.lngLat.toArray()]);
        this.localSource.updateSource(newObject);
        this.drawingSource.resetSource();
        this.drawingSourceCoordiantes = [];
        this.api.createObject(newObject)
    }

    private onMouseMoveHandler(event: MapMouseEvent & EventData) {
        if (this.drawingSourceCoordiantes.length !== 0) {
            this.drawingSource.overwriteSource(createLineFeature([...this.drawingSourceCoordiantes, event.lngLat.toArray()]));            
        }
    }
    
}
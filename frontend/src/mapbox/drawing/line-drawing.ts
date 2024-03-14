import type { MapMouseEvent, EventData, Map } from "mapbox-gl";
import type { LineString } from "geojson";
import type { Api } from "../api";
import { createLineFeature } from "../../helpers/geojson-helpers";
import { GeoJsonSource } from "../sources/geojson-source";
import { Drawing } from "./drawing";
import { LineLayer } from "../layers/line-layer";

export class LineDrawing extends Drawing {
	private drawingSourceCoordiantes: LineString["coordinates"] = [];

	private clickedRecently = false;

	private isDoubleClick = false;

	public drawingLayer: LineLayer;

	public drawingSource: GeoJsonSource;

	constructor(map: Map, api: Api, localSource: GeoJsonSource, layerId: string) {
		super(map, api, localSource, layerId);

		this.drawingSource = new GeoJsonSource(this.map, "line-drawing", null);
		this.drawingLayer = new LineLayer(
			this.map,
			"line-drawing-layer",
			"line-drawing",
			undefined,
		);
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
		this.map.on("mousemove", this.onMouseMoveReference);
	}

	private async onClickHandler(event: MapMouseEvent & EventData) {
		if (this.clickedRecently) {
			this.isDoubleClick = true;
			this.onDoubleClick(event);
			await new Promise<void>((res) => setTimeout(() => res(), 250));
			this.isDoubleClick = false;
			this.clickedRecently = false;
		} else {
			this.clickedRecently = true;

			await new Promise<void>((res) => setTimeout(() => res(), 250));

			this.clickedRecently = false;

			if (!this.isDoubleClick) {
				this.onSingleClick(event);
			}
		}
	}

	private onSingleClick(event: MapMouseEvent & EventData) {
		this.drawingSourceCoordiantes = [
			...this.drawingSourceCoordiantes,
			event.lngLat.toArray(),
		];
		if (this.drawingSourceCoordiantes.length > 1) {
			this.drawingSource.overwriteSource(
				createLineFeature(this.drawingSourceCoordiantes, this.layerId),
			);
		}
	}

	private onDoubleClick(event: MapMouseEvent & EventData) {
		const newObject = createLineFeature([
			...this.drawingSourceCoordiantes,
			event.lngLat.toArray(),
		], this.layerId);
		this.localSource.updateSource(newObject);
		this.drawingSource.resetSource();
		this.drawingSourceCoordiantes = [];
		this.api.createObject(newObject);
	}

	private onMouseMoveHandler(event: MapMouseEvent & EventData) {
		if (this.drawingSourceCoordiantes.length !== 0) {
			this.drawingSource.overwriteSource(
				createLineFeature([
					...this.drawingSourceCoordiantes,
					event.lngLat.toArray(),
				], this.layerId),
			);
		}
	}
}

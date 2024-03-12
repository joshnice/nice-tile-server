import type { Map } from "mapbox-gl";
import type { Api } from "../api";
import type { GeoJsonSource } from "../sources/geojson-source";
import type { Layer } from "../layers/layer";

export abstract class Drawing {
	public readonly map: Map;

	public readonly api: Api;

	public readonly localSource: GeoJsonSource;

	public readonly layerId: string;

	public drawingLayer: Layer | null = null;

	public drawingSource: GeoJsonSource | null = null;

	public onClickReference: any;

	public onMouseMoveReference: any;

	constructor(
		map: Map,
		api: Api,
		localSource: GeoJsonSource,
		layerId: string
	) {
		this.map = map;
		this.api = api;
		this.localSource = localSource;
		this.layerId = layerId;
		this.addEventListeners();
	}

	public abstract addEventListeners(): void;

	public abstract onClick(): void;

	public abstract onMouseMove(): void;

	public remove() {
		this.map.off("click", this.onClickReference);
		this.map.off("mousemove", this.onMouseMoveReference);
		this.drawingLayer?.remove();
		this.drawingSource?.remove();
	}
}

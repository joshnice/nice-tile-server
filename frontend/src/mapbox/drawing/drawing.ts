import type { Map } from "mapbox-gl";
import type { Feature, Polygon, LineString, Point } from "geojson";
import type { GeoJsonSource } from "../sources/geojson-source";
import type { Layer } from "../layers/layer";

export type SupportedGeometry = Polygon | LineString | Point;

export abstract class Drawing<TGeometry extends SupportedGeometry = SupportedGeometry> {
	
	public readonly map: Map;

	public readonly onCreate: (object: Feature<TGeometry>) => void;

	public readonly localSource: GeoJsonSource;

	public readonly baseLayer: Layer;

	public drawingLayer: Layer | null = null;

	public drawingSource: GeoJsonSource | null = null;

	// Todo: fix any type
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public onClickReference: any;

	// Todo: fix any type
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public onMouseMoveReference: any;

	constructor(
		map: Map,
		onCreate: (object: Feature<TGeometry>) => void,
		localSource: GeoJsonSource,
		layer: Layer
	) {
		this.map = map;
		this.onCreate = onCreate;
		this.localSource = localSource;
		this.baseLayer = layer;
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

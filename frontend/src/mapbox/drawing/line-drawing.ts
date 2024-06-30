import type { MapMouseEvent, EventData, Map } from "mapbox-gl";
import type { Feature, LineString } from "geojson";
import { createLineFeature } from "../../helpers/geojson-helpers";
import { GeoJsonSource } from "../sources/geojson-source";
import { Drawing } from "./drawing";
import { LineLayer } from "../layers/line-layer";

export class LineDrawing extends Drawing<LineString> {
	private drawingSourceCoordiantes: LineString["coordinates"] = [];

	public drawingLayer: LineLayer;

	public drawingSource: GeoJsonSource;

	constructor(map: Map, onCreate: (feature: Feature<LineString>) => void, localSource: GeoJsonSource, layer: LineLayer) {
		super(map, onCreate, localSource, layer);

		this.drawingSource = new GeoJsonSource(this.map, "line-drawing", null);

		const mapboxStyle = layer.getStyle();

		this.drawingLayer = new LineLayer(
			this.map,
			"line-drawing-layer",
			"line-drawing",
			() => true,
			{ colour: mapboxStyle.colour, opacity: mapboxStyle.opacity, size: mapboxStyle.size }
		);
	}

	public addEventListeners(): void {
		this.onClick();
		this.onDoubleClick();
		this.onMouseMove();
	}

	public onClick(): void {
		this.onClickReference = this.onSingleClickHandler.bind(this);
		this.map.on("click", this.onClickReference);
	}

	public onDoubleClick(): void {
		this.onDoubleClickReference = this.onDoubleClickHandler.bind(this);
		this.map.on("dblclick", this.onDoubleClickReference);
	}

	public onMouseMove(): void {
		this.onMouseMoveReference = this.onMouseMoveHandler.bind(this);
		this.map.on("mousemove", this.onMouseMoveReference);
	}

	private onSingleClickHandler(event: MapMouseEvent & EventData) {
		this.drawingSourceCoordiantes = [
			...this.drawingSourceCoordiantes,
			event.lngLat.toArray(),
		];
		if (this.drawingSourceCoordiantes.length > 1) {
			this.drawingSource.overwriteSource(
				createLineFeature(this.drawingSourceCoordiantes, this.baseLayer.id),
			);
		}
	}

	private onDoubleClickHandler() {
		// Remove last point as it is duplicated due to single click event
		this.drawingSourceCoordiantes.pop();
		const newObject = createLineFeature(this.drawingSourceCoordiantes, this.baseLayer.id);
		this.localSource.updateSource(newObject);
		this.drawingSource.resetSource();
		this.drawingSourceCoordiantes = [];
		this.onCreate(newObject);
	}

	private onMouseMoveHandler(event: MapMouseEvent & EventData) {
		if (this.drawingSourceCoordiantes.length !== 0) {
			this.drawingSource.overwriteSource(
				createLineFeature([
					...this.drawingSourceCoordiantes,
					event.lngLat.toArray(),
				], this.baseLayer.id),
			);
		}
	}
}

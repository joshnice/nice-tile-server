import type { MapMouseEvent, EventData, Map } from "mapbox-gl";
import type { LineString } from "geojson";
import type { Api } from "../api";
import type { FillLayer } from "../layers/fill-layer";
import { createLineFeature, createPolygonFeature } from "../../helpers/geojson-helpers";
import { GeoJsonSource } from "../sources/geojson-source";
import { Drawing } from "./drawing";
import { LineLayer } from "../layers/line-layer";

export class FillDrawing extends Drawing {
	private drawingSourceCoordiantes: LineString["coordinates"] = [];

	public drawingLayer: LineLayer;

	public drawingSource: GeoJsonSource;

	constructor(map: Map, api: Api, localSource: GeoJsonSource, layer: FillLayer) {
		super(map, api, localSource, layer);

		this.drawingSource = new GeoJsonSource(this.map, "fill-drawing", null);
		this.drawingLayer = new LineLayer(
			this.map,
			"fill-drawing-layer",
			"fill-drawing",
			undefined,
			{ colour: this.baseLayer.getStyle().colour, width: 5, opacity: 0.6 }
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
		this.drawingSourceCoordiantes = [
			...this.drawingSourceCoordiantes,
			event.lngLat.toArray(),
		];

		if (this.drawingSourceCoordiantes.length > 1) {
			// Check if the latest click is the same location as the first, if so stop drawing
			const firstCoordinateCanvasPos = this.map.project(
				this.drawingSourceCoordiantes[0] as [number, number],
			);
			const latestClickCanvasPos = this.map.project([
				event.lngLat.lng,
				event.lngLat.lat,
			]);
			const distance = Math.hypot(
				firstCoordinateCanvasPos.x - firstCoordinateCanvasPos.x,
				firstCoordinateCanvasPos.y - latestClickCanvasPos.y,
			);

			if (this.drawingSourceCoordiantes.length > 2 && distance < 10) {
				// Complete drawing
				this.drawingSource.resetSource();

				// Remove the last element of drawing array with the first element to make a polygon
				this.drawingSourceCoordiantes.splice(
					this.drawingSourceCoordiantes.length - 1,
				);
				const polygonCoordinates = [
					[...this.drawingSourceCoordiantes, this.drawingSourceCoordiantes[0]],
				];

				const newObject = createPolygonFeature(polygonCoordinates, this.baseLayer.id);
				this.localSource.updateSource(newObject);
				this.drawingSourceCoordiantes = [];
				this.api.createObject(newObject);
			} else {
				// Append node
				this.drawingSource.overwriteSource(
					createLineFeature(this.drawingSourceCoordiantes, this.baseLayer.id),
				);
			}
		}
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

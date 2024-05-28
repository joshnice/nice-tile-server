import type { MapMouseEvent, EventData, Map } from "mapbox-gl";
import type { Feature, LineString, Polygon } from "geojson";
import type { FillLayer } from "../layers/fill-layer";
import { createLineFeature, createPointFeature, createPolygonFeature } from "../../helpers/geojson-helpers";
import { GeoJsonSource } from "../sources/geojson-source";
import { Drawing } from "./drawing";
import { LineLayer } from "../layers/line-layer";
import { CircleLayer } from "../layers/circle-layer";

const COMPLETE_DRAWING_RADIUS = 50;

export class FillDrawing extends Drawing<Polygon> {
	private drawingSourceCoordiantes: LineString["coordinates"] = [];

	public drawingLayer: LineLayer;

	public drawingSource: GeoJsonSource;

	public firstPointSource: GeoJsonSource;

	public firstPointLayer: CircleLayer;

	constructor(map: Map, onCreate: (feature: Feature<Polygon>) => void, localSource: GeoJsonSource, layer: FillLayer) {
		super(map, onCreate, localSource, layer);

		this.drawingSource = new GeoJsonSource(this.map, "fill-drawing", null);
		this.drawingLayer = new LineLayer(
			this.map,
			"fill-drawing-layer",
			"fill-drawing",
			() => true,
			{ colour: layer.getStyle().colour, size: 5, opacity: 0.6 }
		);

		this.firstPointSource = new GeoJsonSource(this.map, "first-point", null);
		this.firstPointLayer = new CircleLayer(this.map, "first-point-layer", "first-point", () => true, { size: COMPLETE_DRAWING_RADIUS, colour: layer.getStyle().colour, opacity: 0.2, outlineWidth: 2 })
		this.firstPointLayer.setVisibility(false);
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

		if (this.drawingSourceCoordiantes.length === 3) {
			const pointObject = createPointFeature(this.drawingSourceCoordiantes[0], "first-point-layer");
			this.firstPointSource.updateSource(pointObject);
		}

		if (this.drawingSourceCoordiantes.length > 1) {

			const completeDrawing = this.isUserCursorWithinDistanceOfFirstCoordinate(event.lngLat.lng, event.lngLat.lat, COMPLETE_DRAWING_RADIUS);

			if (this.drawingSourceCoordiantes.length > 2 && completeDrawing) {
				// Complete drawing
				this.drawingSource.resetSource();
				this.firstPointSource.resetSource();
				this.firstPointLayer.setVisibility(false);

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
				this.onCreate(newObject);
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

		if (this.drawingSourceCoordiantes.length > 2) {
			const showCompleteCircle = this.isUserCursorWithinDistanceOfFirstCoordinate(event.lngLat.lng, event.lngLat.lat, COMPLETE_DRAWING_RADIUS * 2);
			this.firstPointLayer.setVisibility(showCompleteCircle);
		}
	}

	private isUserCursorWithinDistanceOfFirstCoordinate(lng: number, lat: number, distance: number) {
		// Check if the latest click is the same location as the first, if so stop drawing
		const firstCoordinateCanvasPos = this.map.project(
			this.drawingSourceCoordiantes[0] as [number, number],
		);
		const latestClickCanvasPos = this.map.project([
			lng,
			lat,
		]);
		const calculatedDistance = Math.hypot(
			firstCoordinateCanvasPos.x - latestClickCanvasPos.x,
			firstCoordinateCanvasPos.y - latestClickCanvasPos.y,
		);
		return calculatedDistance <= distance;
	}

	public remove(): void {
		super.remove();
		this.firstPointLayer.remove();
		this.firstPointSource.remove();
	}
}

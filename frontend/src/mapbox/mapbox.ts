import type { Api } from "./api";
import type { MapEvents, MapboxOptions } from "./mapbox-types";
import type { Layer } from "../types/layer";
import type { Feature, Polygon } from "geojson"
import type { Drawing, SupportedGeometry } from "./drawing/drawing";
import type { RandomObjectProperty } from "../types/properties";
import { Map } from "mapbox-gl";
import { PointDrawing } from "./drawing/point-drawing";
import { LineDrawing } from "./drawing/line-drawing";
import { FillDrawing } from "./drawing/fill-drawing";
import { Layers } from "./layers";
import { Sources } from "./sources";
import { FillLayer } from "./layers/fill-layer";
import { CircleLayer } from "./layers/circle-layer";
import { LineLayer } from "./layers/line-layer";
import { GeoJsonSource } from "./sources/geojson-source";
import { generateRandomObjects } from "../helpers/geojson-helpers";

export class Mapbox {
	private readonly map: Map;

	private readonly tileSourceId = "vector-tile-source";

	private readonly api: Api;

	public readonly layers: Layers;

	public readonly sources: Sources;

	private readonly events: MapEvents;

	private drawing: Drawing | null = null;

	constructor(options: MapboxOptions) {
		this.map = new Map({
			container: options.containerElement,
			center: [-0.54588, 53.22821],
			style: "mapbox://styles/mapbox/streets-v11",
			zoom: 15,
			accessToken:
				"pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJja2VtcnFwNGQwbXdnMndvODNzYm9wNzE3In0.hNLvS8f4FVGbgnwF7Xepow",
			hash: true,
		});

		this.api = options.api;
		this.events = options.events;

		this.sources = new Sources(this.map, this.api);
		this.layers = new Layers(this.map, this.tileSourceId, this.isDrawing.bind(this));

		this.map.doubleClickZoom.disable();

		this.map.once("load", () => {
			this.sources.addVectorSource(this.tileSourceId);
		});

		this.map.on("click", (event) => {
			// Only allow selection when not drawing
			if (this.drawing != null) return;

			const [feature] = this.map.queryRenderedFeatures(event.point);
			if (feature != null) {
				this.events.onObjectClicked.next(feature.properties?.id);
			} else {
				this.events.onObjectClicked.next(null)
			}
		});
	}

	public addLayer(layer: Layer) {
		// Then remove this
		if (this.map.loaded()) {
			this.sources.addGeoJsonSource(layer.id);
			this.layers.addLayer(layer);
		} else {
			this.map.once("load", () => {
				this.sources.addGeoJsonSource(layer.id);
				this.layers.addLayer(layer);
			});
		}
	}

	public onLayerSelected(layerId: string | null) {
		if (layerId == null || this.drawing?.baseLayer?.id === layerId) {
			this.drawing?.remove();
			this.drawing = null;
			return;
		}

		const layer = this.layers.getLayer(layerId);

		if (layer == null) {
			return;
		}

		if (this.drawing != null && this.drawing.baseLayer.id !== layerId) {
			this.drawing.remove();
		}

		switch (true) {
			case layer instanceof CircleLayer:
				this.drawing = new PointDrawing(
					this.map,
					(object) => this.api.createObject(object),
					this.sources.getSource(layer.id),
					layer
				) as Drawing;
				break;
			case layer instanceof LineLayer:
				this.drawing = new LineDrawing(
					this.map,
					(object) => this.api.createObject(object),
					this.sources.getSource(layer.id),
					layer
				) as Drawing<SupportedGeometry>;
				break;
			case layer instanceof FillLayer:
				this.drawing = new FillDrawing(
					this.map,
					(object) => this.api.createObject(object),
					this.sources.getSource(layer.id),
					layer
				) as Drawing;
				break;
			default:
				throw new Error("Layer type not handled");
		}

	}

	public onRandomObjectsSelected(layerId: string, amount: number, properties: RandomObjectProperty[]) {

		if (this.drawing != null) {
			this.drawing.remove();
			this.drawing = null;
		}

		const layer = this.layers.getLayer(layerId);
		// Create layer and source for drawing
		const drawingSource = new GeoJsonSource(this.map, "random-points", null);
		const drawingLayer = new FillLayer(this.map, "random-points", drawingSource.id, this.isDrawing.bind(this));

		const onDrawingFinish = (object: Feature<Polygon>) => {
			// Create random points
			const features = generateRandomObjects(layer, amount, object, properties);
			const source = this.sources.getSource(layerId);
			source.updateSourceWithArray(features);
			features.forEach((feature) => this.api.createObject(feature));
			
			// Remove all drawing layers and sources
			this.drawing?.remove();
			this.drawing = null;
			drawingLayer.remove();
			drawingSource.remove();
		}

		// Create drawing object
		this.drawing = new FillDrawing(this.map, onDrawingFinish, drawingSource, drawingLayer) as Drawing;
	}

	private isDrawing() {
		return this.drawing != null;
	}

	public destory() {
		this.map.remove();
	}
}

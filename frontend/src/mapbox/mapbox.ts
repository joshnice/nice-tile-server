import type { Api } from "./api";
import type { MapEvents, MapboxOptions } from "./mapbox-types";
import type { Layer } from "@nice-tile-server/types";
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
import { first, type Subject } from "rxjs";
import { waitUntilMapHasLoaded } from "./utils/map-loading";
import { FpsCounter } from "./utils/fps-counter";

export class Mapbox {
	private readonly map: Map;

	private readonly tileSourceId = "vector-tile-source";

	private readonly api: Api;

	public readonly layers: Layers;

	public readonly sources: Sources;

	private readonly events: MapEvents;

	private readonly offlineMode = false;

	private readonly fpsCounter: FpsCounter;

	private drawing: Drawing | null = null;

	constructor(options: MapboxOptions) {
		this.map = new Map({
			container: options.containerElement,
			center: [-0.54588, 53.22821],
			style: this.offlineMode ? { version: 8, layers: [], sources: {} } : "mapbox://styles/mapbox/streets-v11",
			zoom: 15,
			accessToken:
				"pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJja2VtcnFwNGQwbXdnMndvODNzYm9wNzE3In0.hNLvS8f4FVGbgnwF7Xepow",
			hash: true
		});

		this.api = options.api;
		this.events = options.events;

		this.sources = new Sources(this.map);
		this.layers = new Layers(this.map, this.tileSourceId, this.isDrawing.bind(this));

		this.map.doubleClickZoom.disable();
		this.addExternalEvents(options.events.onLayersLoaded);
		this.addMapboxEvents(options.mapType);

		this.fpsCounter = new FpsCounter();
		this.fpsCounter.start();
	}

	public addLayer(layer: Layer) {
		this.sources.addGeoJsonSource(layer.id);
		this.layers.addLayer(layer);
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
		const drawingLayer = new FillLayer(this.map, "random-points", drawingSource.id, this.isDrawing.bind(this), { colour: "red", opacity: 1 });

		const onDrawingFinish = async (object: Feature<Polygon>) => {
			// Create random points
			const maxAmount = 10000;
			let total = 0;
			const iterations = amount / maxAmount;

			const source = this.sources.getSource(layerId);

			for (let index = 1; index < iterations + 1; index++) {
				let amountToCreate = maxAmount;
				total += maxAmount;
				if (total > amount) {
					amountToCreate = total % amount;
				}
				const features = generateRandomObjects(layer, amountToCreate, object, properties);
				source.updateSourceWithArray(features);
				await this.api.createObjects(features);
			}

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

	private addExternalEvents(onLayersLoaded: Subject<Layer[]>) {
		const onLayersLoadedSub = onLayersLoaded.pipe(first()).subscribe((layers) => {
			waitUntilMapHasLoaded(this.map, () => {
				layers.forEach((layer) => {
					this.addLayer(layer);
				})
				onLayersLoadedSub.unsubscribe();
			})
		});
	}

	private addMapboxEvents(mapType: "map" | "tile") {
		this.map.once("load", () => {
			this.sources.addVectorSource(this.tileSourceId, this.api.createMapObjectTilesUrl(mapType));
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

	public destory() {
		this.map.remove();
		this.fpsCounter.stop();
	}
}

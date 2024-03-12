import { Map } from "mapbox-gl";
import type { Api } from "./api";
import type { MapboxOptions } from "./mapbox-types";
import type { Drawing } from "./drawing/drawing";
import { PointDrawing } from "./drawing/point-drawing";
import { LineDrawing } from "./drawing/line-drawing";
import { FillDrawing } from "./drawing/fill-drawing";
import { Layers } from "./layers";
import { Sources } from "./sources";
import { FillLayer } from "./layers/fill-layer";
import { CircleLayer } from "./layers/circle-layer";
import { LineLayer } from "./layers/line-layer";

export class Mapbox {
	private readonly map: Map;

	private readonly tileSourceId = "vector-tile-source";

	private readonly api: Api;

	public readonly layers: Layers;

	public readonly sources: Sources;

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

		this.sources = new Sources(this.map, this.api, this.tileSourceId);
		this.layers = new Layers(this.map, this.tileSourceId);

		this.map.doubleClickZoom.disable();

		this.map.once("load", () => {
			options.layers.forEach((layer) => {
				this.sources.addSource(layer.id);
				this.layers.addLayer(layer);
			})
		});
	}

	public onLayerSelected(layerId: string) {

		const layer = this.layers.getLayer(layerId);

		if (layer == null) {
			return;
		}

		if (this.drawing != null && this.drawing.layerId !== layerId) {
			this.drawing.remove();
		}

		switch (true) {
			case layer instanceof CircleLayer:
				this.drawing = new PointDrawing(
					this.map,
					this.api,
					this.sources.getSource(layer.id),
					layer.id
				);
				break;
			case layer instanceof LineLayer:
				this.drawing = new LineDrawing(
					this.map,
					this.api,
					this.sources.getSource(layer.id),
					layer.id
				);
				break;
			case layer instanceof FillLayer:
				this.drawing = new FillDrawing(
					this.map,
					this.api,
					this.sources.getSource(layer.id),
					layer.id
				);
				break;
			default:
				throw new Error("Layer type not handled");
		}

	}

	public destory() {
		this.map.remove();
	}
}

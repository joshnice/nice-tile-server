import type { MapMouseEvent, EventData, Map } from "mapbox-gl";
import type { Point, Feature } from "geojson";
import type { GeoJsonSource } from "../sources/geojson-source";
import type { CircleLayer } from "../layers/circle-layer";
import { Drawing } from "./drawing";
import { createPointFeature } from "../../helpers/geojson-helpers";

export class PointDrawing extends Drawing<Point> {

	constructor(map: Map, onCreate: (feature: Feature<Point>) => void, localSource: GeoJsonSource, layer: CircleLayer) {
		super(map, onCreate, localSource, layer);
	}

	public addEventListeners(): void {
		this.onClick();
	}

	public onClick(): void {
		this.onClickReference = this.onClickHandler.bind(this);
		this.map.on("click", this.onClickReference);
	}

	private async onClickHandler(event: MapMouseEvent & EventData) {
		const pointObject = createPointFeature(event.lngLat.toArray(), this.baseLayer.id);
		this.onCreate(pointObject);
		this.localSource.updateSource(pointObject);
	}

	public onMouseMove(): void {
		throw new Error("Method not implemented.");
	}
}

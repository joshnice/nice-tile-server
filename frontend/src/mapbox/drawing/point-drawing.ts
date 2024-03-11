import { MapMouseEvent, EventData, Map } from "mapbox-gl";
import { Drawing } from "./drawing";
import { createPointFeature } from "../../geojson-helpers";
import { Api } from "../api";
import { GeoJsonSource } from "../sources/geojson-source";

export class PointDrawing extends Drawing {
	constructor(
		map: Map,
		api: Api,
		type: "Point" | "Line" | "Area",
		localSource: GeoJsonSource,
	) {
		super(map, api, type, localSource);
	}

	public addEventListeners(): void {
		this.onClick();
	}

	public onClick(): void {
		this.onClickReference = this.onClickHandler.bind(this);
		this.map.on("click", this.onClickReference);
	}

	private async onClickHandler(event: MapMouseEvent & EventData) {
		const pointObject = createPointFeature(event.lngLat.toArray());
		await this.api.createObject(pointObject);
		this.localSource.updateSource(pointObject);
	}

	public onMouseMove(): void {
		throw new Error("Method not implemented.");
	}
}

import type { MapMouseEvent, EventData } from "mapbox-gl";
import type { Point } from "geojson";
import { Drawing } from "./drawing";
import { createPointFeature } from "../../helpers/geojson-helpers";

export class PointDrawing extends Drawing<Point> {
	public addEventListeners(): void {
		this.onClick();
	}

	public onClick(): void {
		this.onClickReference = this.onClickHandler.bind(this);
		this.map.on("click", this.onClickReference);
	}

	private async onClickHandler(event: MapMouseEvent & EventData) {
		const pointObject = createPointFeature(event.lngLat.toArray(), this.baseLayer.id);
		await this.onCreate(pointObject, this);
		this.localSource.updateSource(pointObject);
	}

	public onMouseMove(): void {
		throw new Error("Method not implemented.");
	}
}

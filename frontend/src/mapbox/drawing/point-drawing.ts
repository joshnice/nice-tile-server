import type { MapMouseEvent, EventData } from "mapbox-gl";
import { Drawing } from "./drawing";
import { createPointFeature } from "../../geojson-helpers";

export class PointDrawing extends Drawing {
	public addEventListeners(): void {
		this.onClick();
	}

	public onClick(): void {
		this.onClickReference = this.onClickHandler.bind(this);
		this.map.on("click", this.onClickReference);
	}

	private async onClickHandler(event: MapMouseEvent & EventData) {
		const pointObject = createPointFeature(event.lngLat.toArray(), this.layerId);
		await this.api.createObject(pointObject);
		this.localSource.updateSource(pointObject);
	}

	public onMouseMove(): void {
		throw new Error("Method not implemented.");
	}
}

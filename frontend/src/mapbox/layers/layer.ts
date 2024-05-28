import type { Map } from "mapbox-gl";

export abstract class Layer {
	public readonly map: Map;

	public readonly id: string;

	private readonly isDrawing: () => boolean;

	constructor(map: Map, id: string, isDrawing: () => boolean) {
		this.map = map;
		this.id = id;
		this.mouseMoveEventListeners();
		this.isDrawing = isDrawing;
	}

	public setVisibility(value: boolean) {
		this.map.setLayoutProperty(this.id, "visibility", value ? "visible" : "none")
	}

	private mouseMoveEventListeners() {
		this.map.on("mouseover", this.id, () => {
			if (!this.isDrawing()) {
				this.map.getCanvas().style.cursor = "pointer";
			}
		});

		this.map.on("mouseleave", this.id, (e) => {
			if (!this.isDrawing()) {
				const [feature] = this.map.queryRenderedFeatures(e.point);
				if (feature == null || feature?.properties?.id == null) {
					this.map.getCanvas().style.cursor = "";
				}
			}
		});
	}

	public remove() {
		this.map.removeLayer(this.id);
		// Todo: Remove the mouse events
	}
}

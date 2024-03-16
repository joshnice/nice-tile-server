import type { Map } from "mapbox-gl";
import type { BaseStyle } from "./styles";

export abstract class Layer<TStyle extends BaseStyle = BaseStyle> {
	public readonly map: Map;

	public readonly id: string;

	public readonly style: TStyle;

	private readonly isDrawing: () => boolean;

	constructor(map: Map, id: string, isDrawing: () => boolean, style: TStyle) {
		this.map = map;
		this.id = id;
		this.style = style;
		this.mouseMoveEventListeners();
		this.isDrawing = isDrawing;
	}

	public getStyle() {
		return this.style;
	}

	private mouseMoveEventListeners() {
		this.map.on("mouseover", this.id, () => {
			if (!this.isDrawing()) {
				this.map.getCanvas().style.cursor = "pointer";
			}
		});

		this.map.on("mouseleave", this.id, (e) => {
			if(!this.isDrawing()) {
				const [feature] = this.map.queryRenderedFeatures(e.point);
				if (feature == null || feature?.properties?.id == null) {
					this.map.getCanvas().style.cursor = "";
				}
			}
		});
	}

	public remove() {
		this.map.removeLayer(this.id);
		// Remove the mouse events
	}
}

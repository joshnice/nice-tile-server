import type { Map } from "mapbox-gl";
import type { BaseStyle } from "./styles";

export abstract class Layer<TStyle extends BaseStyle> {
	public readonly map: Map;

	public readonly id: string;

	public readonly style: TStyle;

	constructor(map: Map, id: string, style: TStyle) {
		this.map = map;
		this.id = id;
		this.style = style;
	}

	public getStyle() {
		return this.style;
	}

	public remove() {
		this.map.removeLayer(this.id);
	}
}

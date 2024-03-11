import { Map } from "mapbox-gl";

export abstract class Layer {
	public readonly map: Map;

	public readonly id: string;

	constructor(map: Map, id: string) {
		this.map = map;
		this.id = id;
	}

	public remove() {
		this.map.removeLayer(this.id);
	}
}

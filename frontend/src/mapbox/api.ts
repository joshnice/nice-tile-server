import type { Feature, Polygon, LineString, Point } from "geojson";

export class Api {
	private readonly mapId: string;

	private readonly baseUrl: string;

	constructor(mapId: string, baseUrl: string) {
		this.mapId = mapId;
		this.baseUrl = baseUrl;
	}

	public async createObject(object: Feature<Point | LineString | Polygon>) {
		return fetch(`${this.baseUrl}/object`, {
			method: "post",
			headers: this.getHeaders(),
			body: JSON.stringify({
				mapId: this.mapId,
				object,
			}),
		});
	}

	public async createObjects(objects: Feature<Point | LineString | Polygon>[]) {
		return fetch(`${this.baseUrl}/objects`, {
			method: "post",
			headers: this.getHeaders(),
			body: JSON.stringify({
				mapId: this.mapId,
				objects,
			}),
		});
	}

	public createMapObjectTilesUrl(type: string) {
		switch (type) {
			case "map":
				return `http://localhost:3000/object/${this.mapId}/{z}/{x}/{y}`;
			case "tile":
				return `http://localhost:3000/map-tiles/${this.mapId}/{z}/{x}/{y}`
			default:
				throw new Error(`Type: ${type} is not handled`);
		}
	}

	public createMapTilesUrl() {
		return "http://localhost:3000/map-tiles/{z}/{x}/{y}.pbf";
	}

	private getHeaders() {
		return {
			"Content-Type": "application/json",
		};
	}
}

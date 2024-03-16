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

	public createTilesUrl() {
		return `http://localhost:3000/object/${this.mapId}/{z}/{x}/{y}`;
	}

	private getHeaders() {
		return {
			"Content-Type": "application/json",
		};
	}
}

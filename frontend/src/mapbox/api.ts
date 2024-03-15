import type { Feature, Polygon, LineString, Point, FeatureCollection } from "geojson";
import { v4 as uuid } from "uuid";
import { randomPoint } from "@turf/random";
import bbox from "@turf/bbox";

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

	public createRandomPoints(area: Feature<Polygon>, amount: number, layerId: string) {
		const bounds = bbox(area);
		const points = randomPoint(amount, { bbox: bounds }) as FeatureCollection<Point>;
		const features = points.features.map((feature) => ({...feature, properties: { layerId, id: uuid() }}));
		features.forEach((feature) => {
			this.createObject(feature);
		})
		return features; 
	}

	private getHeaders() {
		return {
			"Content-Type": "application/json",
		};
	}
}

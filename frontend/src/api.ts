import { Feature, Polygon, LineString, Point } from "geojson"; 

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

    private getHeaders() {
        return {
            "Content-Type": "application/json",
        }
    }    
}
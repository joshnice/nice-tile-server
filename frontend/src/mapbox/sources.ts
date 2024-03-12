import type { Map } from "mapbox-gl";
import type { Api } from "./api";
import { VectorSource } from "./sources/vector-source";
import { GeoJsonSource } from "./sources/geojson-source";

export class Sources {

    private readonly map: Map;

    private readonly api: Api;

    private tileSourceId: string;
   
    private tileSources: { [sourceId: string]: VectorSource } = {};

    private geoJsonSource: { [sourceId: string]: GeoJsonSource } = {};

    constructor(map: Map, api: Api, tileSourceId: string) {
        this.map = map;
        this.api = api;
        this.tileSourceId = tileSourceId;
        this.tileSources[this.tileSourceId] = new VectorSource(
			this.map,
			this.tileSourceId,
			this.api.createTilesUrl(),
		);
    }

    public addSource(id: string) {
        this.geoJsonSource[id] = new GeoJsonSource(
			this.map,
			id,
			null,
		);
    }

    public getSource(id: string) {
        return this.geoJsonSource[id];
    }
}
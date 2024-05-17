import type { Map } from "mapbox-gl";
import type { Api } from "./api";
import { VectorSource } from "./sources/vector-source";
import { GeoJsonSource } from "./sources/geojson-source";

export class Sources {

    private readonly map: Map;

    private readonly api: Api;


    private tileSources: { [sourceId: string]: VectorSource } = {};

    private geoJsonSource: { [sourceId: string]: GeoJsonSource } = {};

    constructor(map: Map, api: Api) {
        this.map = map;
        this.api = api;
    }

    public addVectorSource(id: string) {
        this.tileSources[id] = new VectorSource(
            this.map,
            id,
            this.api.createMapObjectTilesUrl(),
        );
    }

    public addGeoJsonSource(id: string) {
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
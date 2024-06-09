import type { Map } from "mapbox-gl";
import { VectorSource } from "./sources/vector-source";
import { GeoJsonSource } from "./sources/geojson-source";

export class Sources {

    private readonly map: Map;



    private tileSources: { [sourceId: string]: VectorSource } = {};

    private geoJsonSource: { [sourceId: string]: GeoJsonSource } = {};

    constructor(map: Map) {
        this.map = map;
    }

    public addVectorSource(id: string, url: string) {
        this.tileSources[id] = new VectorSource(
            this.map,
            id,
            url,
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
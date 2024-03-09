import { Map } from "mapbox-gl";

export abstract class MapboxLayer {

    public readonly map: Map;

    constructor(map: Map) {
        this.map = map;
    }
        
}
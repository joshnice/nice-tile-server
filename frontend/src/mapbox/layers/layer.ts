import { Map } from "mapbox-gl";

export abstract class Layer {

    public readonly map: Map;

    constructor(map: Map) {
        this.map = map;
    }
        
}
import { Map } from "mapbox-gl";
import { Api } from "../api";

export abstract class Drawing {

    public readonly map: Map;

    public readonly api: Api;

    public readonly refreshTiles: () => void;

    constructor(map: Map, api: Api, refreshTiles: () => void) {
        this.map = map;
        this.api = api;
        this.refreshTiles = refreshTiles;

        this.addEventListeners();
    }

    public abstract addEventListeners(): void;

    public abstract onClick(): void;    
}

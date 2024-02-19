import { Map } from "mapbox-gl";
import { Api } from "../api";

export abstract class Drawing {

    public readonly map: Map;

    public readonly api: Api;

    public readonly refreshTiles: () => void;

    public readonly type: "Point" | "Line" | "Area";

    public onClickReference: any;

    constructor(map: Map, api: Api,  type: "Point" | "Line" | "Area", refreshTiles: () => void) {
        this.map = map;
        this.api = api;
        this.type = type;
        this.refreshTiles = refreshTiles;
        this.addEventListeners();
    }

    public abstract addEventListeners(): void;

    public abstract onClick(): void;

    public remove() {
        this.map.off("click", this.onClickReference);
    }
}

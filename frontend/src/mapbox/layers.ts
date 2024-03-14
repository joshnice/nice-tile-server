import type { Map } from "mapbox-gl";
import type { Layer as CreateLayer } from "./../types/layer";
import type { Layer } from "./layers/layer";
import { FillLayer } from "./layers/fill-layer";
import { LineLayer } from "./layers/line-layer";
import { CircleLayer } from "./layers/circle-layer";
import { createRandomColour } from "../helpers/style-helpers";

const createLocalId = (id: string) => `${id}-local`;

export class Layers {

    private readonly map: Map;

    private readonly tileSourceId: string; 

    public selectedLayerId: string | null = null;

    private layers: { [layerId: string]: Layer } = {};

    constructor(map: Map, tileSourceId: string) {
        this.map = map;
        this.tileSourceId = tileSourceId;
    }

    public addLayer(layer: CreateLayer) {
        const colour = createRandomColour();
        switch (layer.type) {
            case "Fill":
                this.layers[layer.id] = new FillLayer(this.map, layer.id, this.tileSourceId, layer.id, { colour });
                this.layers[createLocalId(layer.id)] = new FillLayer(this.map, createLocalId(layer.id), layer.id, undefined, { colour });
                break;
            case "Line":
                this.layers[layer.id] = new LineLayer(this.map, layer.id, this.tileSourceId, layer.id, { colour });
                this.layers[createLocalId(layer.id)] = new LineLayer(this.map, createLocalId(layer.id), layer.id, undefined, { colour });
                break;
            case "Point":
                this.layers[layer.id] = new CircleLayer(this.map, layer.id, this.tileSourceId, layer.id, { colour });
                this.layers[createLocalId(layer.id)] = new CircleLayer(this.map, createLocalId(layer.id), layer.id, undefined, { colour });
                break;
            default: 
                throw new Error(`Layer type ${layer.type} not handled`);
        }
    }

    public getLayer(layerId: string) {
        return this.layers[layerId];
    }

}
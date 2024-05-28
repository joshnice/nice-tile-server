import type { Map } from "mapbox-gl";
import type { Layer } from "@nice-tile-server/types";
import type { Layer as MapboxLayer } from "./layers/layer";
import { FillLayer } from "./layers/fill-layer";
import { LineLayer } from "./layers/line-layer";
import { CircleLayer } from "./layers/circle-layer";

const createLocalId = (id: string) => `${id}-local`;

export class Layers {

    private readonly map: Map;

    private readonly tileSourceId: string;

    public selectedLayerId: string | null = null;

    private layers: { [layerId: string]: MapboxLayer } = {};

    private readonly isDrawing: () => boolean;

    constructor(map: Map, tileSourceId: string, isDrawing: () => boolean) {
        this.map = map;
        this.tileSourceId = tileSourceId;
        this.isDrawing = isDrawing;
    }

    public addLayer(layer: Layer) {
        switch (layer.type) {
            case "Fill":
                this.layers[layer.id] = new FillLayer(this.map, layer.id, this.tileSourceId, this.isDrawing, layer.style, layer.id);
                this.layers[createLocalId(layer.id)] = new FillLayer(this.map, createLocalId(layer.id), layer.id, this.isDrawing, layer.style);
                break;
            case "Line":
                this.layers[layer.id] = new LineLayer(this.map, layer.id, this.tileSourceId, this.isDrawing, layer.style, layer.id);
                this.layers[createLocalId(layer.id)] = new LineLayer(this.map, createLocalId(layer.id), layer.id, this.isDrawing, layer.style);
                break;
            case "Point":
                this.layers[layer.id] = new CircleLayer(this.map, layer.id, this.tileSourceId, this.isDrawing, layer.style, layer.id);
                this.layers[createLocalId(layer.id)] = new CircleLayer(this.map, createLocalId(layer.id), layer.id, this.isDrawing, layer.style);
                break;
            default:
                // @ts-expect-error
                throw new Error(`Layer type ${layer.type} not handled`);
        }
    }

    public getLayer(layerId: string) {
        return this.layers[layerId];
    }

}
import type { AllStyles } from "./layer-styles";

export interface Layer {
    id: string;
    name: string;
    style: AllStyles;
    type: LayerType;
    mapId: string;
}

export type LayerType = "Fill" | "Line" | "Point";

export type CreateLayer = Omit<Layer, "mapId" | "id">;
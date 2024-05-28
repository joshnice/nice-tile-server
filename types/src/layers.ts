import type { AllStyles, FillStyle, LineStyle, PointStyle } from "./layer-styles";

interface BaseLayer {
    id: string;
    name: string;
    type: LayerType;
    mapId: string;
    style: AllStyles;
}

export interface FillLayer extends BaseLayer {
    type: "Fill",
    style: FillStyle;
}

export interface LineLayer extends BaseLayer {
    type: "Line",
    style: LineStyle;
}

export interface CircleLayer extends BaseLayer {
    type: "Point",
    style: PointStyle;
}

export type Layer = FillLayer | LineLayer | CircleLayer;

export type LayerType = "Fill" | "Line" | "Point";

export type CreateLayer = Omit<Layer, "mapId" | "id">;
import type { AllStyles } from "./layer-styles";

export interface Layer {
    id: string;
    name: string;
    style: AllStyles;
    type: "Fill" | "Line" | "Point";
    mapId: string;
}
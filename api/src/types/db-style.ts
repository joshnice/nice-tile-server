import type { AllStyles } from "@nice-tile-server/types";

export interface DbStyle extends AllStyles {
    id: string;
    layer_id: string;
}
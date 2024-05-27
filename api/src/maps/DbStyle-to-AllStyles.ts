import type { AllStyles } from "@nice-tile-server/types";
import type { DbStyle } from "../types/db-style";

export function DbStyleToAllStyle(dbStyle: DbStyle): AllStyles {
    return {
        colour: dbStyle.colour,
        opacity: dbStyle.opacity,
        size: dbStyle.size
    }
}
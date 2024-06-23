import type { BehaviorSubject } from "rxjs";
import type { MapTile, Map, Layer } from "@nice-tile-server/types";
import { createContext, useContext } from "react";

export interface GlobalState {
    $selectedMap: BehaviorSubject<Map | MapTile | null> | null;
    $selectedLayer: BehaviorSubject<Layer | null> | null;
}

export const GlobalContext = createContext<GlobalState>({ $selectedMap: null, $selectedLayer: null })

export function useGlobalState() {
    return useContext(GlobalContext);
}
import type { BehaviorSubject } from "rxjs";
import type { MapTile, Map } from "@nice-tile-server/types";
import { createContext, useContext } from "react";

export interface GlobalState {
    $selectedMap: BehaviorSubject<Map | MapTile | null> | null;
}

export const GlobalContext = createContext<GlobalState>({ $selectedMap: null })

export function useGlobalState() {
    return useContext(GlobalContext);
}
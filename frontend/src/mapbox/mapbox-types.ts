import type { Subject } from "rxjs";
import type { Api } from "./api";
import type { Layer } from "@nice-tile-server/types";

export interface MapboxOptions {
	containerElement: HTMLDivElement;
	api: Api;
	events: MapEvents;
	mapType: "map" | "tile";
}

export interface MapEvents {
	onObjectClicked: Subject<string | null>;
	onLayersLoaded: Subject<Layer[]>;
}
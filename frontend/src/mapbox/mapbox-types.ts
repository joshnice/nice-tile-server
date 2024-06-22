import type { BehaviorSubject, Subject } from "rxjs";
import type { Api } from "./api";

export interface MapboxOptions {
	containerElement: HTMLDivElement;
	api: Api;
	events: MapEvents;
	mapType: string;
}

export interface MapEvents {
	onObjectClicked: Subject<string | null>;
	onMapLoaded: BehaviorSubject<boolean>;
}
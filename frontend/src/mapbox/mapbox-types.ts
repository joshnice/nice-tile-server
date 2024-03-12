import type { Layer } from "../types/layer";
import type { Api } from "./api";

export interface MapboxOptions {
	containerElement: HTMLDivElement;
	layers: Layer[];
	api: Api;
}

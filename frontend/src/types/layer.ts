export interface Layer {
	id: string;
	name: string;
	type: LayerType;
	mapId: string;
}

export type LayerType = "Fill" | "Line" | "Point";

export type CreateLayer = Omit<Layer, "mapId" | "id">;

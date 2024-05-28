import type { FillLayer as MapboxFillLayer, Map } from "mapbox-gl";
import type { FillStyle } from "@nice-tile-server/types";
import { Layer } from "./layer";

export class FillLayer extends Layer<FillStyle> {
	constructor(map: Map, id: string, sourceId: string, isDrawing: () => boolean, style: FillStyle, sourceLayerId?: string) {
		super(map, id, isDrawing, style);
		this.createLayer(id, sourceId, style, sourceLayerId);
	}

	private createLayer(
		id: string,
		sourceId: string,
		style: FillStyle,
		sourceLayerId?: string,
	): void {
		const fillLayer: MapboxFillLayer = {
			id,
			source: sourceId,
			type: "fill",
			paint: {
				"fill-color": style.colour,
				"fill-opacity": style.opacity,
			},
		};

		if (sourceLayerId) {
			fillLayer["source-layer"] = sourceLayerId;
		}

		this.map.addLayer(fillLayer);
	}
}

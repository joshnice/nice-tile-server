import type { CircleLayer as MapboxCircleLayer, Map } from "mapbox-gl";
import type { PointStyle } from "@nice-tile-server/types";
import { Layer } from "./layer";

export class CircleLayer extends Layer<PointStyle> {
	constructor(map: Map, id: string, sourceId: string, isDrawing: () => boolean, style: PointStyle, sourceLayerId?: string) {
		super(map, id, isDrawing, style);
		this.createLayer(id, sourceId, style, sourceLayerId);
	}

	private createLayer(
		id: string,
		sourceId: string,
		style: PointStyle,
		sourceLayerId?: string,
	): void {
		const circleLayer: MapboxCircleLayer = {
			id,
			source: sourceId,
			type: "circle",
			paint: {
				"circle-color": style.colour,
				"circle-radius": style.size,
				"circle-opacity": style.opacity,
				"circle-stroke-width": style.outlineWidth ?? 0,
				"circle-stroke-color": style.colour
			},
		};

		if (sourceLayerId) {
			circleLayer["source-layer"] = sourceLayerId;
		}

		this.map.addLayer(circleLayer);
	}
}

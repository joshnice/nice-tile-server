import type { CircleLayer as MapboxCircleLayer, Map } from "mapbox-gl";
import type { PointStyle } from "@nice-tile-server/types";
import { Layer } from "./layer";

export class CircleLayer extends Layer {

	private readonly style: PointStyle;

	constructor(map: Map, id: string, sourceId: string, isDrawing: () => boolean, style: PointStyle, sourceLayerId?: string) {
		super(map, id, isDrawing);
		this.style = style;
		this.createLayer(id, sourceId, style, sourceLayerId);
	}

	public getStyle(): PointStyle {
		return this.style;
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

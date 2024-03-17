import type { CircleLayer as MapboxCircleLayer, Map } from "mapbox-gl";
import type { CircleStyle } from "./styles";
import { Layer } from "./layer";

const defaultStyle: CircleStyle = {
	colour: "#b3685b",
	opacity: 0.9,
	radius: 10,
	outlineWidth: 0
}

export class CircleLayer extends Layer<CircleStyle> {
	constructor(map: Map, id: string, sourceId: string, isDrawing: () => boolean, sourceLayerId?: string, styleOverrides?: Partial<CircleStyle>) {
		const style = {...defaultStyle, ...styleOverrides};
		super(map, id, isDrawing, style);
		this.createLayer(id, sourceId, style, sourceLayerId);
	}

	private createLayer(
		id: string,
		sourceId: string,
		style: CircleStyle,
		sourceLayerId?: string,
	): void {
		const circleLayer: MapboxCircleLayer = {
			id,
			source: sourceId,
			type: "circle",
			paint: {
				"circle-color": style.colour,
				"circle-radius": style.radius,
				"circle-opacity": style.opacity,
				"circle-stroke-width": style.outlineWidth,
				"circle-stroke-color": style.colour
			},
		};

		if (sourceLayerId) {
			circleLayer["source-layer"] = sourceLayerId;
		}

		this.map.addLayer(circleLayer);
	}
}

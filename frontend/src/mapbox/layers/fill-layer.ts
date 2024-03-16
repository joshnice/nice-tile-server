import type { FillLayer as MapboxFillLayer, Map } from "mapbox-gl";
import type { FillStyle } from "./styles";
import { Layer } from "./layer";


const defaultStyle: FillStyle = {
	colour: "#6b71e3",
	opacity: 0.6
}

export class FillLayer extends Layer<FillStyle> {
	constructor(map: Map, id: string, sourceId: string, isDrawing: () => boolean, sourceLayerId?: string, styleOverrides?: Partial<FillStyle>) {
		// Create a complete style
		const style = {...defaultStyle, ...styleOverrides};
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

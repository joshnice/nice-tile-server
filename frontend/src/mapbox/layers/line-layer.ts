import type { Map, LineLayer as MapboxLineLayer } from "mapbox-gl";
import type { LineStyle } from "./styles";
import { Layer } from "./layer";

const defaultStyle: LineStyle = {
	colour: "#0ba17e",
	opacity: 0.7,
	width: 10
}

export class LineLayer extends Layer<LineStyle> {
	constructor(map: Map, id: string, sourceId: string, sourceLayerId?: string, styleOverrides?: Partial<LineStyle>) {
		// Create a complete style
		const style = {...defaultStyle, ...styleOverrides}
		super(map, id, style);

		this.createLayer(id, sourceId, style, sourceLayerId);
	}

	private createLayer(id: string, sourceId: string, style: LineStyle, sourceLayerId?: string) {
		const lineLayer: MapboxLineLayer = {
			id,
			type: "line",
			paint: {
				"line-color": style.colour,
				"line-width": style.width,
				"line-opacity": style.opacity
			},
			source: sourceId,
		};

		if (sourceLayerId) {
			lineLayer["source-layer"] = sourceLayerId;
		}

		this.map.addLayer(lineLayer);
	}
}

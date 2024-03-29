import type { Map, LineLayer as MapboxLineLayer } from "mapbox-gl";
import type { LineStyle } from "./styles";
import { Layer } from "./layer";

const defaultStyle: LineStyle = {
	colour: "#0ba17e",
	opacity: 0.7,
	width: 10,
	cap: "round",
	join: "round"
}

export class LineLayer extends Layer<LineStyle> {
	constructor(map: Map, id: string, sourceId: string, isDrawing: () => boolean, sourceLayerId?: string, styleOverrides?: Partial<LineStyle>) {
		// Create a complete style
		const style = {...defaultStyle, ...styleOverrides}
		super(map, id, isDrawing, style);

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
			layout: {
				"line-join": style.join,
				"line-cap": style.cap
			},
			source: sourceId,
		};

		if (sourceLayerId) {
			lineLayer["source-layer"] = sourceLayerId;
		}

		this.map.addLayer(lineLayer);
	}
}

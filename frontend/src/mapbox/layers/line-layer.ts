import type { Map, LineLayer as MapboxLineLayer } from "mapbox-gl";
import type { LineStyle } from "@nice-tile-server/types";
import { Layer } from "./layer";


export class LineLayer extends Layer {

	private readonly style: LineStyle

	constructor(map: Map, id: string, sourceId: string, isDrawing: () => boolean, style: LineStyle, sourceLayerId?: string) {
		super(map, id, isDrawing);
		this.style = style;
		this.createLayer(id, sourceId, style, sourceLayerId);
	}

	public getStyle(): LineStyle {
		return this.style;
	}

	private createLayer(id: string, sourceId: string, style: LineStyle, sourceLayerId?: string) {
		const lineLayer: MapboxLineLayer = {
			id,
			type: "line",
			paint: {
				"line-color": style.colour,
				"line-width": style.size,
				"line-opacity": style.opacity
			},
			layout: {
				"line-join": style.join ?? "round",
				"line-cap": style.cap ?? "round"
			},
			source: sourceId,
		};

		if (sourceLayerId) {
			lineLayer["source-layer"] = sourceLayerId;
		}

		this.map.addLayer(lineLayer);
	}
}

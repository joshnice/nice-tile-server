import type {
	VectorSource as MapboxVectorSource,
	VectorSourceImpl as MapboxVecotorSourceImpl,
} from "mapbox-gl";
import { Source } from "./source";

export class VectorSource extends Source<
	MapboxVectorSource,
	MapboxVecotorSourceImpl,
	string
> {

	public createSource(tilesUrl: string): MapboxVectorSource {
		return {
			type: "vector",
			tiles: [tilesUrl],
		};
	}

	public updateSource(): void {
		const source = this.getSource();
		const key = Math.random();
		const tileUrl = source.tiles?.[0] ?? "";
		const tilesUrl = tileUrl.split("?")[0];
		source.setTiles([`${tilesUrl}?bustCache=${key}`]);
	}

	public updateSourceWithArray(): void {
		throw new Error("Method not implemented.");
	}
}

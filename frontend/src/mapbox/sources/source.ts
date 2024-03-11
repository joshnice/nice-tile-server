import { Map, AnySourceData, AnySourceImpl } from "mapbox-gl";

export abstract class Source<
	TMapboxCreateSource extends AnySourceData,
	TMapboxGetSource extends AnySourceImpl,
	TCreateSource = null,
	TUpdateSource = null,
> {
	public readonly map: Map;

	public readonly id: string;

	constructor(map: Map, id: string, options: TCreateSource) {
		this.map = map;
		this.id = id;
		const source = this.createSource(options);
		this.map.addSource(id, source);
	}

	public getSource(): TMapboxGetSource {
		return this.map.getSource(this.id) as TMapboxGetSource;
	}

	public abstract createSource(options: TCreateSource): TMapboxCreateSource;

	public abstract updateSource(options: TUpdateSource): void;

	public remove() {
		this.map.removeSource(this.id);
	}
}

import type { Layer, CreateLayer } from "../types/layer";
import LayerListComponent from "./layer-list";
import MapListComponent from "./map-list";

export type Control = "Point" | "Line" | "Area";

export default function MapControlsComponent({
	selectedLayer,
	maps,
	selectedMap,
	mapLayers = [],
	onMapSelected,
	onLayerCreated,
	onMapCreatedClick,
	onLayerSelected,
}: {
	selectedLayer: string | null;
	maps: { id: string; name: string }[];
	selectedMap: string;
	mapLayers?: Layer[] | null;
	onMapSelected: (id: string) => void;
	onMapCreatedClick: () => void;
	onLayerCreated: (layer: CreateLayer) => void;
	onLayerSelected: (id: string) => void;
}) {
	return (
		<>
			<div className="map-controls-container map-controls-container-left">
				<LayerListComponent
					layers={mapLayers}
					selectedLayerId={selectedLayer}
					onCreateLayer={onLayerCreated}
					onLayerSelected={onLayerSelected}
				/>
			</div>
			<div className="map-controls-container map-controls-container-right">
				<MapListComponent
					maps={maps}
					selectedMap={selectedMap}
					onMapSelected={onMapSelected}
					onMapCreatedClick={onMapCreatedClick}
				/>
			</div>
		</>
	);
}

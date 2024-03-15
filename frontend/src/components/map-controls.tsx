import type { Layer, CreateLayer } from "../types/layer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import LayerListComponent from "./layer-list";
import ControlComponent from "./map-control-button";
import MapListComponent from "./map-list";

export type Control = "Point" | "Line" | "Area";

export default function MapControlsComponent({
	selectedLayer,
	maps,
	selectedMap,
	mapLayers = [],
	randomPointsSelected,
	onMapSelected,
	onLayerCreated,
	onMapCreatedClick,
	onLayerSelected,
	onRandomPointsSelected,
}: {
	selectedLayer: string | null;
	maps: { id: string; name: string }[];
	selectedMap: string;
	mapLayers?: Layer[] | null;
	randomPointsSelected: boolean;
	onMapSelected: (id: string) => void;
	onMapCreatedClick: () => void;
	onLayerCreated: (layer: CreateLayer) => void;
	onLayerSelected: (id: string) => void;
	onRandomPointsSelected: () => void;
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
				<ControlComponent
					selected={randomPointsSelected}
					onClick={onRandomPointsSelected}
				>
					<FontAwesomeIcon icon={faCircle} size="2xs" transform="up-12 " />
					<FontAwesomeIcon icon={faCircle} size="2xs" transform="down-15 " />
					<FontAwesomeIcon icon={faCircle} size="2xs" transform="up-4" />
				</ControlComponent>
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

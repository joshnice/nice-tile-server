import type { Layer, LayerType } from "@nice-tile-server/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import LayerListComponent from "./layer-list";
import MapListComponent from "./map-list";
import { IconButtonComponent } from "./basic/buttons";

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
	onRandomPointsSelected,
	donwloadLayer
}: {
	selectedLayer: string | null;
	maps: { id: string; name: string }[];
	selectedMap: { id: string; name: string };
	mapLayers?: Layer[] | null;
	onMapSelected: (map: { id: string; name: string }) => void;
	onMapCreatedClick: () => void;
	onLayerCreated: (type: LayerType, name: string) => void;
	onLayerSelected: (id: string) => void;
	onRandomPointsSelected: () => void;
	donwloadLayer: (id: string | null) => void;
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
				<div className="flex gap-2">
					<IconButtonComponent disabled={selectedLayer == null} onClick={onRandomPointsSelected}>
						<FontAwesomeIcon icon={faCircle} size="2xs" transform="up-12 " />
						<FontAwesomeIcon icon={faCircle} size="2xs" transform="down-15 " />
						<FontAwesomeIcon icon={faCircle} size="2xs" transform="up-4" />
					</IconButtonComponent>
					<IconButtonComponent disabled={selectedLayer == null} onClick={() => donwloadLayer(selectedLayer)}>
						<FontAwesomeIcon icon={faDownload} size="2x" />
					</IconButtonComponent>
				</div>
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

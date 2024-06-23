import type { Layer, LayerType, Map, MapTile } from "@nice-tile-server/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import LayerListComponent from "../layer/layer-list";
import MapListComponent from "./map-list";
import { IconButtonComponent } from "../basic/buttons";
import { useGlobalState } from "../../context/global-context";

export type Control = "Point" | "Line" | "Area";

export default function MapControlsComponent({
	maps,
	mapTiles,
	mapLayers = [],
	onLayerCreated,
	onMapCreatedClick,
	onRandomPointsSelected,
	downloadLayer,
	makeMapTiles
}: {
	maps: Map[];
	mapTiles: MapTile[];
	mapLayers?: Layer[] | null;
	onMapCreatedClick: () => void;
	onLayerCreated: (type: LayerType, name: string) => void;
	onRandomPointsSelected: () => void;
	downloadLayer: (id: string | undefined) => void;
	makeMapTiles: () => void;
}) {
	const { $selectedLayer } = useGlobalState();
	return (
		<>
			<div className="map-controls-container map-controls-container-left">
				<LayerListComponent
					layers={mapLayers}
					onCreateLayer={onLayerCreated}
				/>
				<div className="flex gap-2">
					<IconButtonComponent disabled={$selectedLayer?.value == null} onClick={onRandomPointsSelected}>
						<FontAwesomeIcon icon={faCircle} size="2xs" transform="up-12 " />
						<FontAwesomeIcon icon={faCircle} size="2xs" transform="down-15 " />
						<FontAwesomeIcon icon={faCircle} size="2xs" transform="up-4" />
					</IconButtonComponent>
					<IconButtonComponent disabled={$selectedLayer?.value == null} onClick={() => downloadLayer($selectedLayer?.value?.id)}>
						<FontAwesomeIcon icon={faDownload} size="2x" />
					</IconButtonComponent>
				</div>
			</div>
			<div className="map-controls-container map-controls-container-right">
				<MapListComponent
					maps={maps}
					mapTiles={mapTiles}
					onMapCreatedClick={onMapCreatedClick}
					makeMapTiles={makeMapTiles}
				/>
			</div>
		</>
	);
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCells } from "@fortawesome/free-solid-svg-icons/faTableCells";
import { ButtonComponent, IconButtonComponent } from "../basic/buttons";
import { SelectObjectComponentWithGroups } from "../basic/selects";
import { useMemo } from "react";
import type { Map, MapTile } from "@nice-tile-server/types";

type CombinedMap = Map | MapTile;

export default function MapListComponent({
	maps,
	mapTiles,
	selectedMap,
	onMapSelected,
	onMapCreatedClick,
	makeMapTiles,
}: {
	maps: Map[];
	mapTiles: MapTile[];
	selectedMap: CombinedMap;
	onMapSelected: (map: CombinedMap) => void;
	onMapCreatedClick: () => void;
	makeMapTiles: () => void;
}) {

	const combinedGroups = useMemo(() => {
		return [
			{ name: "Maps", options: maps?.map((map) => ({ ...map, type: "map" } as Map)) ?? [] },
			{ name: "Map tiles", options: mapTiles?.map((tile) => ({ ...tile, type: "tile" } as MapTile)) ?? [] }
		]
	}, [maps?.length, mapTiles?.length])

	return (
		<>
			<SelectObjectComponentWithGroups<CombinedMap>
				value={selectedMap}
				groups={combinedGroups}
				onChange={onMapSelected}
			/>
			<ButtonComponent
				onClick={onMapCreatedClick}
				text="Create Map"
				className="!w-full"
			/>
			<div>
				<IconButtonComponent onClick={makeMapTiles}>
					<FontAwesomeIcon icon={faTableCells} size="2x" />
				</IconButtonComponent>
			</div >
		</>
	);
}

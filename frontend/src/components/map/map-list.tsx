import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCells } from "@fortawesome/free-solid-svg-icons/faTableCells";
import { ButtonComponent, IconButtonComponent } from "../basic/buttons";
import { SelectObjectComponentWithGroups } from "../basic/selects";
import { useMemo } from "react";
import type { Map, MapTile } from "@nice-tile-server/types";
import { useGlobalState } from "../../context/global-context";

export default function MapListComponent({
	maps,
	mapTiles,
	onMapCreatedClick,
	makeMapTiles,
}: {
	maps: Map[];
	mapTiles: MapTile[];
	onMapCreatedClick: () => void;
	makeMapTiles: () => void;
}) {

	const { $selectedMap } = useGlobalState();

	const combinedGroups = useMemo(() => {
		return [
			{ name: "Maps", options: maps?.map((map) => ({ ...map, type: "map" } as Map)) ?? [] },
			{ name: "Map tiles", options: mapTiles?.map((tile) => ({ ...tile, type: "tile" } as MapTile)) ?? [] }
		]
	}, [maps?.length, mapTiles?.length]);

	const handleMapChange = (selectedMap: Map | MapTile) => {
		$selectedMap?.next(selectedMap)
	}

	if ($selectedMap?.value == null) {
		return <></>
	}

	return (
		<>
			<SelectObjectComponentWithGroups<Map | MapTile>
				value={$selectedMap?.value}
				groups={combinedGroups}
				onChange={handleMapChange}
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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCells } from "@fortawesome/free-solid-svg-icons/faTableCells";
import { ButtonComponent, IconButtonComponent } from "./basic/buttons";
import { SelectObjectComponentWithGroups } from "./basic/selects";
import { useMemo } from "react";

export default function MapListComponent({
	maps,
	mapTiles,
	selectedMap,
	onMapSelected,
	onMapCreatedClick,
	makeMapTiles,
}: {
	maps: { id: string; name: string }[];
	mapTiles: { id: string; name: string }[];
	selectedMap: { id: string; name: string, type: string, mapId?: string };
	onMapSelected: (map: { id: string; name: string, type: string, mapId?: string }) => void;
	onMapCreatedClick: () => void;
	makeMapTiles: () => void;
}) {

	const combinedGroups = useMemo(() => {
		return [
			{ name: "Maps", options: maps?.map((map) => ({ ...map, type: "map" })) ?? [] },
			{ name: "Map tiles", options: mapTiles?.map((tile) => ({ ...tile, type: "tile" })) ?? [] }
		]
	}, [maps?.length, mapTiles?.length])

	return (
		<>
			<SelectObjectComponentWithGroups<{ id: string; name: string, type: string, mapId?: string }>
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

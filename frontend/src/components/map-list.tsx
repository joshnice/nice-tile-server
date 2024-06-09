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
	selectedMap: { id: string; name: string };
	onMapSelected: (map: { id: string; name: string }) => void;
	onMapCreatedClick: () => void;
	makeMapTiles: () => void;
}) {

	const combinedGroups = useMemo(() => {
		return [{ name: "Maps", options: maps ?? [] }, { name: "Map tiles", options: mapTiles ?? [] }]
	}, [maps?.length, mapTiles?.length])

	console.log("combinedGroups", combinedGroups);

	return (
		<>
			<SelectObjectComponentWithGroups
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

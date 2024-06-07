import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCells } from "@fortawesome/free-solid-svg-icons/faTableCells";
import { ButtonComponent, IconButtonComponent } from "./basic/buttons";
import { SelectObjectComponent } from "./basic/selects";

export default function MapListComponent({
	maps,
	selectedMap,
	onMapSelected,
	onMapCreatedClick,
	makeMapTiles,
}: {
	maps: { id: string; name: string }[];
	selectedMap: { id: string; name: string };
	onMapSelected: (map: { id: string; name: string }) => void;
	onMapCreatedClick: () => void;
	makeMapTiles: () => void;
}) {
	return (
		<>
			<SelectObjectComponent
				value={selectedMap}
				options={maps}
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

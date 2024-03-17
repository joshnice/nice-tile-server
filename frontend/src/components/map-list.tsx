import { ButtonComponent } from "./basic/buttons";
import { SelectObjectComponent } from "./basic/selects";

export default function MapListComponent({
	maps,
	selectedMap,
	onMapSelected,
	onMapCreatedClick,
}: {
	maps: { id: string; name: string }[];
	selectedMap: { id: string; name: string };
	onMapSelected: (map: { id: string; name: string }) => void;
	onMapCreatedClick: () => void;
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
		</>
	);
}

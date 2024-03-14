export default function MapListComponent({
	maps,
	selectedMap,
	onMapSelected,
	onMapCreatedClick,
}: {
	maps: { id: string; name: string }[];
	selectedMap: string;
	onMapSelected: (id: string) => void;
	onMapCreatedClick: () => void;
}) {
	return (
		<>
			<select
				className="map-selection"
				value={selectedMap}
				onChange={(event) => onMapSelected(event.target.value)}
			>
				{maps.map((map) => (
					<option key={map.id} className="map-option" value={map.id}>
						{map.name}
					</option>
				))}
			</select>
			<button type="button" onClick={onMapCreatedClick} className="map-button">
				Create Map
			</button>
		</>
	);
}

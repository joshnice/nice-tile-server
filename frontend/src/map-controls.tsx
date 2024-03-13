import { useState } from "react";
import { createPortal } from "react-dom";
import type { Layer } from "./types/layer";

export type Control = "Point" | "Line" | "Area";

export type CreateLayer = Omit<Layer, "mapId" | "id">;

export default function MapControlsComponent({
	selectedLayer,
	maps,
	selectedMap,
	mapLayers = [],
	onMapSelected,
	onLayerCreated,
	onMapCreatedClick,
	onLayerSelected,
}: {
	selectedLayer: string | null;
	maps: { id: string; name: string }[];
	selectedMap: string;
	mapLayers?: Layer[] | null;
	onMapSelected: (id: string) => void;
	onMapCreatedClick: () => void;
	onLayerCreated: (layer: CreateLayer) => void;
	onLayerSelected: (id: string) => void;
}) {
	return (
		<>
			<div className="map-controls-container map-controls-container-left">
				<CreateLayerComponent
					layers={mapLayers}
					selectedLayerId={selectedLayer}
					onCreateLayer={onLayerCreated}
					onLayerSelected={onLayerSelected}
				/>
			</div>
			<div className="map-controls-container map-controls-container-right">
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
				<button
					type="button"
					onClick={onMapCreatedClick}
					className="map-button"
				>
					Create Map
				</button>
			</div>
		</>
	);
}

function CreateLayerComponent({
	layers = [],
	selectedLayerId,
	onCreateLayer,
	onLayerSelected,
}: {
	layers: Layer[] | null;
	selectedLayerId: string | null;
	onCreateLayer: (layer: CreateLayer) => void;
	onLayerSelected: (id: string) => void;
}) {
	const [createLayerModal, setCreateLayerModal] = useState(false);
	const [layer, setLayer] = useState<CreateLayer>({ name: "", type: "Fill" });

	const handleCreateLayer = () => {
		setCreateLayerModal(false);
		onCreateLayer(layer);
		setLayer({ name: "", type: "Fill" });
	};

	const handleClose = () => {
		setCreateLayerModal(false);
		setLayer({ name: "", type: "Fill" });
	};

	const layerDialog = createPortal(
		<dialog>
			<h1>Create Layer</h1>
			<div className="create-layer-content">
				<h2 className="create-layer-sub-heading">Name</h2>
				<input
					className="create-layer-input"
					type="text"
					value={layer.name}
					onChange={(event) => setLayer({ ...layer, name: event.target.value })}
				/>
				<h2 className="create-layer-sub-heading">Type</h2>
				<select
					className="create-layer-input"
					value={layer.type}
					onChange={(event) =>
						setLayer({
							...layer,
							type: event.target.value as "Line" | "Point" | "Fill",
						})
					}
				>
					<option value="Fill">Fill</option>
					<option value="Line">Line</option>
					<option value="Point">Point</option>
				</select>
			</div>
			<div className="create-layer-buttons">
				<button
					type="button"
					className="create-layer-button"
					onClick={() => handleClose()}
				>
					Close
				</button>
				<button
					type="button"
					className="create-layer-button"
					onClick={() => handleCreateLayer()}
				>
					Add
				</button>
			</div>
		</dialog>,
		document.body,
	);

	return (
		<div className="layers-list">
			<h2 style={{ margin: "0px" }}>Layers</h2>
			{layers?.map((layer) => {
				if (layer.id === selectedLayerId) {
					return (
						<button
							type="button"
							key={layer.id}
							className="layer-button selected-layer-button"
							onClick={() => onLayerSelected(layer.id)}
						>
							{layer.name}
						</button>
					);
				}
				return (
					<button
						type="button"
						key={layer.id}
						className="layer-button"
						onClick={() => onLayerSelected(layer.id)}
					>
						{layer.name}
					</button>
				);
			})}
			<button
				type="button"
				className="map-button"
				onClick={() => setCreateLayerModal(true)}
			>
				Create Layer
			</button>
			{createLayerModal && layerDialog}
		</div>
	);
}

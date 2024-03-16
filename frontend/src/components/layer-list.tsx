import { useMemo, useState } from "react";
import type { CreateLayer, Layer } from "../types/layer";
import MinMaxComponent from "./min-max";
import ModalComponent from "./modal";
import { HeaderText, SubHeaderText } from "./basic/headers";

export default function LayerListComponent({
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

	const [expand, setExpand] = useState(true);

	const handleCreateLayer = () => {
		setCreateLayerModal(false);
		onCreateLayer(layer);
		setLayer({ name: "", type: "Fill" });
	};

	const handleClose = () => {
		setCreateLayerModal(false);
		setLayer({ name: "", type: "Fill" });
	};

	const selectedLayer = useMemo(
		() => layers?.find((l) => l.id === selectedLayerId),
		[layers, selectedLayerId],
	);

	return (
		<div className="layers-list">
			<MinMaxComponent value={expand} onClick={() => setExpand(!expand)} />
			<HeaderText title="Layers" />
			<div className="flex flex-col gap-3 max-h-[30vh] overflow-y-auto">
				{expand ? (
					layers?.map((layer) => (
						<LayerComponent
							layer={layer}
							selected={layer.id === selectedLayerId}
							onLayerSelected={onLayerSelected}
						/>
					))
				) : (
					<>
						{selectedLayer && (
							<LayerComponent
								layer={selectedLayer}
								onLayerSelected={onLayerSelected}
								selected
							/>
						)}
					</>
				)}
			</div>
			<button
				type="button"
				className="map-button"
				onClick={() => setCreateLayerModal(true)}
			>
				Create Layer
			</button>
			{createLayerModal && (
				<ModalComponent
					header="Create Layer"
					submitButtonText="Add"
					onSubmit={handleCreateLayer}
					onClose={handleClose}
				>
					<div className="create-layer-content">
						<SubHeaderText title="Name" />
						<input
							className="create-layer-input"
							type="text"
							value={layer.name}
							onChange={(event) =>
								setLayer({ ...layer, name: event.target.value })
							}
						/>
						<SubHeaderText title="Type" />
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
				</ModalComponent>
			)}
		</div>
	);
}

function LayerComponent({
	layer,
	selected,
	onLayerSelected,
}: { layer: Layer; selected: boolean; onLayerSelected: (id: string) => void }) {
	return (
		<button
			type="button"
			key={layer.id}
			className={`h-12 p-2 w-full border-solid border-slate-600 border-2 rounded-sm ${
				selected ? "bg-sky-300" : "bg-white"
			}`}
			onClick={() => onLayerSelected(layer.id)}
		>
			{layer.name}
		</button>
	);
}

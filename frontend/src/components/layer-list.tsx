import { useMemo, useState } from "react";
import type { CreateLayer, Layer } from "../types/layer";
import MinMaxComponent from "./min-max";
import { HeaderText } from "./basic/headers";
import CreateLayerLayerFormComponent from "./create-layer-form";
import { ButtonComponent } from "./basic/buttons";

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

	const [expand, setExpand] = useState(true);

	const handleCreateLayer = (layer: CreateLayer) => {
		setCreateLayerModal(false);
		onCreateLayer(layer);
	};

	const handleClose = () => {
		setCreateLayerModal(false);
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
							key={layer.id}
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
			<ButtonComponent
				text="Create Layer"
				onClick={() => setCreateLayerModal(true)}
				className="!w-full"
			/>
			<CreateLayerLayerFormComponent
				open={createLayerModal}
				handleCreateLayer={handleCreateLayer}
				handleClose={handleClose}
			/>
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
				selected ? "bg-slate-300" : "bg-white"
			}`}
			onClick={() => onLayerSelected(layer.id)}
		>
			{layer.name}
		</button>
	);
}

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { CreateLayer, Layer } from "../types/layer";
import MinMaxComponent from "./min-max";
import ModalComponent from "./modal";

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

	const layerDialog = createPortal(
		<dialog>
			<h1>Create Layer</h1>
		</dialog>,
		document.body,
	);

	const selectedLayer = useMemo(
		() => layers?.find((l) => l.id === selectedLayerId),
		[layers, selectedLayerId],
	);

	return (
		<div className="layers-list">
			<MinMaxComponent value={expand} onClick={() => setExpand(!expand)} />
			<h2 style={{ margin: "0px" }}>Layers</h2>
			<div className="layers-list-layers">
				{expand ? (
					layers?.map((layer) => (
						<button
							type="button"
							key={layer.id}
							className={
								layer.id === selectedLayerId
									? "layer-button selected-layer-button"
									: "layer-button"
							}
							onClick={() => onLayerSelected(layer.id)}
						>
							{layer.name}
						</button>
					))
				) : (
					<>
						{selectedLayer && (
							<button
								type="button"
								key={selectedLayer?.id}
								className="layer-button selected-layer-button"
								onClick={() => onLayerSelected(selectedLayer?.id)}
							>
								{selectedLayer.name}
							</button>
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
						<h2 className="create-layer-sub-heading">Name</h2>
						<input
							className="create-layer-input"
							type="text"
							value={layer.name}
							onChange={(event) =>
								setLayer({ ...layer, name: event.target.value })
							}
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
				</ModalComponent>
			)}
		</div>
	);
}

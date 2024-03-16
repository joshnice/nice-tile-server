import type { Layer } from "../types/layer";
import { useState } from "react";
import ModalComponent from "./modal";

export default function RandomObjectsComponent({
	layers,
	onSubmit,
	onClose,
}: {
	layers: Layer[];
	onSubmit: (layerId: string, amount: number) => void;
	onClose: () => void;
}) {
	const [amount, setAmount] = useState(0);
	const [layerSelected, setSelectedLayer] = useState(layers[0]?.id);

	const handleSubmit = () => {
		if (layerSelected == null) {
			throw new Error();
		}
		onSubmit(layerSelected, amount);
	};

	return (
		<ModalComponent
			header="Generate Random Objects"
			onSubmit={handleSubmit}
			onClose={onClose}
			submitButtonText={"Next"}
		>
			<div className="create-layer-content">
				<h2 className="create-layer-sub-heading">Amount</h2>
				<input
					className="create-layer-input"
					type="number"
					value={amount}
					onChange={(event) =>
						setAmount(Number.parseInt(event.target.value, 10))
					}
				/>
				<h2 className="create-layer-sub-heading">Layer</h2>
				<select
					className="create-layer-input"
					value={layerSelected}
					onChange={(event) => setSelectedLayer(event.target.value)}
				>
					{layers.map((layer) => (
						<option key={layer.id} value={layer.id}>
							{layer.name}
						</option>
					))}
				</select>
			</div>
		</ModalComponent>
	);
}

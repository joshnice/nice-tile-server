import type { Layer } from "../types/layer";
import { useState } from "react";
import ModalComponent from "./modal";
import { SubHeaderText } from "./basic/headers";
import { NumberInputComponent } from "./basic/inputs";
import { SelectObjectComponent } from "./basic/selects";

export default function RandomObjectsComponent({
	open,
	layers,
	onSubmit,
	onClose,
}: {
	open: boolean;
	layers: Layer[];
	onSubmit: (layerId: string, amount: number) => void;
	onClose: () => void;
}) {
	const [amount, setAmount] = useState(0);
	const [layerSelected, setSelectedLayer] = useState(layers[0]);

	const handleSubmit = () => {
		if (layerSelected == null) {
			throw new Error();
		}
		onSubmit(layerSelected.id, amount);
	};

	return (
		<ModalComponent
			header="Generate Random Objects"
			onSubmit={handleSubmit}
			onClose={onClose}
			submitButtonText={"Next"}
			open={open}
		>
			<div className="flex flex-col h-full gap-5">
				<div className="flex flex-col gap-3">
					<SubHeaderText title="Amount" />
					<NumberInputComponent value={amount} onChange={setAmount} />
				</div>
				<div className="flex flex-col gap-3">
					<SubHeaderText title="Layer" />
					<SelectObjectComponent
						value={layerSelected}
						options={layers}
						onChange={(layer) => setSelectedLayer(layer)}
					/>
				</div>
			</div>
		</ModalComponent>
	);
}

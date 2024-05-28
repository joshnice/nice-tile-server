import type { CreateLayer } from "@nice-tile-server/types";
import { useState } from "react";
import { SubHeaderText } from "./basic/headers";
import ModalComponent from "./modal";
import { TextInputComponent } from "./basic/inputs";
import { SelectStringComponent } from "./basic/selects";
import { createStyle } from "../helpers/style-helpers";

export default function CreateLayerLayerFormComponent({
	open,
	handleCreateLayer,
	handleClose,
}: {
	open: boolean;
	handleCreateLayer: (layer: CreateLayer) => void;
	handleClose: () => void;
}) {
	const [layer, setLayer] = useState<CreateLayer>({ name: "", type: "Fill", style: createStyle("Fill") });

	return (
		<ModalComponent
			header="Create Layer"
			submitButtonText="Add"
			onSubmit={() => handleCreateLayer(layer)}
			onClose={handleClose}
			open={open}
		>
			<div className="flex flex-col h-full gap-5">
				<div className="flex flex-col gap-3">
					<SubHeaderText title="Name" />
					<TextInputComponent
						value={layer.name}
						onChange={(value) => setLayer({ ...layer, name: value })}
					/>
				</div>
				<div className="flex flex-col gap-3">
					<SubHeaderText title="Type" />
					<SelectStringComponent
						value={layer.type}
						options={["Fill", "Point", "Line"]}
						onChange={(value) => setLayer({ ...layer, type: value, style: createStyle(value) })}
					/>
				</div>
			</div>
		</ModalComponent>
	);
}

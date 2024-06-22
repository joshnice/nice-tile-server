import type { LayerType } from "@nice-tile-server/types";
import { useState } from "react";
import { SubHeaderText } from "../basic/headers";
import ModalComponent from "../common/modal";
import { TextInputComponent } from "../basic/inputs";
import { SelectStringComponent } from "../basic/selects";

export default function CreateLayerLayerFormComponent({
	open,
	handleCreateLayer,
	handleClose,
}: {
	open: boolean;
	handleCreateLayer: (type: LayerType, name: string) => void;
	handleClose: () => void;
}) {
	const [name, setName] = useState<string>("");
	const [type, setType] = useState<LayerType>("Fill");

	return (
		<ModalComponent
			header="Create Layer"
			submitButtonText="Add"
			onSubmit={() => handleCreateLayer(type, name)}
			onClose={handleClose}
			open={open}
		>
			<div className="flex flex-col h-full gap-5">
				<div className="flex flex-col gap-3">
					<SubHeaderText title="Name" />
					<TextInputComponent
						value={name}
						onChange={setName}
					/>
				</div>
				<div className="flex flex-col gap-3">
					<SubHeaderText title="Type" />
					<SelectStringComponent
						value={type}
						options={["Fill", "Point", "Line"]}
						onChange={setType}
					/>
				</div>
			</div>
		</ModalComponent>
	);
}

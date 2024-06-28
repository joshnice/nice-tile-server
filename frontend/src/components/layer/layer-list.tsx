import type { Layer, LayerType } from "@nice-tile-server/types";
import { useEffect, useState } from "react";
import MinMaxComponent from "../common/min-max";
import { HeaderText } from "../basic/headers";
import CreateLayerLayerFormComponent from "./create-layer-form";
import { ButtonComponent } from "../basic/buttons";
import { useGlobalState } from "../../context/global-context";

export default function LayerListComponent({
	layers = [],
	onCreateLayer,
}: {
	layers: Layer[] | null;
	onCreateLayer: (type: LayerType, name: string) => void;
}) {
	const { $selectedLayer, $selectedMap } = useGlobalState();

	const [createLayerModal, setCreateLayerModal] = useState(false);

	const [expand, setExpand] = useState(true);

	const handleCreateLayer = (type: LayerType, name: string) => {
		setCreateLayerModal(false);
		onCreateLayer(type, name);
	};

	const handleClose = () => {
		setCreateLayerModal(false);
	};

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
						/>
					))
				) : (
					<>
						{$selectedLayer?.value && (
							<LayerComponent
								layer={$selectedLayer.value}
							/>
						)}
					</>
				)}
			</div>
			<ButtonComponent
				disabled={$selectedMap?.value?.type === "tile"}
				text="Create Layer"
				onClick={() => setCreateLayerModal(true)}
				className="!w-full disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-default disabled:hover:bg-white"
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
}: { layer: Layer; }) {
	const { $selectedLayer, $selectedMap } = useGlobalState();
	const [selected, setSelected] = useState(false);
	const [disableLayerSelection, setDisableLayerSelected] = useState(false);

	useEffect(() => {
		const sub = $selectedLayer?.subscribe((selectedLayer) => {
			setSelected(selectedLayer?.id === layer.id);
		})
		return () => {
			sub?.unsubscribe();
		}
	}, [$selectedLayer]);

	useEffect(() => {
		const sub = $selectedMap?.subscribe((selectedMap) => {
			setDisableLayerSelected(selectedMap?.type === "tile");
		});
		return () => {
			sub?.unsubscribe();
		}
	}, [$selectedMap])

	return (
		<button
			disabled={disableLayerSelection}
			type="button"
			key={layer.id}
			className={`h-12 p-2 w-full border-solid border-slate-600 border-2 rounded-sm disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-default ${selected ? "bg-slate-300" : "bg-white"
				}`}
			onClick={() => $selectedLayer?.next(layer)}
		>
			{layer.name}
		</button>
	);
}

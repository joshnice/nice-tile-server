import type { Layer } from "../types/layer";
import { useState } from "react";
import ModalComponent from "./modal";
import { SubHeaderText } from "./basic/headers";
import { NumberInputComponent } from "./basic/inputs";
import { SelectObjectComponent, SelectStringComponent } from "./basic/selects";
import type { RandomObjectProperty, PropertyType } from "../types/properties";
import { createRandomObjectProperty } from "../helpers/random-object-property-helpers";
import {
	StaticValueProperty,
	RandomNumberProperty,
} from "./property-value-selectors";

export default function RandomObjectsComponent({
	open,
	layers,
	onSubmit,
	onClose,
}: {
	open: boolean;
	layers: Layer[];
	onSubmit: (
		layerId: string,
		amount: number,
		properties: RandomObjectProperty[],
	) => void;
	onClose: () => void;
}) {
	const [amount, setAmount] = useState(0);
	const [layerSelected, setSelectedLayer] = useState(layers[0]);
	const [properties, setProperties] = useState<RandomObjectProperty[]>([]);

	// Handlers

	const handleAddProperty = (type: PropertyType) => {
		setProperties([...properties, createRandomObjectProperty(type)]);
	};

	const handleEditProperty = (updatedProperty: RandomObjectProperty) => {
		const updatedProperties = properties.map((property) => {
			if (updatedProperty.id === property.id) {
				return updatedProperty;
			}
			return property;
		});
		setProperties(updatedProperties);
	};

	const handleSubmit = () => {
		if (layerSelected == null) {
			throw new Error();
		}
		onSubmit(layerSelected.id, amount, properties);
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
				<div className="flex flex-col gap-3">
					<SubHeaderText title="Properties" />
					<PropertiesComponent
						properties={properties}
						handlePropertyChange={handleEditProperty}
					/>
					<SelectStringComponent
						value={undefined}
						options={["randomNumber", "setValue", "staticValue"]}
						onChange={handleAddProperty}
						startBlank
					/>
				</div>
			</div>
		</ModalComponent>
	);
}

function PropertiesComponent({
	properties,
	handlePropertyChange,
}: {
	properties: RandomObjectProperty[];
	handlePropertyChange: (change: RandomObjectProperty) => void;
}) {
	return properties.map((property) => {
		switch (property.type) {
			case "staticValue":
				return (
					<StaticValueProperty
						key={property.id}
						value={property}
						onChange={handlePropertyChange}
					/>
				);
			case "randomNumber":
				return (
					<RandomNumberProperty
						key={property.id}
						value={property}
						onChange={handlePropertyChange}
					/>
				);
			case "setValue":
				return <div key={property.id}>set value</div>;
			default:
				throw new Error("Type not handled");
		}
	});
}

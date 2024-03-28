import { useMemo } from "react";
import type {
	RandomObjectStaticValue,
	RandomObjectRandomNumber,
	RandomObjectSetValue,
} from "../types/properties";
import { SubHeaderText, MinorHeaderText } from "./basic/headers";
import { TextInputComponent, NumberInputComponent } from "./basic/inputs";
import { TableComponent } from "./basic/table";

export function StaticValueProperty({
	value,
	onChange,
}: {
	value: RandomObjectStaticValue;
	onChange: (value: RandomObjectStaticValue) => void;
}) {
	return (
		<div>
			<SubHeaderText title="Static Value" />
			<div className="flex gap-5 justify-between">
				<div className="flex flex-col">
					<MinorHeaderText title="Name" />
					<TextInputComponent
						value={value.name}
						onChange={(name) => onChange({ ...value, name })}
					/>
				</div>
				<div className="flex flex-col">
					<MinorHeaderText title="Value" />
					<TextInputComponent
						value={value.value}
						onChange={(staticValue) =>
							onChange({ ...value, value: staticValue })
						}
					/>
				</div>
			</div>
		</div>
	);
}

export function RandomNumberProperty({
	value,
	onChange,
}: {
	value: RandomObjectRandomNumber;
	onChange: (value: RandomObjectRandomNumber) => void;
}) {
	return (
		<div>
			<SubHeaderText title="Random Number" />
			<div className="flex flex-col">
				<MinorHeaderText title="Name" />
				<TextInputComponent
					value={value.name}
					onChange={(name) => onChange({ ...value, name })}
				/>
			</div>
			<div className="flex gap-5 justify-between">
				<div className="flex flex-col">
					<MinorHeaderText title="Lower Value" />
					<NumberInputComponent
						value={value.lower}
						onChange={(lowerValue) => onChange({ ...value, lower: lowerValue })}
					/>
				</div>
				<div className="flex flex-col">
					<MinorHeaderText title="Upper Value" />
					<NumberInputComponent
						value={value.upper}
						onChange={(upperValue) => onChange({ ...value, upper: upperValue })}
					/>
				</div>
			</div>
		</div>
	);
}

export function SetValueProperty({
	value,
	onChange,
}: {
	value: RandomObjectSetValue;
	onChange: (value: RandomObjectSetValue) => void;
}) {
	const valuesAsKV = useMemo(() => {
		return value.values.map((val) => ({ value: val }));
	}, [value.values]);

	console.log("valuesAsKV", valuesAsKV);

	// Handlers
	const onValueChange = (_: string, index: number, updateValue: string) => {
		const updatedValues = [...value.values];
		updatedValues[index] = updateValue;
		onChange({ ...value, values: updatedValues });
	};

	const onAdd = (updatedValue: Record<string, string>) => {
		const parsedValue = Object.values(updatedValue)[0];
		onChange({ ...value, values: [...value.values, parsedValue] });
	};

	return (
		<div>
			<SubHeaderText title="Random Number" />
			<div className="flex flex-col">
				<MinorHeaderText title="Name" />
				<TextInputComponent
					value={value.name}
					onChange={(name) => onChange({ ...value, name })}
				/>
			</div>
			<TableComponent
				columns={[{ id: "value", heading: "Value" }]}
				data={valuesAsKV}
				onValueChange={onValueChange}
				onAdd={onAdd}
			/>
		</div>
	);
}

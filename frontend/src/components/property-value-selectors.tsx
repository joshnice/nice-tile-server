import type {
	RandomObjectStaticValue,
	RandomObjectRandomNumber,
} from "../types/properties";
import { SubHeaderText, MinorHeaderText } from "./basic/headers";
import { TextInputComponent, NumberInputComponent } from "./basic/inputs";

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

export function SelectStringComponent<TValue extends string>({
	value,
	options,
	onChange,
	startBlank = false,
}: {
	value: TValue | undefined;
	options: TValue[];
	onChange: (value: TValue) => void;
	startBlank?: boolean;
}) {
	return (
		<select
			className="h-12 border-2 border-slate-600 p-3 text-lg full bg-white rounded-sm"
			onChange={(event) => onChange(event.target.value as TValue)}
			defaultValue={startBlank ? "" : value}
		>
			{startBlank && <option className="hidden" disabled value="" />}
			{options.map((option) => (
				<option value={option} key={option}>
					{option}
				</option>
			))}
		</select>
	);
}

export function SelectObjectComponent<
	TValue extends { id: string; name: string },
>({
	value,
	options,
	onChange,
}: {
	value: TValue;
	options: TValue[];
	onChange: (value: TValue) => void;
}) {
	const handleValueSelected = (id: string) => {
		const selectedOption = options.find((o) => o.id === id);
		if (selectedOption == null) {
			throw new Error("Option doesn't exist");
		}
		onChange(selectedOption);
	};

	return (
		<select
			className="h-12 border-2 border-slate-600 p-3 text-lg full bg-white rounded-sm"
			value={value.id}
			onChange={(event) => handleValueSelected(event.target.value)}
		>
			{options.map((option) => (
				<option value={option.id} key={option.id}>
					{option.name}
				</option>
			))}
		</select>
	);
}

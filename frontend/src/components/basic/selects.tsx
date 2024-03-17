export function SelectComponent<TValue extends string>({
	value,
	options,
	onChange,
}: {
	value: TValue;
	options: TValue[];
	onChange: (value: TValue) => void;
}) {
	return (
		<select
			className="h-12 border-2 border-slate-600 p-3 text-lg w-3/4 bg-white rounded-sm"
			value={value}
			onChange={(event) => onChange(event.target.value as TValue)}
		>
			{options.map((option) => (
				<option value={option} key={option}>
					{option}
				</option>
			))}
		</select>
	);
}

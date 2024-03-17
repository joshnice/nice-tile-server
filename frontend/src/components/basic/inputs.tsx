export function TextInputComponent<TValue extends string>({
	value,
	onChange,
}: { value: TValue; onChange: (value: TValue) => void }) {
	return (
		<input
			type="text"
			value={value}
			onChange={(event) => onChange(event.target.value as TValue)}
			className="h-12 border-2 border-slate-600 p-3 text-lg w-3/4 rounded-sm"
		/>
	);
}

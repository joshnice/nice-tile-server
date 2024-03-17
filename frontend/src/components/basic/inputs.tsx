export function TextInputComponent<TValue extends string>({
	value,
	onChange,
}: { value: TValue; onChange: (value: TValue) => void }) {
	return (
		<input
			type="text"
			value={value}
			onChange={(event) => onChange(event.target.value as TValue)}
			className="h-12 border-2 border-slate-600 p-3 text-lg w-full rounded-sm"
		/>
	);
}

export function NumberInputComponent({
	value,
	onChange,
}: { value: number; onChange: (value: number) => void }) {
	return (
		<input
			type="number"
			value={value}
			onChange={(event) => onChange(Number.parseInt(event.target.value, 10))}
			className="h-12 border-2 border-slate-600 p-3 text-lg w-full rounded-sm"
		/>
	);
}

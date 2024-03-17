export function ButtonComponent({
	text,
	onClick,
}: { text: string; onClick: () => void }) {
	return (
		<button
			className="w-28 h-10 border-2 border-slate-600 bg-white hover:bg-slate-300"
			type="button"
			onClick={onClick}
		>
			{text}
		</button>
	);
}

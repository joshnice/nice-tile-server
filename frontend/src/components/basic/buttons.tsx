import type { PropsWithChildren } from "react";

export function ButtonComponent({
	text,
	disabled = false,
	onClick,
	className = "",
}: { text: string; disabled?: boolean; className?: string; onClick: () => void }) {
	return (
		<button
			disabled={disabled}
			className={`w-28 h-10 border-2 border-slate-600 bg-white hover:bg-slate-300 text-lg ${className}`}
			type="button"
			onClick={onClick}
		>
			{text}
		</button>
	);
}

export function IconButtonComponent({
	children,
	className = "",
	disabled = false,
	onClick,
}: PropsWithChildren<{ onClick: () => void; disabled?: boolean, className?: string }>) {

	return (
		<button
			type="button"
			className={`flex justify-center items-center p-2 w-12 h-12 bg-white border-[3px] border-black rounded-md hover:bg-slate-300 disabled:hover:bg-white disabled:opacity-50 ${className}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
}

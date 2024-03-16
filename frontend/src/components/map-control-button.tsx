import type { PropsWithChildren } from "react";

export default function ControlComponent({
	selected,
	onClick,
	children,
}: PropsWithChildren<{ selected: boolean; onClick: () => void }>) {
	return (
		<button
			type="button"
			className={
				selected
					? "map-button map-control selected-button bg-white"
					: "map-button map-control bg-white"
			}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

import { useMemo, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { HeaderText } from "./basic/headers";
import { ButtonComponent } from "./basic/buttons";

type Size = "small" | "medium" | "large";

interface ModalProps {
	size?: Size;
	header: string;
	submitButtonText: string;
	open: boolean;
	onSubmit: () => void;
	onClose: () => void;
}

export default function ModalComponent({
	size = "medium",
	header,
	submitButtonText,
	open,
	onClose,
	onSubmit,
	children,
}: PropsWithChildren<ModalProps>) {
	const modalSizeClasses = useMemo(() => getModalSizeClasses(size), [size]);
	const portal = createPortal(
		<dialog
			className={`flex flex-col gap-8 absolute border-2 border-black z-50 p-5 ${modalSizeClasses}`}
			open={open}
		>
			<HeaderText title={header} />
			{children}
			<div className="w-full flex justify-end gap-5">
				<ButtonComponent text="Close" onClick={onClose} />
				<ButtonComponent text={submitButtonText} onClick={onSubmit} />
			</div>
		</dialog>,
		document.body,
	);

	const background = createPortal(
		<div className="absolute top-0 left-0 bg-black opacity-80 w-full h-full z-40" />,
		document.body,
	);

	return (
		<>
			{open && (
				<>
					{portal}
					{background}
				</>
			)}
		</>
	);
}

function getModalSizeClasses(size: Size): string {
	switch (size) {
		case "small":
			throw new Error("Size not added");
		case "medium":
			return "top-[25vh] max-h-[750px] w-[50vw] max-w-[600px]";
		case "large":
			return "top-[10vh] h-[80vh] w-[60vw] max-w-[1000px]";
		default:
			throw new Error("Size value not handled");
	}
}

import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { HeaderText } from "./basic/headers";
import { ButtonComponent } from "./basic/buttons";

interface ModalProps {
	header: string;
	submitButtonText: string;
	open: boolean;
	onSubmit: () => void;
	onClose: () => void;
}

export default function ModalComponent({
	header,
	submitButtonText,
	open,
	onClose,
	onSubmit,
	children,
}: PropsWithChildren<ModalProps>) {
	const portal = createPortal(
		<dialog
			className="flex flex-col gap-8 absolute top-[25vh] max-h-[750px] w-[50vw] max-w-[600px] border-2 border-black z-50 p-5"
			open={open}
		>
			<HeaderText title={header} />
			{children}
			<div className="modal-submit-button">
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

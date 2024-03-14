import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
	header: string;
	submitButtonText: string;
	onSubmit: () => void;
	onClose: () => void;
}

export default function ModalComponent({
	header,
	submitButtonText,
	onClose,
	onSubmit,
	children,
}: PropsWithChildren<ModalProps>) {
	const portal = createPortal(
		<dialog className="modal">
			<h1>{header}</h1>
			{children}
			<div className="modal-submit-button">
				<button type="button" className="modal-button" onClick={onClose}>
					Close
				</button>
				<button type="button" className="modal-button" onClick={onSubmit}>
					{submitButtonText}
				</button>
			</div>
		</dialog>,
		document.body,
	);

	const background = createPortal(
		<div className="modal-background" />,
		document.body,
	);

	return (
		<>
			{portal}
			{background}
		</>
	);
}

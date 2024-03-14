import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

export default function MinMaxComponent({
	value,
	onClick,
}: { value: boolean; onClick: () => void }) {
	return (
		<button className="min-max-button" type="button" onClick={onClick}>
			{value ? (
				<FontAwesomeIcon className="min-max-icon" icon={faMinus} />
			) : (
				<FontAwesomeIcon className="min-max-icon" icon={faPlus} />
			)}
		</button>
	);
}

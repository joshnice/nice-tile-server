import { useState, type PropsWithChildren } from "react";
import { TextInputComponent } from "./inputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons/faSave";

export interface Column {
	id: string;
	heading: string;
}

interface TableProps {
	columns: Column[];
	data: Record<string, string>[];
	onValueChange: (column: string, index: number, value: string) => void;
	onAdd: (value: Record<string, string>) => void;
}

export function TableComponent({
	columns,
	data,
	onValueChange,
	onAdd,
}: TableProps) {
	return (
		<div className="w-full h-full max-h-full border-2 border-black overflow-y-auto">
			<div className="w-full h-16 flex justify-evenly">
				{columns.map((column) => (
					<ColumnHeaderComponent key={column.id} heading={column.heading} />
				))}
			</div>
			{data.map((d, index) => (
				<div key={index} className="w-full h-16 flex justify-evenly">
					{columns.map((column) => (
						<TextCellComponent
							key={`${index}-${column.id}`}
							value={d[column.id]}
							onChange={(value) => onValueChange(column.id, index, value)}
						/>
					))}
				</div>
			))}
			<EmptyTextCellComponent addValue={onAdd} />
		</div>
	);
}

function CellComponent({ children }: PropsWithChildren) {
	return <div className="border-black border-2 w-full h-full">{children}</div>;
}

function ColumnHeaderComponent({ heading }: { heading: string }) {
	return (
		<CellComponent>
			<button type="button" className="w-full h-full font-semibold text-xl">
				{heading}
			</button>
		</CellComponent>
	);
}

interface TextCellProps {
	value: string;
	onChange: (value: string) => void;
}

function TextCellComponent({ value, onChange }: TextCellProps) {
	const [edit, setEdit] = useState(false);
	const [editingValue, setEditingValue] = useState<string | null>(null);

	const handleSaveClicked = () => {
		if (editingValue == null) {
			throw new Error("Editing value is null");
		}

		onChange(editingValue);
		setEdit(false);
	};

	const handleDoubleClick = () => {
		setEdit(true);
		setEditingValue(value);
	};

	return (
		<CellComponent>
			{edit ? (
				<div className="w-full h-full relative">
					<TextInputComponent
						value={editingValue ?? ""}
						onChange={(value) => setEditingValue(value)}
						className="!h-full !border-0"
						autoFocus
					/>
					<button
						className="absolute right-3 top-1/4"
						type="button"
						onClick={handleSaveClicked}
					>
						<FontAwesomeIcon size="2x" icon={faSave} />
					</button>
				</div>
			) : (
				<button
					className="w-full h-full"
					type="button"
					onDoubleClick={handleDoubleClick}
				>
					{value}
				</button>
			)}
		</CellComponent>
	);
}

function EmptyTextCellComponent({
	addValue,
}: { addValue: (value: Record<string, string>) => void }) {
	const [key, setKey] = useState("");
	const [value, setValue] = useState("");

	const handleSaveClicked = () => {
		addValue({ [key]: value });
		setKey("");
		setValue("");
	};

	return (
		<div className="w-full h-16 flex justify-evenly">
			<CellComponent>
				<div className="w-full h-full relative">
					<TextInputComponent
						value={key ?? ""}
						onChange={(value) => setKey(value)}
						className="!h-full !border-0"
					/>
				</div>
			</CellComponent>
			<CellComponent>
				<div className="w-full h-full relative">
					<TextInputComponent
						value={value ?? ""}
						onChange={(value) => setValue(value)}
						className="!h-full !border-0"
					/>
					<button
						className="absolute right-3 top-1/4"
						type="button"
						onClick={handleSaveClicked}
					>
						<FontAwesomeIcon size="2x" icon={faSave} />
					</button>
				</div>
			</CellComponent>
		</div>
	);
}

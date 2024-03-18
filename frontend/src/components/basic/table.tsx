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
}

export function TableComponent({ columns, data, onValueChange }: TableProps) {
	return (
		<div className="w-full h-ful l border-2 border-black overflow-y-auto">
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

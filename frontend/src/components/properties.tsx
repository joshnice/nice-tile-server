import { type Column, TableComponent } from "./basic/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export default function PropertiesComponent({
	selectedObjectId,
}: { selectedObjectId: string }) {
	// Todo: Make into hook
	const queryClient = useQueryClient();

	const { data: objectProperties, isLoading } = useQuery({
		queryKey: ["object-properties", selectedObjectId],
		queryFn: () => getObjectProperties(selectedObjectId),
	});

	const data = useMemo(() => {
		return Object.entries(objectProperties?.properties ?? {}).map(
			([key, value]) => ({ key, value }),
		);
	}, [objectProperties]);

	const columns: Column[] = useMemo(
		() => [
			{ id: "key", heading: "key" },
			{ id: "value", heading: "value" },
		],
		[],
	);

	const handleUpdate = async (
		columnId: string,
		index: number,
		value: string,
	) => {
		const dataRow = data[index];

		const propertiesCopy = { ...objectProperties?.properties };

		switch (columnId) {
			case "key":
				delete propertiesCopy[dataRow.key];
				propertiesCopy[value] = dataRow.value;
				break;
			case "value":
				propertiesCopy[dataRow.key] = value;
				break;
			default:
				throw new Error("Column id not handled");
		}

		await updateObjectProperties(selectedObjectId, propertiesCopy);

		queryClient.invalidateQueries({
			queryKey: ["object-properties", selectedObjectId],
		});
	};

	const handleAdd = async (value: Record<string, string>) => {
		await updateObjectProperties(selectedObjectId, {
			...objectProperties?.properties,
			...value,
		});

		queryClient.invalidateQueries({
			queryKey: ["object-properties", selectedObjectId],
		});
	};

	return (
		<>
			<div className="properties-container">
				{isLoading ? (
					<span>Loading</span>
				) : (
					<TableComponent
						columns={columns}
						data={data}
						onValueChange={handleUpdate}
						onAdd={handleAdd}
					/>
				)}
			</div>
		</>
	);
}

async function getObjectProperties(
	objectId: string,
): Promise<{ properties: { [key: string]: string } }> {
	const response = await fetch(
		`http://localhost:3000/object/properties/${objectId}`,
	);
	return response.json();
}

async function updateObjectProperties(
	objectId: string,
	properties: { [key: string]: string },
) {
	await fetch(`http://localhost:3000/object/properties/${objectId}`, {
		method: "Put",
		body: JSON.stringify(properties),
		headers: { "Content-Type": "application/json" },
	});
}

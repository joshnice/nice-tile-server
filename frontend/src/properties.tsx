import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function PropertiesComponent({
	selectedObjectId,
}: { selectedObjectId: string }) {
	const [edit, setEdit] = useState<{ key: string; value: string } | null>(null);

	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: ["object-properties", selectedObjectId],
		queryFn: () => getObjectProperties(selectedObjectId),
	});

	const handleUpdate = async () => {
		if (edit != null) {
			await updateObjectProperties(selectedObjectId, {
				[edit.key]: edit.value,
			});
			queryClient.invalidateQueries({
				queryKey: ["object-properties", selectedObjectId],
			});
		}
		setEdit(null);
	};

	const handleClose = () => {
		setEdit(null);
	};

	const layerDialog = createPortal(
		<dialog>
			<>
				{edit == null ? (
					<div>loading...</div>
				) : (
					<>
						<h1>Edit Property</h1>
						<div className="create-layer-content">
							<h2 className="create-layer-sub-heading">Name</h2>
							<input
								className="create-layer-input"
								type="text"
								value={edit?.key ?? ""}
								onChange={(event) =>
									setEdit({ ...edit, key: event.target.value })
								}
							/>
							<h2 className="create-layer-sub-heading">Value</h2>
							<input
								className="create-layer-input"
								value={edit?.value}
								onChange={(event) =>
									setEdit({ ...edit, value: event.target.value })
								}
							/>
						</div>
						<div className="create-layer-buttons">
							<button
								type="button"
								className="create-layer-button"
								onClick={() => handleClose()}
							>
								Close
							</button>
							<button
								type="button"
								className="create-layer-button"
								onClick={() => handleUpdate()}
							>
								Update
							</button>
						</div>
					</>
				)}
			</>
		</dialog>,
		document.body,
	);

	return (
		<>
			<div className="properties-container">
				{isLoading ? (
					<span>Loading</span>
				) : (
					<div>
						{Object.entries(data?.properties ?? {}).map(([key, value]) => (
							<button
								key={key}
								onClick={() => setEdit({ key, value })}
								className="object-property"
								type="button"
							>
								<div>
									{key}: {value}
								</div>
							</button>
						))}
					</div>
				)}
			</div>
			{edit && layerDialog}
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

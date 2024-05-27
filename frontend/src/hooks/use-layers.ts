import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Layer } from "@nice-tile-server/types";

const createKey = (mapId: string | null) => ["layers", mapId];

export default function useLayers(mapId: string | null, onSuccess: (layers: Layer[]) => void): {
	mapLayers: Layer[] | undefined;
	isMapLayersLoading: boolean;
	invalidateLayers: () => void;
	createMapLayer: (layer: Layer) => Promise<void>;
} {
	const queryClient = useQueryClient();

	const invalidateLayers = () => {
		queryClient.invalidateQueries({ queryKey: createKey(mapId) });
	};

	const queryFn = async () => {
		const response = await getMapLayers(mapId);
		onSuccess(response);
		return response;
	}

	const { data, isLoading, isFetching } = useQuery({
		queryKey: createKey(mapId),
		queryFn,
		enabled: mapId != null,
	});

	return {
		mapLayers: data,
		isMapLayersLoading: isLoading || isFetching,
		createMapLayer,
		invalidateLayers,
	};
}

async function getMapLayers(mapId: string | null) {
	if (mapId == null) {
		return undefined;
	}

	const response = await fetch(`http://localhost:3000/layers/${mapId}`);
	return response.json();
}

async function createMapLayer(layer: Layer) {
	await fetch("http://localhost:3000/layers", {
		method: "Post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(layer),
	});
}

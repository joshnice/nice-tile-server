import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Layer, MapTile, Map } from "@nice-tile-server/types";
import { useEffect, useRef, type MutableRefObject } from "react";
import { BehaviorSubject, Subject, pairwise } from "rxjs";

const createKey = (mapId: string | null) => ["layers", mapId];

export default function useLayers($selectedMap: BehaviorSubject<Map | MapTile | null>): {
	mapLayers: Layer[] | undefined;
	isMapLayersLoading: boolean;
	$selectedLayer: MutableRefObject<BehaviorSubject<Layer | null>>;
	$onLayersLoaded: MutableRefObject<Subject<Layer[]>>;
	createMapLayer: (layer: Layer) => Promise<void>;
	invalidateLayers: (mapId?: string) => Promise<void>
} {
	const queryClient = useQueryClient();

	const $onLayersLoaded = useRef<Subject<Layer[]>>(new Subject<Layer[]>());

	useEffect(() => {
		const sub = $selectedMap.pipe(pairwise()).subscribe(([previousSelectedMap]) => {
			if (previousSelectedMap != null) {
				invalidateLayers(previousSelectedMap?.mapId);
			}
		});
		return () => {
			sub.unsubscribe();
		}
	}, []);

	const $selectedLayer = useRef<BehaviorSubject<Layer | null>>(new BehaviorSubject<Layer | null>(null));

	const invalidateLayers = async (id: string | undefined = $selectedMap.value?.id) => {
		if (id != null) {
			await queryClient.invalidateQueries({ queryKey: createKey(id) });
		}
	};

	const queryFn = async () => {
		if ($selectedMap.value != null) {
			const response = await getMapLayers($selectedMap.value.mapId);
			$onLayersLoaded.current.next(response);
			return response;
		}
		return undefined;
	}

	const { data, isLoading, isFetching } = useQuery({
		queryKey: createKey($selectedMap.value?.mapId as string),
		queryFn,
		enabled: $selectedMap.value?.id != null,
	});

	const handleCreateLayer = async (layer: Layer) => {
		if ($selectedMap.value != null) {
			queryClient.setQueryData<Layer[]>(createKey($selectedMap.value.mapId), (data) => {
				if (data == null) {
					return [layer];
				}
				return [...data, layer];
			})
			await createMapLayer(layer);
		}
	}

	return {
		mapLayers: data,
		isMapLayersLoading: isLoading || isFetching,
		$selectedLayer,
		$onLayersLoaded,
		createMapLayer: handleCreateLayer,
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

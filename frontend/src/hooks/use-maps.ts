import type { Map, MapTile } from "@nice-tile-server/types"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, type MutableRefObject } from "react";
import { BehaviorSubject } from "rxjs";

const KEY = ["maps"];

export default function useMaps(
): {
	maps: Map[] | undefined;
	isMapsLoading: boolean;
	$selectedMap: MutableRefObject<BehaviorSubject<Map | MapTile | null>>;
	createMap: (id: string, name: string) => Promise<void>;
	invalidateMaps: () => void;
} {
	const queryClient = useQueryClient();

	const $selectedMap = useRef(new BehaviorSubject<Map | MapTile | null>(null));

	const queryFn = async () => {
		const response = await getMaps();
		if ($selectedMap.current.value == null) {
			$selectedMap.current.next(response[0]);
		}
		return response;
	};

	const invalidateMaps = () => {
		queryClient.invalidateQueries({ queryKey: KEY });
	};

	const { data, isLoading, isFetching } = useQuery({ queryKey: KEY, queryFn });

	return {
		maps: data,
		isMapsLoading: isLoading || isFetching,
		$selectedMap,
		createMap,
		invalidateMaps,
	};
}

async function getMaps(): Promise<Map[]> {
	const response = await fetch("http://localhost:3000/maps");
	return response.json();
}

async function createMap(id: string, name: string) {
	await fetch("http://localhost:3000/maps", {
		method: "Post",
		body: JSON.stringify({ id, name }),
		headers: { "Content-Type": "application/json" },
	});
}

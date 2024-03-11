import { useQuery, useQueryClient } from "@tanstack/react-query";

const KEY = ["maps"];

export default function useMaps(
	onSuccess?: (maps: { id: string; name: string }[]) => void,
): {
	maps: { id: string; name: string }[];
	isMapsLoading: boolean;
	createMap: (id: string, name: string) => Promise<void>;
	invalidateMaps: () => void;
} {
	const queryClient = useQueryClient();

	const queryFn = async () => {
		const response = await getMaps();
		onSuccess?.(response);
		return response;
	};

	const invalidateMaps = () => {
		queryClient.invalidateQueries({ queryKey: KEY });
	};

	const { data, isLoading, isFetching } = useQuery({ queryKey: KEY, queryFn });

	return {
		maps: data,
		isMapsLoading: isLoading || isFetching,
		createMap,
		invalidateMaps,
	};
}

async function getMaps() {
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

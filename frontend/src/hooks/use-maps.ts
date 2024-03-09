import { useQuery } from "@tanstack/react-query";

export default  function useMaps(onSuccess?: (maps: {id: string, name: string}[]) => void): {maps: {id: string, name: string}[], isMapsLoading: boolean } {
    const queryFn = async () => {
        const response = await getMaps();
        onSuccess?.(response);
        return response;
    }
    
    const { data, isLoading } = useQuery({queryKey: ["maps123"], queryFn });
    return { maps: data, isMapsLoading: isLoading };
}

async function getMaps() {
    const response = await fetch("http://localhost:3000/maps");
    return response.json();
}


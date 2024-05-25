import { downLoadJsonFile } from "../helpers/download-file-helpers";

export default function useGeoJSON() {
    return { downloadLayer: downloadGeojsonForLayer }
}

async function downloadGeojsonForLayer(layerId: string) {
    const response = await fetch(`http://localhost:3000/geojson/${layerId}`);
    const layerGeojson = await response.json();
    downLoadJsonFile(layerGeojson, layerId);
}
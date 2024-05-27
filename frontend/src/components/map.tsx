import type { CreateLayer, Layer } from "@nice-tile-server/types";
import type { RandomObjectProperty } from "../types/properties";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { Mapbox } from "../mapbox/mapbox";
import MapControlsComponent from "./map-controls";
import { Api } from "../mapbox/api";
import useMaps from "../hooks/use-maps";
import useLayers from "../hooks/use-layers";
import useObjectSelected from "../hooks/use-object-selected";
import PropertiesComponent from "./properties";
import RandomObjectsComponent from "./random-objects";
import useGeoJSON from "../hooks/use-geojson";

const baseUrl = "http://localhost:3000";

export default function MapComponent() {
	// Map
	const map = useRef<Mapbox | null>();
	const mapElement = useRef<HTMLDivElement>(null);

	// Controls
	const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
	const [selectedMap, setSelectedMap] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [randomObjects, setRandomObjects] = useState<boolean>(false);

	// Map state
	const selectedMapRef = useRef<string | null>();
	selectedMapRef.current = selectedMap?.id;
	const initialLayers = useRef(false);

	const onMapsSuccess = (maps: { id: string; name: string }[]) => {
		if (selectedMapRef.current == null && maps[0] != null) {
			handleMapSelected(maps[0]);
		}
	};

	const onLayersSuccess = (layers: Layer[]) => {
		if (!initialLayers.current) {
			layers.forEach((layer) => {
				map.current?.addLayer(layer);
			});
		}
		initialLayers.current = true;
	};

	// Hooks

	const { maps, isMapsLoading, createMap, invalidateMaps } =
		useMaps(onMapsSuccess);

	const { mapLayers, isMapLayersLoading, createMapLayer, invalidateLayers } =
		useLayers(selectedMap?.id ?? null, onLayersSuccess);

	const { selectedObject, onObjectSelected } = useObjectSelected();

	const { downloadLayer } = useGeoJSON();

	// External events

	const handleLayerSelected = (id: string) => {
		if (selectedLayer === id) {
			setSelectedLayer(null);
		} else {
			setSelectedLayer(id);
		}
		map.current?.onLayerSelected(id);
	};

	const handleMapSelected = (selectedMap: { id: string; name: string }) => {
		map.current?.destory?.();
		if (mapElement.current != null) {
			map.current = new Mapbox({
				containerElement: mapElement.current,
				api: new Api(selectedMap.id, baseUrl),
				events: {
					onObjectClicked: onObjectSelected,
				},
			});
			initialLayers.current = false;
			setSelectedMap(selectedMap);
		}
	};

	const handleMapCreate = async () => {
		const map = { id: uuid(), name: `New Map ${maps.length}` };
		await createMap(map.id, map.name);
		invalidateMaps();
		handleMapSelected(map);
	};

	const handleLayerCreate = async (layer: CreateLayer) => {
		if (selectedMapRef.current == null) {
			return;
		}

		const layerId = uuid();
		const newLayer = {
			...layer,
			id: layerId,
			mapId: selectedMapRef.current,
		};

		map.current?.addLayer(newLayer);

		await createMapLayer(newLayer);
		invalidateLayers();
		handleLayerSelected(newLayer.id);
	};

	const handleRandomPointsSelected = () => {
		setRandomObjects(true);
	};

	const handleRandomObjects = (
		layerId: string,
		amount: number,
		properties: RandomObjectProperty[],
	) => {
		setSelectedLayer(null);
		map.current?.onRandomObjectsSelected(layerId, amount, properties);
		setRandomObjects(false);
	};

	const handleDownloadLayer = (layerId: string | null) => {
		if (layerId) {
			downloadLayer(layerId);
		}
	}

	// Clean up

	useEffect(() => {
		return () => {
			map.current?.destory?.();
			map.current = null;
		};
	}, []);

	return (
		<>
			{selectedMap && !isMapsLoading && !isMapLayersLoading && (
				<MapControlsComponent
					maps={maps}
					selectedMap={selectedMap}
					selectedLayer={selectedLayer}
					mapLayers={mapLayers}
					onLayerCreated={handleLayerCreate}
					onMapCreatedClick={handleMapCreate}
					onMapSelected={handleMapSelected}
					onLayerSelected={handleLayerSelected}
					onRandomPointsSelected={handleRandomPointsSelected}
					donwloadLayer={handleDownloadLayer}
				/>
			)}
			<div className="mapbox-map" ref={mapElement} />
			{selectedObject != null && (
				<PropertiesComponent selectedObjectId={selectedObject} />
			)}
			{randomObjects && (
				<RandomObjectsComponent
					open={randomObjects}
					layers={mapLayers ?? []}
					onSubmit={handleRandomObjects}
					onClose={() => setRandomObjects(false)}
				/>
			)}
		</>
	);
}

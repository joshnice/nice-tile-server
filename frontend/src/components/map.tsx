import type { Layer, LayerType } from "@nice-tile-server/types";
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
import useMapLoaded from "../hooks/use-map-loaded";
import { createFillStyle, createLineStyle, createPointStyle } from "../helpers/style-helpers";

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

		const addLayersToMap = (layers: Layer[]) => {
			layers.forEach((layer) => {
				map.current?.addLayer(layer);
			});
		}

		if (!initialLayers.current) {
			// Map has already loaded and we need to add layers
			if ($mapLoaded.current.value) {
				addLayersToMap(layers);

			} else {
				// Map has not already loaded so wait for the map to load and then add the layers
				const sub = $mapLoaded.current.subscribe((value) => {
					if (value) {
						addLayersToMap(layers);
						sub.unsubscribe();
					}
				});
			}
		}

		initialLayers.current = true;
	};

	// Hooks

	const { maps, isMapsLoading, createMap, invalidateMaps } =
		useMaps(onMapsSuccess);

	const { mapLayers, isMapLayersLoading, createMapLayer, invalidateLayers } =
		useLayers(selectedMap?.id ?? null, onLayersSuccess);

	const { selectedObject, onObjectSelected } = useObjectSelected();

	const { $mapLoaded } = useMapLoaded();

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
		$mapLoaded.current.next(false);

		if (mapElement.current != null) {
			map.current = new Mapbox({
				containerElement: mapElement.current,
				api: new Api(selectedMap.id, baseUrl),
				events: {
					onObjectClicked: onObjectSelected,
					onMapLoaded: $mapLoaded.current
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

	const handleLayerCreate = async (type: LayerType, name: string) => {
		if (selectedMapRef.current == null) {
			return;
		}

		const layerId = uuid();

		const baseLayer = {
			name,
			id: layerId,
			mapId: selectedMapRef.current,
		}

		let layer: Layer;

		switch (type) {
			case "Fill":
				layer = {
					...baseLayer,
					type: "Fill",
					style: createFillStyle(),
				}
				break;
			case "Line":
				layer = {
					...baseLayer,
					type: "Line",
					style: createLineStyle(),
				}
				break;
			case "Point":
				layer = {
					...baseLayer,
					type: "Point",
					style: createPointStyle(),
				}
				break;
			default:
				throw new Error(`Layer type: ${type} not handled`);
		}

		map.current?.addLayer(layer);
		await createMapLayer(layer);
		invalidateLayers();
		handleLayerSelected(layer.id);
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

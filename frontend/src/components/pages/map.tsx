import type { Layer, LayerType, MapTile, Map } from "@nice-tile-server/types";
import type { RandomObjectProperty } from "../../types/properties";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { Mapbox } from "../../mapbox/mapbox";
import MapControlsComponent from "../map/map-controls";
import { Api } from "../../mapbox/api";
import useMaps from "../../hooks/use-maps";
import useLayers from "../../hooks/use-layers";
import useObjectSelected from "../../hooks/use-object-selected";
import PropertiesComponent from "../property/properties";
import RandomObjectsComponent from "../object/random-objects";
import useGeoJSON from "../../hooks/use-geojson";
import useMapLoaded from "../../hooks/use-map-loaded";
import { createFillStyle, createLineStyle, createPointStyle } from "../../helpers/style-helpers";
import useMapTiles from "../../hooks/use-map-tiles";
import { GlobalContext } from "../../context/global-context";

const baseUrl = "http://localhost:3000";

export default function MapPageComponent() {
	// Force renrender of component when map is changed
	const [rerender, setRerender] = useState(false);

	// Map
	const map = useRef<Mapbox | null>();
	const mapElement = useRef<HTMLDivElement>(null);

	// Controls
	const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

	const [randomObjects, setRandomObjects] = useState<boolean>(false);

	// Map state
	const initialLayers = useRef(false);

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

	const { maps, isMapsLoading, $selectedMap, createMap, invalidateMaps } = useMaps();

	useEffect(() => {
		const sub = $selectedMap.current.subscribe((value) => {
			if (value != null) {
				handleMapSelected(value);
			}
		});
		return () => {
			sub.unsubscribe();
		}
	}, [$selectedMap.current]);

	const { createMapTiles, mapTiles } = useMapTiles();

	const { mapLayers, isMapLayersLoading, createMapLayer, invalidateLayers } =
		useLayers($selectedMap.current.value?.mapId ?? null, onLayersSuccess);

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

	const handleMapSelected = (newlySelectedMap: Map | MapTile) => {
		invalidateLayers();
		map.current?.destory?.();
		$mapLoaded.current.next(false);
		initialLayers.current = false;

		if (mapElement.current != null) {
			map.current = new Mapbox({
				containerElement: mapElement.current,
				api: new Api(newlySelectedMap.mapId, baseUrl),
				mapType: newlySelectedMap.type,
				events: {
					onObjectClicked: onObjectSelected,
					onMapLoaded: $mapLoaded.current
				},
			});

			setRerender(!rerender);
		}
	};

	const handleMapCreate = async () => {
		const mapId = uuid()
		const map: Map = { id: mapId, name: `New Map ${maps?.length}`, type: "map", mapId: mapId };
		await createMap(map.id, map.name);
		invalidateMaps();
		$selectedMap.current.next(map);
	};

	const handleLayerCreate = async (type: LayerType, name: string) => {

		if ($selectedMap.current.value == null) {
			throw new Error("Selected map not set");
		}

		const baseLayer = {
			name,
			id: uuid(),
			mapId: $selectedMap.current.value?.id,
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

	const handleMakeMapTiles = () => {
		if ($selectedMap.current.value == null) {
			throw new Error("No map selected");
		}
		createMapTiles($selectedMap.current.value?.id);
	}

	// Clean up

	useEffect(() => {
		return () => {
			map.current?.destory?.();
			map.current = null;
		};
	}, []);

	return (
		<GlobalContext.Provider value={{ $selectedMap: $selectedMap.current }}>
			{$selectedMap.current.value && !isMapsLoading && maps != null && mapTiles != null && !isMapLayersLoading && (
				<MapControlsComponent
					maps={maps}
					mapTiles={mapTiles}
					selectedLayer={selectedLayer}
					mapLayers={mapLayers}
					onLayerCreated={handleLayerCreate}
					onMapCreatedClick={handleMapCreate}
					onLayerSelected={handleLayerSelected}
					onRandomPointsSelected={handleRandomPointsSelected}
					downloadLayer={handleDownloadLayer}
					makeMapTiles={handleMakeMapTiles}
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
		</GlobalContext.Provider>
	);
}

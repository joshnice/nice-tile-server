import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { Mapbox } from "./mapbox/mapbox";
import MapControlsComponent, { Control } from "./map-controls";
import { Api } from "./mapbox/api";
import useMaps from "./hooks/use-maps";
const baseUrl = "http://localhost:3000"

export default function MapComponent() {

    // Map
    const map = useRef<Mapbox | null>();
    const mapElement = useRef<HTMLDivElement>(null);

    // Controls
    const [selectedControl, setSelectedControl] = useState<Control | null>(null);
    const [selectedMap, setSelectedMap] = useState<string | null>(null);
    const selectedMapRef = useRef<string | null>();
    selectedMapRef.current = selectedMap; 

    const onMapsSuccess = (maps: {id: string, name: string}[]) => {
        if (selectedMapRef.current == null && maps[0] != null ) {
            handleMapSelected(maps[0].id);
        }
    }

    const { maps, isMapsLoading, createMap, invalidateMaps } = useMaps(onMapsSuccess);

    const handleDrawingClicked = (type: Control) => {
        if (selectedControl === type) {
            setSelectedControl(null);
        } else {
            setSelectedControl(type);
        }
        map.current?.onDrawingClicked(type);
    }

    const handleMapSelected = (id: string) => {
        map.current?.destory?.();
        if (mapElement.current != null) {
            map.current = new Mapbox({containerElement: mapElement.current, api: new Api(id, baseUrl)});
            setSelectedMap(id);
        }
    }

    const handleMapCreate = async () => {
        const mapId = uuid();
        await createMap(mapId, `New Map ${maps.length}`);
        invalidateMaps();
        handleMapSelected(mapId);
    }

    useEffect(() => {
        return () => {  
            map.current?.destory?.();
            map.current = null;
        }
    }, []);

    return (
        <>
            {selectedMap && !isMapsLoading && 
                            <MapControlsComponent
                                maps={maps}
                                selectedMap={selectedMap}
                                selectedControl={selectedControl}
                                onMapCreatedClick={handleMapCreate}
                                onMapSelected={handleMapSelected}
                                onControlClick={handleDrawingClicked}
                            /> 
            }
            <div className="mapbox-map" ref={mapElement} />
        </>
    )

}
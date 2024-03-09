import { useEffect, useRef, useState } from "react";
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

    const onMapsSuccess = (maps: {id: string, name: string}[]) => {
        if (selectedMap == null && maps[0] != null ) {
            handleMapSelected(maps[0].id);
        }
    }

    const { maps } = useMaps(onMapsSuccess);

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

    useEffect(() => {
        return () => {  
            map.current?.destory?.();
            map.current = null;
        }
    }, []);

  
    return (
        <>
            {selectedMap && <MapControlsComponent maps={maps} selectedMap={selectedMap} selectedControl={selectedControl} onMapSelected={handleMapSelected} onControlClick={handleDrawingClicked} /> }
            <div className="mapbox-map" ref={mapElement} />
        </>
    )

}
import { useEffect, useRef, useState } from "react";
import { Mapbox } from "./mapbox/mapbox";
import MapControlsComponent, { Control } from "./map-controls";
import { Api } from "./mapbox/api";

const mapId = "86b86b93-7842-4e4c-82a2-8fee8da01a60";
const baseUrl = "http://localhost:3000"

export default function MapComponent() {

    const map = useRef<Mapbox | null>();

    const [mapReady, setMapReady] = useState(false);
    const [selectedControl, setSelectedControl] = useState<Control | null>(null);

    const handleMapRender = (containerElement: HTMLDivElement) => {
        if (map.current == null && containerElement != null) {
            map.current = new Mapbox({containerElement, api: new Api(mapId, baseUrl)});
            setMapReady(true);
        }
    }

    const handleDrawingClicked = (type: Control) => {
        if (selectedControl === type) {
            setSelectedControl(null);
        } else {
            setSelectedControl(type);
        }
        map.current?.onDrawingClicked(type);
    }

    useEffect(() => {
        return () => {  
            map.current?.destory?.();
            map.current = null;
        }
    }, []);

  
    return (
        <>
            {mapReady && <MapControlsComponent selectedControl={selectedControl} onControlClick={handleDrawingClicked} /> }
            <div className="mapbox-map" ref={handleMapRender} />
        </>
    )

}
import { useEffect, useRef, useState } from "react";
import { Mapbox } from "./mapbox";
import MapControlsComponent from "./map-controls";
import { Api } from "./api";

const mapId = "86b86b93-7842-4e4c-82a2-8fee8da01a60";
const baseUrl = "http://localhost:3000"

export default function MapComponent() {

    const map = useRef<Mapbox | null>();
    const [mapReady, setMapReady] = useState(false);

    const handleMapRender = (containerElement: HTMLDivElement) => {
        if (map.current == null && containerElement != null) {
            map.current = new Mapbox({containerElement, api: new Api(mapId, baseUrl)});
            setMapReady(true);
        }
    }

    const handleDrawingClicked = (type: "Point" | "Line" | "Area") => {
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
            {mapReady && <MapControlsComponent onControlClick={handleDrawingClicked} /> }
            <div className="mapbox-map" ref={handleMapRender} />
        </>
    )

}
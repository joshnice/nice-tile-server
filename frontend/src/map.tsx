import { useEffect, useRef, useState } from "react";
import { Mapbox } from "./mapbox";
import MapControlsComponent from "./map-controls";

export default function MapComponent() {

    const map = useRef<Mapbox | null>();
    const [mapReady, setMapReady] = useState(false);

    const handleMapRender = (containerElement: HTMLDivElement) => {
        if (map.current == null && containerElement != null) {
            map.current = new Mapbox(containerElement);
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
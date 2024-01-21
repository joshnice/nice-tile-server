import { useEffect, useRef, useState } from "react";
import { Mapbox } from "./mapbox";

export default function MapComponent() {

    const map = useRef<Mapbox | null>();
    const [mapReady, setMapReady] = useState(false);

    const handleMapRender = (containerElement: HTMLDivElement) => {
        if (map.current == null && containerElement != null) {
            map.current = new Mapbox(containerElement);
            setMapReady(true);
        }
    }

    useEffect(() => {
        return () => {  
            map.current?.destory?.();
            map.current = null;
        }
    }, []);

  
    return (
      <div className="mapbox-map" ref={handleMapRender} />
    )

}
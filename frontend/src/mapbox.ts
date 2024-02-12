import { Map, ResourceType } from "mapbox-gl";

export class Mapbox {

    private readonly map: Map;

    constructor(mapContainerElement: HTMLDivElement) {
        console.log("mapContainerElement", mapContainerElement);
        this.map = new Map({
            container: mapContainerElement,
            center: [-0.54588, 53.22821], 
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 15,
            testMode: true,
            accessToken: "pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJja2VtcnFwNGQwbXdnMndvODNzYm9wNzE3In0.hNLvS8f4FVGbgnwF7Xepow",
            hash: true,
        });

        this.map.showTileBoundaries = true; 

        this.map.on("click", (e) => {
            console.log("e", e.lngLat);
        });

        this.map.once("load", () => {
            const sourceId = "vector-tile-source";
            this.map.addSource(sourceId, { type: "vector", tiles: ["http://localhost:3000/objects/{z}/{x}/{y}"] });
    
            this.map.addLayer({ 
                id: "layer",
                type: "circle",
                source: sourceId,
                "source-layer": "layer_a",
                paint: { "circle-color": "red" },
            });

            console.log(this.map.getStyle().layers);
        });

       
    }

    public onDrawingClicked(type: "Point" | "Line" | "Area") {
        console.log("type", type);
    }

    public destory() {
        this.map.remove();
    }
}
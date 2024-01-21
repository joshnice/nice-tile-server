import { Map } from "mapbox-gl";

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
            hash: true
        });
    }

    public destory() {
        this.map.remove();
    }
}
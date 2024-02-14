import { Drawing } from "./drawing";
import { createPointFeature } from "../../geojson-helpers";

export class PointDrawing extends Drawing {
    
    public addEventListeners(): void {
        this.onClick();
    }

    public onClick(): void {
        this.map.on("click", async (event) => {
            const pointObject = createPointFeature(event.lngLat.toArray());
            await this.api.createObject(pointObject);
            this.refreshTiles();
        });
    }

}
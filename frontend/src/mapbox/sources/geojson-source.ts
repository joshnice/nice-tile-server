import {  GeoJSONSource as GeoJsonMapboxSource, GeoJSONSourceRaw as GeoJsonRawMapbox } from "mapbox-gl";
import { Feature, Point } from "geojson";
import { Source } from "./source";

export class GeoJsonSource extends Source<GeoJsonRawMapbox, GeoJsonMapboxSource, null, Feature> {

    private features: Feature<Point>[] = [];

    public createSource(): GeoJsonRawMapbox {
        return {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
        };
    }

    public updateSource(feature: Feature<Point>): void {
        const source = this.getSource();
        this.features.push(feature);
        source.setData({ type: "FeatureCollection", features: this.features });
    }
}
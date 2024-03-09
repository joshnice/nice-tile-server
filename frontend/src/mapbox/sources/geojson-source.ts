import {  GeoJSONSource as GeoJsonMapboxSource, GeoJSONSourceRaw as GeoJsonRawMapbox } from "mapbox-gl";
import { Feature, Point, LineString } from "geojson";
import { Source } from "./source";

export class GeoJsonSource extends Source<GeoJsonRawMapbox, GeoJsonMapboxSource, null, Feature> {

    private features: Feature<Point | LineString>[] = [];

    public createSource(): GeoJsonRawMapbox {
        return {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
        };
    }

    public resetSource(): void {
        const source = this.getSource();
        this.features = [];
        source.setData({ type: "FeatureCollection", features: this.features })
    }

    public updateSource(feature: Feature<Point | LineString>): void {
        const source = this.getSource();
        this.features.push(feature);
        source.setData({ type: "FeatureCollection", features: this.features });
    }

    public overwriteSource(feature: Feature<Point | LineString>): void {
        const source = this.getSource();
        this.features = [feature];
        source.setData({ type: "FeatureCollection", features: this.features });
    }
}
import {  GeoJSONSource as GeoJsonMapboxSource, GeoJSONSourceRaw as GeoJsonRawMapbox } from "mapbox-gl";
import { Feature, Point, LineString, Polygon } from "geojson";
import { Source } from "./source";

type AllGeometry = Point | LineString | Polygon;

export class GeoJsonSource extends Source<GeoJsonRawMapbox, GeoJsonMapboxSource, null, Feature> {

    private features: Feature<AllGeometry>[] = [];

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

    public updateSource(feature: Feature<AllGeometry>): void {
        const source = this.getSource();
        this.features.push(feature);
        source.setData({ type: "FeatureCollection", features: this.features });
    }

    public overwriteSource(feature: Feature<AllGeometry>): void {
        const source = this.getSource();
        this.features = [feature];
        source.setData({ type: "FeatureCollection", features: this.features });
    }
}
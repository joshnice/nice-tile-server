import type { CirclePaint, FillPaint, LineLayout, LinePaint } from "mapbox-gl";

export interface BaseStyle {
    colour: FillPaint["fill-color"] | LinePaint["line-color"] | CirclePaint["circle-color"];
    opacity: FillPaint["fill-opacity"] | LinePaint["line-opacity"] | CirclePaint["circle-opacity"];
}

export interface FillStyle extends BaseStyle {}

export interface LineStyle extends BaseStyle {
    width: LinePaint["line-width"];
    join: LineLayout["line-join"];
    cap: LineLayout["line-cap"];
}

export interface CircleStyle extends BaseStyle {
    radius: CirclePaint["circle-radius"];
    outlineWidth: CirclePaint["circle-stroke-width"];
}

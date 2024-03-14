export interface BaseStyle {
    colour: string;
    opacity: number;
}

export interface FillStyle extends BaseStyle {}

export interface LineStyle extends BaseStyle {
    width: number;
}

export interface CircleStyle extends BaseStyle {
    radius: number;
}

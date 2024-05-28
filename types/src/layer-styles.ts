export type AllStyles = FillStyle | LineStyle | PointStyle;

export interface BaseStyle {
    colour: string;
    opacity: number;
};

export interface FillStyle extends BaseStyle { }

export interface LineStyle extends BaseStyle {
    size: number;
    join?: "round",
    cap?: "round",
}

export interface PointStyle extends BaseStyle {
    colour: string;
    opacity: number;
    size: number;
    outlineWidth?: number;
}
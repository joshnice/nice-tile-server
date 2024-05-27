export type AllStyles = Partial<FillStyle & LineStyle & PointStyle>;

export interface FillStyle {
    colour: string;
    opacity: number;
}

export interface LineStyle {
    colour: string;
    opacity: number;
    size: number;
}

export interface PointStyle {
    colour: string;
    opacity: number;
    size: number;
}
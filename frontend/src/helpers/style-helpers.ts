import type { AllStyles, FillStyle, LayerType, LineStyle, PointStyle } from "@nice-tile-server/types";

export function createRandomColour() {
    const n = (Math.random() * 0xfffff * 1000000).toString(16);
    return `#${n.slice(0, 6)}`;
};

export function createFillStyle(): FillStyle {
    return {
        colour: createRandomColour(),
        opacity: 0.7
    }
}

export function createLineStyle(): LineStyle {
    return {
        colour: createRandomColour(),
        opacity: 0.7,
        size: 10
    }
}

export function createPointStyle(): PointStyle {
    return {
        colour: createRandomColour(),
        opacity: 0.7,
        size: 10
    }
}
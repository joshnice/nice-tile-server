import type { LayerType } from "@nice-tile-server/types";

export function createRandomColour() {
    const n = (Math.random() * 0xfffff * 1000000).toString(16);
    return `#${n.slice(0, 6)}`;
};

export function createStyle(type: LayerType) {
    switch (type) {
        case "Fill":
            return {
                colour: createRandomColour(),
                opacity: 0.7
            }
        case "Line":
            return {
                colour: createRandomColour(),
                opacity: 0.7,
                size: 10
            }
        case "Point":
            return {
                colour: createRandomColour(),
                opacity: 0.7,
                size: 10
            }
        default:
            throw new Error(`Type ${type} is not handled`);
    }
}
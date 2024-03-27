import type { RandomObjectStaticValue, RandomObjectRandomNumber, RandomObjectSetValue, PropertyType } from "../types/properties";
import { v4 as uuid } from "uuid"; 

export function createRandomObjectProperty(type: PropertyType) {
    switch (type) {
        case "randomNumber":
            return createRandomNumber();
        case "setValue":
            return createSetValue();
        case "staticValue":
            return createStaticValue();
        default:
            throw new Error("Type not handled");
    }
}

export function createStaticValue(): RandomObjectStaticValue {
    return {
        id: uuid(),
        name: "",
        type: "staticValue",
        value: "",
    }
}

export function createRandomNumber(): RandomObjectRandomNumber {
    return {
        id: uuid(),
        name: "",
        type: "randomNumber",
        lower: 0,
        upper: 10,
    }
}

export function createSetValue(): RandomObjectSetValue {
    return {
        id: uuid(),
        name: "",
        type: "setValue",
        values: [],
    }
}
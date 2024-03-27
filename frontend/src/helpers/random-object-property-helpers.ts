import type { RandomObjectStaticValue, RandomObjectRandomNumber, RandomObjectSetValue, PropertyType, RandomObjectProperty } from "../types/properties";
import { v4 as uuid } from "uuid"; 

export function createRandomObjectProperty(type: PropertyType) {
    switch (type) {
        case "randomNumber":
            return createDefaultStaticValue();
        case "setValue":
            return createDefaultandomNumber();
        case "staticValue":
            return createDefaultSetValue();
        default:
            throw new Error("Type not handled");
    }
}

function createDefaultStaticValue(): RandomObjectStaticValue {
    return {
        id: uuid(),
        name: "",
        type: "staticValue",
        value: "",
    }
}

function createDefaultandomNumber(): RandomObjectRandomNumber {
    return {
        id: uuid(),
        name: "",
        type: "randomNumber",
        lower: 0,
        upper: 10,
    }
}

function createDefaultSetValue(): RandomObjectSetValue {
    return {
        id: uuid(),
        name: "",
        type: "setValue",
        values: [],
    }
}

export function createRandomProperties(index: number, amount: number,  properties: RandomObjectProperty[]): Record<string, string | number> {
    const value: Record<string, string | number> = {};
    properties.forEach((property) => {
        value[property.name] = createRandomObjectPropertyValue(property, index, amount);
    });
    return value;
}

function createRandomObjectPropertyValue(property: RandomObjectProperty, index: number, amount: number): string | number {
    switch (property.type) {
        case "randomNumber":
            return createRandomNumber(property.lower, property.upper);
        case "setValue":
            return createSetValue(property.values, index, amount);
        case "staticValue":
            return property.value;
        default:
            throw new Error("Type not handled");
    }
}

export function createRandomNumber(upper: number, lower: number): number {
    return Math.floor(Math.random() * (upper - lower) ) + lower;
}

export function createSetValue(values: string[], index: number, amount: number): string {
    return "";
}
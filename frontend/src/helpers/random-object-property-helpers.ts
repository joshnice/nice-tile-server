import type { RandomObjectStaticValue, RandomObjectRandomNumber, RandomObjectSetValue, PropertyType, RandomObjectProperty } from "../types/properties";
import { v4 as uuid } from "uuid"; 

export function createRandomObjectProperty(type: PropertyType) {
    switch (type) {
        case "randomNumber":
            return createDefaultRandomNumber();
        case "setValue":
            return createDefaultSetValue();
        case "staticValue":
            return createDefaultStaticValue();
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

function createDefaultRandomNumber(): RandomObjectRandomNumber {
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

export function createRandomProperties(index: number,  properties: RandomObjectProperty[]): Record<string, string | number> {
    const value: Record<string, string | number> = {};
    properties.forEach((property) => {
        value[property.name] = createRandomObjectPropertyValue(property, index);
    });
    return value;
}

function createRandomObjectPropertyValue(property: RandomObjectProperty, valueNumber: number): string | number {
    switch (property.type) {
        case "randomNumber":
            return createRandomNumber(property.lower, property.upper);
        case "setValue":
            return createSetValue(property.values, valueNumber);
        case "staticValue":
            return property.value;
        default:
            throw new Error("Type not handled");
    }
}

export function createRandomNumber(upper: number, lower: number): number {
    return Math.floor(Math.random() * (upper - lower) ) + lower;
}

export function createSetValue(values: string[], valueNumber: number): string {
    const valueIndex = valueNumber % values.length;
    return values[valueIndex]; 
}
export type PropertyType = "staticValue" | "randomNumber" | "setValue";

interface RandomObjectPropertyBase {
    id: string;
    name: string;
    type: PropertyType;   
}

export interface RandomObjectStaticValue extends RandomObjectPropertyBase {
    type: "staticValue";
    value: string;
}

export interface RandomObjectRandomNumber extends RandomObjectPropertyBase {
    type: "randomNumber";
    lower: number;
    upper: number;
}

export interface RandomObjectSetValue extends RandomObjectPropertyBase {
    type: "setValue";
    values: string[];
}

export type RandomObjectProperty = RandomObjectStaticValue | RandomObjectRandomNumber | RandomObjectSetValue;


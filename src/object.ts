import * as deepmerge from 'deepmerge';
import { isArray, isObject } from './common';

interface IObject {
    [key: string]: any;
}

export function deepCompare(object1: IObject, object2: IObject): boolean {
    const keysOfA = Object.getOwnPropertyNames(object1);

    return keysOfA.every(propName => {
        const valueofA = object1[propName];
        const valueofB = object2[propName];

        if (isObject(valueofA) || isArray(valueofA)) {
            return deepCompare(valueofA, valueofB);
        }

        return (object2.hasOwnProperty(propName) && (valueofB === valueofA));
    });
}

export function deepMerge(...objects: Object[]) {
    return deepmerge.all(objects);
}
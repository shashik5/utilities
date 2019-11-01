import { isArray, isObject } from './common';

function checkProperties<T extends { [key: string]: any }>(a: T, b: T): boolean {
    const keysOfA = Object.getOwnPropertyNames(a);
    const keysOfB = Object.getOwnPropertyNames(b);

    if (keysOfA.length !== keysOfB.length) {
        return false;
    }

    return keysOfA.every(propName => {
        const valueofA = a[propName];
        const valueofB = b[propName];

        if (isObject(valueofA) || isArray(valueofA)) {
            return checkProperties(valueofA, valueofB);
        }

        if (!b.hasOwnProperty(propName) || valueofB !== valueofA) {
            return false;
        }

        return true;
    });
}

export function deepCompare<T extends Object>(object1: T, object2: T, reverseCheck?: boolean) {
    const flow = checkProperties(object1, object2);
    if (reverseCheck) {
        return flow && checkProperties(object2, object1);
    }
    return flow;
}
import { v1 } from 'uuid';

export function generateId() {
    return v1();
}

const typeOfNumber = typeof 0;
export function isNumber(value: any): value is number {
    return (!isNaN(value) && (typeof value === typeOfNumber));
}

const typeOfString = typeof '';
export function isString(value: any): value is string {
    return (typeof value === typeOfString);
}

export function isArray(value: any): value is Array<any> {
    return value instanceof Array;
}

export function isFunction(value: any): value is Function {
    return value instanceof Function;
}

export function isObject(value: any): value is object {
    return (value === Object(value) && !isArray(value) && !isFunction(value));
}

export function isNullOrUndefined<T>(value?: T): boolean {
    return (value === undefined || value === null);
}
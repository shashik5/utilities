import { CallbackFunction, IMemoizeNode } from './types';
import { isFunction, isObject } from '../common';

const EMPTY_OBJECT = { isEmpty: true };
const DICTIONARY: any = {};

function createNode(): IMemoizeNode {
    return {
        map: new WeakMap<object, IMemoizeNode>()
    };
}

function normalizeArg(val: any): object {
    if (!val) {
        return EMPTY_OBJECT;
    } else if (isObject(val) || isFunction(val)) {
        return val;
    } else if (!DICTIONARY[val]) {
        DICTIONARY[val] = { val };
    }

    return DICTIONARY[val];
}

export function memoizeFunction<CB extends CallbackFunction<R>, R>(callback: CB, maxCacheSize: number = 20): CB {

    let rootNode = createNode();
    let cacheSize = 0;

    return ((...args: any[]): R => {
        let currentNode: IMemoizeNode = rootNode;

        if (maxCacheSize > 0 && cacheSize > maxCacheSize) {
            currentNode = rootNode = createNode();
            cacheSize = 0;
        }

        args.forEach((rawArg) => {
            const arg = normalizeArg(rawArg);

            if (!currentNode.map.has(arg)) {
                currentNode.map.set(arg, createNode());
            }

            currentNode = currentNode.map.get(arg)!;
        });

        if (!currentNode.hasOwnProperty('value')) {
            currentNode.value = callback(...args);
            cacheSize++;
        }

        return currentNode.value;
    }) as CB;
}
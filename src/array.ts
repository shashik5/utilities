import { isArray, isString } from './common';

export function ensureArray<TItem>(item: TItem | TItem[]) {
    return isArray(item) ? item : [item];
}

export function eachSeries<T>(array: T[], iterator: (item: T, index: number, array: T[]) => Promise<any>) {
    let index = 0;
    async function next(): Promise<any> {
        if (index >= array.length) {
            return;
        }
        const currentIndex = index++;
        const item = array[currentIndex];
        return iterator(item, currentIndex, array).then(next);
    }
    return next();
}

export function mapSeries<T, TReturn>(array: T[], iterator: (item: T, index: number, array: T[]) => Promise<TReturn>): Promise<TReturn[]> {
    return new Promise((resolve, reject) => {

        const items = new Array<TReturn>();
        eachSeries(array, async (_item: T, _index: number, _array: T[]) => iterator(_item, _index, _array).then(res => { items.push(res); }))
            .then(() => resolve(items))
            .catch(reject);
    });
}

export function reduceSeries<TResult extends object, TItem>(
    array: TItem[],
    iterator: (result: TResult, currentItem: TItem) => Promise<TResult>,
    initialValue: TResult = (new Array()) as TResult
): Promise<TResult> {
    return new Promise((resolve, reject) => {
        let result: TResult = initialValue;
        eachSeries(array, async (currentItem) => iterator(result, currentItem).then(res => { result = res; }))
            .then(() => resolve(result))
            .catch(reject);
    });
}

function defaultUniquePropsSelector<TItem extends TUniqueValue, TUniqueValue>(item: TItem): TUniqueValue {
    return item;
}

type UniquePropSelectorFunction<TItem> = (item: TItem) => any;

export function unique<TItem>(array: TItem[], propSelector: UniquePropSelectorFunction<TItem> = defaultUniquePropsSelector): TItem[] {
    return array.filter((item, index) => {
        const uniqueValue = propSelector(item);
        return array.findIndex((i => propSelector(i) === uniqueValue)) === index;
    });
}

export function groupBy<TItem, TGroupKey = any, TGroupItem = any>
    (array: TItem[], keySelector: (item: TItem) => TGroupKey, valueSelector: (item: TItem) => TGroupItem) {
    return array.reduce((prev, curr) => {

        const groupKey = keySelector(curr);
        const groupValue = valueSelector(curr);

        const groupItems = prev.get(groupKey) || new Set();

        groupItems.add(groupValue);

        prev.set(groupKey, groupItems);
        return prev;
    }, new Map<TGroupKey, Set<TGroupItem>>());
}

function compareValues<TItem>(left: TItem, right: TItem): number {
    if (left === right) {
        return 0;
    }

    if (isString(left) && isString(right)) {
        return left.localeCompare(right, 'en', { sensitivity: 'base' }) > 0 ? 1 : -1;
    }
    return left > right ? 1 : -1;
}

export function sortBy<TItem>(array: TItem[], keySelector: (item: TItem) => any, descending: boolean = false) {
    return array.slice().sort((a, b) => {
        const left = keySelector(a);
        const right = keySelector(b);
        const result = compareValues(left, right);
        return descending ? (result * -1) : result;
    });
}
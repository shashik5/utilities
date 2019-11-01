import { isArray } from './common';

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
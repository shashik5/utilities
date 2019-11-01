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

export function mapSeries<T, TReturn>(array: T[], iterator: (item: T) => Promise<TReturn>): Promise<TReturn[]> {
    return new Promise((resolve, reject) => {

        const items = new Array<TReturn>();
        eachSeries(array, async (item) => iterator(item).then(res => { items.push(res); }))
            .then(() => resolve(items))
            .catch(reject);
    });
}

export function reduceSeries<TPrevItem extends object, TItem>(
    array: TItem[],
    iterator: (prevItem: TPrevItem, currentItem: TItem) => Promise<TPrevItem>,
    initialValue: TPrevItem = (new Array()) as TPrevItem
): Promise<TPrevItem> {
    return new Promise((resolve, reject) => {
        let prevItem: TPrevItem = initialValue;
        eachSeries(array, async (currentItem) => iterator(prevItem, currentItem).then(res => { prevItem = res; }))
            .then(() => resolve(prevItem))
            .catch(reject);
    });
}

function defaultUniquePropsSelector<TItem extends TUniqueValue, TUniqueValue>(item: TItem): TUniqueValue {
    return item;
}

type UniquePropSelectorFunction<TItem> = (item: TItem) => any;

export function unique<TItem, TUniqueValue>(array: TItem[], propSelector: UniquePropSelectorFunction<TItem> = defaultUniquePropsSelector): TItem[] {
    let uniqueValue: TUniqueValue;
    return array.filter((item, index) => {
        uniqueValue = propSelector(item);
        return array.findIndex((i => propSelector(i) === uniqueValue)) === index;
    });
}
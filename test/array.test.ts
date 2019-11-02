import * as assert from 'assert';
import { ensureArray, eachSeries, mapSeries, reduceSeries, unique } from '../src/array';

const list = [1, 2, 3, 4];
async function asyncLoop(item: any) {
    return new Promise((resolve) => {
        setTimeout(resolve, 10, item);
    });
}

async function asyncReduce(result: number[], item: number) {
    return result.concat(item * 2);
}

async function asyncFailingLoop(item: any, index: number) {
    return new Promise<any>((resolve, reject) => {
        if (index === 2) {
            setTimeout(reject, 10, 'Failed to handle breaking condition');
        }
        setTimeout(resolve, 10, item);
    });
}

describe('Array', () => {
    describe('Ensure array', () => {
        it('Valid values', () => {
            const testValue = [1, 2, 3];
            const res = ensureArray(testValue);
            assert.strictEqual(testValue, res);
        });

        it('Invalid values', () => {
            const testValue = {};
            const [res] = ensureArray(testValue);
            assert.strictEqual(testValue, res);
        });
    });

    describe('Each series', () => {
        it('Valid loops', (done) => {
            let loopCounter = 0;
            eachSeries(list, async (item) => {
                loopCounter++;
                return asyncLoop(item);
            }).then(() => {
                done(list.length === loopCounter ? undefined : 'Not all iterations completed');
            }).catch(done);
        });

        it('Breaking loops', (done) => {
            eachSeries(list, asyncFailingLoop).then(done).catch(() => done());
        });
    });

    describe('Map series', () => {
        it('valid loops', (done) => {
            mapSeries(list, asyncLoop).then((res) => {
                done(list.length === res.length ? undefined : 'Not all results fetched');
            }).catch(done);
        });

        it('Breaking loops', (done) => {
            mapSeries(list, asyncFailingLoop).then(() => done('Failed to handle breaking condition')).catch(() => done());
        });
    });

    describe('Reduce series', () => {
        it('Valid loops', (done) => {
            reduceSeries(list, asyncReduce, []).then((res) => {
                const [resultFirstItem] = res;
                const [listFirstItem] = list;
                done(((list.length === res.length) && (resultFirstItem === (listFirstItem * 2))) ? undefined : 'Not all results fetched');
            }).catch(done);
        });

        it('Breaking loops', (done) => {
            mapSeries(list, asyncFailingLoop).then(() => done('Failed to handle breaking condition')).catch(() => done());
        });
    });

    describe('Unique', () => {
        it('Value array', () => {
            const sample = [1, 2, 3, 4, 5, 3, 3, 36];
            const uniqueList = unique(sample);
            assert.notStrictEqual(uniqueList.length, sample.length);
            assert.strictEqual(uniqueList.length, 6);
        });

        it('Value array with custom prop selector', () => {
            const sample = [1, 2, 3, 4, 5, 3, 3, 36];
            const uniqueList = unique(list, () => undefined);
            assert.notStrictEqual(uniqueList.length, sample.length);
            assert.strictEqual(uniqueList.length, 1);
        });

        it('Object array', () => {
            const sample = [{ i: 1 }, { i: 2 }, { i: 3 }, { i: 4 }, { i: 5 }, { i: 3 }, { i: 3 }, { i: 36 }];
            const uniqueList = unique(sample, (item) => item.i);
            assert.notStrictEqual(uniqueList.length, sample.length);
            assert.strictEqual(uniqueList.length, 6);
        });
    });
});
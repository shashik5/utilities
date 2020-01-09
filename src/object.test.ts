import * as assert from 'assert';
import { deepMerge, deepCompare } from './object';

describe('Object', () => {
    describe('Deepmerge', () => {
        it('Object type', () => {
            const sample = {
                a: 1,
                b: 2
            };
            const res = deepMerge({}, sample, { b: 3, c: 4 });
            assert.deepStrictEqual(res, {
                a: 1,
                b: 3,
                c: 4
            });
        });

        it('Array type', () => {
            const sample = [1, 2, 3];
            const res = deepMerge([2, 3, 4], sample);
            assert.deepStrictEqual(res, [2, 3, 4, 1, 2, 3]);
        });

        it('Complex type', () => {
            const sample = { a: [1, 2, 3] };
            const res = deepMerge({ a: [2, 3, 4], b: [1, 2, 3] }, sample);
            assert.deepStrictEqual(res, {
                a: [2, 3, 4, 1, 2, 3],
                b: [1, 2, 3]
            });
        });

        it('Invalid type', () => {
            assert.throws(() => deepMerge(undefined as any, null as any));
        });
    });

    describe('Deep compare', () => {
        it('Object value 1', () => {
            const sample1 = { a: 1, b: 2 };
            const sample2 = { b: 4, c: 5 };
            assert.strictEqual(deepCompare(sample1, sample2), false);
        });

        it('Object value 2', () => {
            const sample1 = { a: 1, b: 2 };
            const sample2 = { a: 1, b: 2, c: 3 };
            assert.strictEqual(deepCompare(sample1, sample2), true);
        });

        it('Object value 3 with reverse check', () => {
            const sample1 = { a: 1, c: 2 };
            const sample2 = { a: 1, b: 2 };
            assert.strictEqual(deepCompare(sample1, sample2), false);
        });
    });
});
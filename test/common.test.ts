import * as assert from 'assert';
import { generateId, isNumber, isString, isArray, isObject, isFunction, isNullOrUndefined } from '../src/common';

describe('Common', () => {
    describe('Generate Id', () => {
        it('Unique Id', () => {
            assert.notStrictEqual(generateId(), generateId());
        });
    });

    describe('Number check', () => {
        it('Valid value', () => {
            assert.strictEqual(isNumber(2), true);
        });

        it('Invalid value 1', () => {
            assert.strictEqual(isNumber('2'), false);
        });

        it('Invalid value 2', () => {
            assert.strictEqual(isNumber({}), false);
        });
    });

    describe('String check', () => {
        it('Valid value', () => {
            assert.strictEqual(isString('Hello'), true);
        });

        it('Invalid value', () => {
            assert.strictEqual(isString(2), false);
        });
    });

    describe('Array check', () => {
        it('Valid value', () => {
            assert.strictEqual(isArray(['Hello']), true);
        });

        it('Invalid value', () => {
            assert.strictEqual(isArray({}), false);
        });
    });

    describe('Object check', () => {
        it('Valid value', () => {
            assert.strictEqual(isObject({ test: true }), true);
        });

        it('Invalid value', () => {
            assert.strictEqual(isObject([]), false);
        });
    });

    describe('Function check', () => {
        it('Valid value', () => {
            assert.strictEqual(isFunction(() => ({})), true);
        });

        it('Invalid value', () => {
            assert.strictEqual(isFunction({}), false);
        });
    });

    describe('Null or undefined check', () => {
        it('Empty value', () => {
            assert.strictEqual(isNullOrUndefined(), true);
        });

        it('Undefined', () => {
            assert.strictEqual(isNullOrUndefined(undefined), true);
        });

        it('Null', () => {
            assert.strictEqual(isNullOrUndefined(null), true);
        });

        it('Invalid value', () => {
            assert.strictEqual(isNullOrUndefined({}), false);
        });
    });
});
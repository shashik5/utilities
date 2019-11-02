import * as assert from 'assert';
import { debounce } from '../src/function';
import { throttle } from '../src/function/common';
import { memoizeFunction } from '../src/function/memoizer';

describe('Function', () => {
    describe('Debounce', () => {
        it('Execute once', (done) => {
            let executionCounter = 0;
            const debouncedCounter = debounce(() => { executionCounter++; }, 50);
            debouncedCounter();
            debouncedCounter();
            setTimeout(() => {
                done(executionCounter !== 1 ? 'Test failed' : undefined);
            }, 70);
        });

        it('Never executed', () => {
            let executionCounter = 0;
            const debouncedFunction = debounce(() => { executionCounter++; }, 50);
            debouncedFunction();
            debouncedFunction();
            debouncedFunction();
            debouncedFunction();
            debouncedFunction();
            assert.equal(executionCounter, 0);
        });
    });

    describe('Throttle', () => {
        it('Execute once', () => {
            let executionCounter = 0;
            const throttledFunction = throttle(() => { executionCounter++; }, 50);
            throttledFunction();
            throttledFunction();
            assert.equal(executionCounter, 1);
        });
    });

    describe('Memoizer', () => {
        it('Without arguments', () => {
            const memoizedFunction = memoizeFunction(() => Math.random());
            const res1 = memoizedFunction();
            const res2 = memoizedFunction();
            const res3 = memoizedFunction();
            assert.equal(res1, res2);
            assert.equal(res2, res3);
        });

        it('With arguments', () => {
            const memoizedFunction = memoizeFunction((factor: number) => factor * Math.random());
            const res1 = memoizedFunction(2);
            const res2 = memoizedFunction(2);
            const res3 = memoizedFunction(4);
            assert.equal(res1, res2);
            assert.notEqual(res2, res3);
        });
    });
});
import * as assert from 'assert';
import { toCamelCase, toPascalCase, combinePath } from '../src/string';

describe('String', () => {
    describe('To camel case', () => {
        it('Valid input', () => {
            const sample = 'HELLO';
            const result = toCamelCase(sample);
            assert.strictEqual(result, 'hELLO');
        });

        it('Invalid input', () => {
            assert.throws(toCamelCase as any);
        });

        it('Empty input', () => {
            const sample = '';
            const result = toCamelCase(sample);
            assert.strictEqual(result, sample);
        });
    });

    describe('To pascal case', () => {
        it('Valid input', () => {
            const sample = 'hello';
            const result = toPascalCase(sample);
            assert.strictEqual(result, 'Hello');
        });

        it('Invalid input', () => {
            assert.throws(toPascalCase as any);
        });

        it('Empty input', () => {
            const sample = '';
            const result = toPascalCase(sample);
            assert.strictEqual(result, sample);
        });
    });

    describe('Combine path', () => {
        it('Valid input', () => {
            const result = combinePath('one', 'two', 'three');
            assert.strictEqual(result, 'one/two/three');
        });

        it('Valid mixed input 1', () => {
            const result = combinePath('one', '/two/', 'three');
            assert.strictEqual(result, 'one/two/three');
        });

        it('Valid mixed input 2', () => {
            const result = combinePath('one', '/two/three/');
            assert.strictEqual(result, 'one/two/three/');
        });

        it('Empty input', () => {
            const result = combinePath('', '', '');
            assert.strictEqual(result, '');
        });
    });
});
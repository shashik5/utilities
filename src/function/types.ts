export type CallbackFunction<R = any> = (...params: any[]) => R;

export interface IMemoizeNode {
    map: WeakMap<object, IMemoizeNode>;
    value?: any;
}
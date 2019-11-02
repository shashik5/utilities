import { CallbackFunction } from "./types";

export function debounce<CB extends CallbackFunction>(callback: CB, wait: number) {
    let timerHandle: any;
    return ((...executionParams: any[]) => {
        clearTimeout(timerHandle);
        timerHandle = setTimeout(callback, wait, ...executionParams);
    }) as CB;
}

export function throttle<CB extends CallbackFunction>(callback: CB, wait: number) {
    let shouldWait = false;
    return ((...executionParams: any[]) => {
        if (shouldWait) {
            return;
        }
        callback(...executionParams);
        shouldWait = true;
        setTimeout(() => {
            shouldWait = false;
        }, wait);
    }) as CB;
}
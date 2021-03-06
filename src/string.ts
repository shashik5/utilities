export function toCamelCase(value: string) {
    return value.length > 1 ? `${value[0].toLowerCase()}${value.slice(1)}` : value;
}

export function toPascalCase(value: string) {
    return value.length > 1 ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}

function stringFilterPredicate(item: string) {
    return item.trim();
}

function trimPathItem(url: string, index: number, urls: string[]) {
    let trimmed = url.trim();

    if (index > 0 && trimmed.startsWith('/')) {
        trimmed = trimmed.slice(1) || '';
    }

    if (index !== (urls.length - 1) && trimmed.endsWith('/')) {
        trimmed = trimmed.slice(0, -1);
    }

    return trimmed;
}

export function combinePath(...urls: string[]) {
    return urls.map(trimPathItem).filter(stringFilterPredicate).join('/');
}
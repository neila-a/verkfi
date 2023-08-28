/**
 * Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
 * @param from The array for find.
 * @param searchElement The value to locate in the array.
 * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
 */
export function indexOf2<T>(from: T[], searchElement: T, fromIndex?: number) {
    let length = from.length;
    let fi = +fromIndex || 0;
    if (fi > length || length === 0) return -1;
    // 处理传入fromIndex为负数的情况
    fi = fi >= 0 ? fi : length - Math.abs(fi);
    for (let index = fi; index < length; index++) {
        if (String(from[index]) === String(searchElement)) return index;
    }
    return -1;
}

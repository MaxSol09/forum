export function flattenArray(arr) {
    return arr.reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
    }
export default function upGo<T = any>(fieldData: T[], index: number) {
    if (index != 0) {
        fieldData[index] = fieldData.splice(index - 1, 1, fieldData[index])[0];
    } else {
        fieldData.push(fieldData.shift());
    }
}
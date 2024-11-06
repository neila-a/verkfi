import range from "@verkfi/shared/range";
export const getRandomLetter = (str: string) => str[Math.floor(Math.random() * str.length)];
export default function multiIndexof(pattern: string, text: string) {
    if (pattern.length === 0) return false;
    if (pattern.length < text.length) return false;
    const rets: number[] = [];
    for (let i of range(pattern.length)) {
        if (pattern.slice(i).startsWith(text)) {
            rets.push(i);
        }
    }
    return rets.length === 0 ? false : rets;
}

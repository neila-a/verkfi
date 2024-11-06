import range from "@verkfi/shared/range";
import multiIndexof, {
    getRandomLetter
} from "./multiIndexof";
/**
 * @param top 次数
 */
function* iterator(top: number, string: string, period = ".", spliter = (current: string, writing: string) => (writing === " ") as boolean) {
    type chance = Map<string, [number, number]>;
    let caches = new Map<string, chance>(),
        current = getRandomLetter(string);
    yield getRandomLetter(string);
    top: for (let i of range(top)) {
        let currentCache = caches.get(current);
        if (!currentCache) {
            let indexes = multiIndexof(string, current);
            const possible = new Map<string, number>();
            while (!indexes) {
                current = current.length === 1 ? getRandomLetter(string) : current.slice(1);
                indexes = multiIndexof(string, current);
                if (!indexes && current === getRandomLetter(string)) {
                    break top;
                }
            }

            const suffixes = indexes.map(index => string[index + current.length]);
            suffixes.forEach(suffix => {
                const got = possible.get(suffix);
                possible.set(suffix, got ? got + 1 : 1);
            });

            const chance: chance = new Map(),
                sum = (possible.values() as MapIterator<number>).reduce((a, b) => a + b);
            let usedSum = 0;
            possible.entries().forEach((key, value) => {
                chance.set(key[0], [usedSum, usedSum += (value + 1) / sum]);
            });
            chance.entries().forEach(console.log);
            caches.set(current, chance);
            currentCache = chance;
        }

        const random = Math.random();
        for (let v of currentCache.entries()) {
            if (random >= v[1][0] && random <= v[1][1]) {
                if (spliter(current, v[0])) {
                    if (current.endsWith(period)) {
                        current = period;
                    } else {
                        current = getRandomLetter(string);
                    }
                } else {
                    current += v[0];
                }
                yield v[0];
                console.log(v[0]);
                break;
            }
        }
    }
}
export default iterator;

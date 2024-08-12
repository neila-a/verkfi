import range from "./range";
const times = 10,
    initial = 8,
    sumWithInitial = 2;
describe("range", () => {
    test("没有initial", () => {
        let sum = 0;
        for (const i of range(times)) {
            sum++;
        }
        expect(sum).toBeCloseTo(times + 1);
    });
    test("有initial", () => {
        let sum = 0;
        for (const i of range(times, initial)) {
            sum++;
        }
        expect(sum).toBeCloseTo(sumWithInitial + 1);
    });
});

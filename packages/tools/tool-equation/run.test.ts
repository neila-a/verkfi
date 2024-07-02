import run from "./run";
const willResult = 3,
    maxTimes = 1_0000;
describe("解方程", () => {
    test("一次方程", () => {
        const {
            result
        } = run(maxTimes, "return [9 * x - 2, 25]");
        expect(result.toNumber()).toBeCloseTo(willResult);
    });
    test("二次方程", () => {
        const {
            result
        } = run(maxTimes, "return [x ** 2 + 3, 12]");
        expect(result.toNumber()).toBeCloseTo(willResult);
    });
    test("三角学方程", () => {
        const {
            result
        } = run(maxTimes, "return [Math.sin(x), 0]");
        expect(result.toNumber()).toBeCloseTo(Math.PI);
    });
});

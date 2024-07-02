import Recently from "./Recently";
const max = 3,
    array = ["a", "b", "c"];
describe("Recently", () => {
    test("get方法", () => {
        const instance = new Recently(max, array);
        expect(instance.get().length).toBeCloseTo(max);
    });
    test("溢出处理", () => {
        const instance = new Recently(max, array);
        instance.add("d");
        expect(instance.get()).toEqual(["b", "c", "d"]);
    });
});

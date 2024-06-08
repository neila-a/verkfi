import {
    setState
} from "declare";
import {
    calc
} from "./consts";
import genNumber from "./genNumber";
import {
    evaluate
} from "mathjs";
import range from "@verkfi/shared/range";
const calcMath = (calcs: calc[], subtractionCheck: boolean, divisionCheck: boolean, max: number, min: number, itemCount: number, setMath: setState<string[]>) => setMath([...new Set(calcs.map(mode => {
    const modeS = mode.replace("×", "*").replace("÷", "/");
    function genMathS(): [number, number, number] {
        const one = genNumber(max, min);
        let two = genNumber(max, min);
        if (subtractionCheck || divisionCheck) {
            switch (mode) {
                case "-":
                case "÷":
                    while (two > one) {
                        two = genNumber(max, min);
                    }
                    break;
                default:
                    break;
            }
        }
        return [one, two, evaluate(`${one} ${modeS} ${two}`)];
    }
    return [...range(itemCount / (calcs.length) - 1, 1)].map(step => {
        let [one, two, out] = genMathS(),
            math = `${one}${mode}${two}=${out}`;
        function reGenMath() {
            [one, two, out] = genMathS();
            math = `${one}${mode}${two}=${out}`;
        }
        while (out > max || (mode === "%" && two === 0)) {
            reGenMath();
        }
        return math;
    });
})).keys()].flat(14)); // 14 没有什么意义
export default calcMath;

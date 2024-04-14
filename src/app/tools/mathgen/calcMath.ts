import {
    calc
} from "./consts";
import genNumber from "./genNumber";
import {
    logger
} from './consts';
import {
    setState
} from "declare";
export default function calcMath(calcs: calc[], subtractionCheck: boolean, divisionCheck: boolean, max: number, min: number, itemCount: number, setMath: setState<string[]>) {
    const calcMaths: string[] = [];
    calcs.forEach(function (mode) {
        const modeS = mode.replace("×", "*").replace("÷", "/")
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
            return [one, two, eval(`${one} ${modeS} ${two}`)];
        }
        for (let step = 1; step < (itemCount / (calcs.length)); step++) {
            let [one, two, out] = genMathS(),
                math = `${one}${mode}${two}=${out}`;
            function reGenMath() {
                [one, two, out] = genMathS();
                math = `${one}${mode}${two}=${out}`;
            }
            while (out > max || calcMaths.includes(math) || (mode == "%" && two == 0)) {
                reGenMath();
            }
            calcMaths.push(math);
        }
    });
    logger.log("maths为", calcMaths);
    return setMath(calcMaths);
};

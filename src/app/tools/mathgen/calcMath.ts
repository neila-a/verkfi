import {
    calc
} from "./consts";
import genNumber from "./genNumber";
import {
    logger
} from './consts';
import {
    setState
} from "../../declare";
export default function calcMath(calcs: calc[], subtractionCheck: boolean, divisionCheck: boolean, max: number, min: number, itemCount: number, setMath: setState<string[]>) {
    var calcMaths: string[] = [];
    calcs.forEach(function (mode) {
        const modeS = mode.replace("×", "*").replace("÷", "/")
        function genMathS(): [number, number, number] {
            var one: number = genNumber(max, min),
                two: number = genNumber(max, min);
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
        for (var step = 1; step < (itemCount / (calcs.length)); step++) {
            var [one, two, out] = genMathS(),
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

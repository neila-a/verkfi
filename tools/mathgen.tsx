import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    Button,
    Typography
} from "@mui/material";
import {
    Fragment,
    useEffect,
    useState
} from "react";
import {
    emptyArray
} from "./filter";
import {
    destroyer
} from "./reversal";
import style from "../styles/MathGen.module.scss";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "MathGen",
    level: "log", // 空字符串时，不显示任何信息
});
export type calc = "+" | "-" | "×" | "÷";
export const defaultCalcs: calc[] = [
    "+",
    "-",
    "×",
    "÷"
];
export default function MathGen(): JSX.Element {
    var [calcs, setCalcs] = useState<calc[]>([
        "+",
        "-"
    ]),
        [min, setMin] = useState<number>(0),
        [max, setMax] = useState<number>(10),
        [itemCount, setItemCount] = useState<number>(20),
        [maths, setMath] = useState<string[]>([]),
        [showOut, setShowOut] = useState<boolean>(false);
    useEffect(function () {
        logger.log("calcs为", calcs);
    }, [calcs]);
    function calcMath() {
        var calcMaths: string[] = [];
        calcs.forEach(mode => {
            for (var up = "", step = 1; step < (itemCount / (calcs.length)); step++) {
                var one = Math.floor(Math.random() * (max - min) + min);
                var two: number;
                switch (mode) {
                    case "-":
                    case "÷":
                        while (two <= one) {
                            two = Math.floor(Math.random() * (max - min) + min);
                        }
                        break;
                    default:
                        two = Math.floor(Math.random() * (max - min) + min);
                        break;
                }
                calcMaths.push(`${one}${mode}${two}=${eval(`${one}${mode.replace("×", "*").replace("÷", "/")}${two}`)}`);
            }
        });
        setMath(calcMaths);
    };
    useEffect(calcMath, [
        min,
        max,
        itemCount
    ]);
    return (
        <div>
            <br />
            <FormGroup>
                <TextField label="上限" type="number" InputLabelProps={{
                    shrink: true,
                }} onChange={event => {
                    setMax(Number(event.currentTarget.value));
                }} defaultValue={max} />
                <br />
                <TextField label="下限" type="number" InputLabelProps={{
                    shrink: true,
                }} onChange={event => {
                    setMin(Number(event.currentTarget.value));
                }} defaultValue={min} />
                <br />
                <TextField label="个数" type="number" InputLabelProps={{
                    shrink: true,
                }} onChange={event => {
                    setItemCount(Number(event.currentTarget.value));
                }} defaultValue={itemCount} />
                <Fragment>
                    <FormControlLabel label="全选" control={
                        <Checkbox checked={calcs != emptyArray} indeterminate={calcs != defaultCalcs} onChange={event => {
                            switch (event.currentTarget.checked) {
                                case false:
                                    setCalcs([]);
                                    break;
                                case true:
                                    setCalcs(defaultCalcs);
                                    break;
                            }
                        }} />
                    } />
                    <Fragment>
                        {defaultCalcs.map(calc => <FormControlLabel label={calc} key={calc} control={
                            <Checkbox checked={calcs.includes(calc)} onChange={event => {
                                switch (event.currentTarget.checked) {
                                    case false:
                                        setCalcs(destroyer(calcs, calc));
                                        break;
                                    case true:
                                        setCalcs([...calcs, calc]);
                                        break;
                                }
                            }} />
                        } />)}
                    </Fragment>
                </Fragment>
                <Button variant="contained" onClick={calcMath}>计算</Button>
                <Button variant="outlined" onClick={event => {
                    showOut ? setShowOut(false) : setShowOut(true);
                }}>{showOut ? "隐藏" : "显示"}答案</Button>
            </FormGroup>
            {maths == emptyArray ? <Fragment /> : maths.map(math => {
                function ThisComponent(): JSX.Element {
                    var [isError, setError] = useState<boolean>(false);
                    return (
                        <div key={math} className={style["single"]}>
                            <Typography>{math.replace(/=.*/g, "")}</Typography>
                            <div className={style["out"]}>
                                <TextField label="结果" type="number" InputLabelProps={{
                                    shrink: true,
                                }} error={isError} onChange={event => {
                                    setError((event.currentTarget.value == math.replace(/.*=/g, "")) ? false : true);
                                }} />
                                {showOut ? <Typography>答案：{math.replace(/.*=/g, "")}</Typography> : <Fragment />}
                            </div>
                        </div>
                    );
                }
                return <ThisComponent key={math} />;
            })}
        </div>
    );
}
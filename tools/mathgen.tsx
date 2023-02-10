import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField
} from "@mui/material";
import {
    useEffect,
    useState
} from "react";
import {
    emptyArray
} from "./filter";
import {
    destroyer
} from "./reversal";
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
    var [calcs, setCalcs] = useState<calc[]>(defaultCalcs);
    useEffect(function () {
        logger.log("calcs为", calcs);
    }, [calcs])
    return (
        <div>
            <br />
            <FormGroup>
                <TextField label="上限" type="number" InputLabelProps={{
                    shrink: true,
                }} />
                <br />
                <TextField label="下限" type="number" InputLabelProps={{
                    shrink: true,
                }} />
                <br />
                <TextField label="个数" type="number" InputLabelProps={{
                    shrink: true,
                }} />
                <>
                    <FormControlLabel label="全选" control={
                        <Checkbox checked={calcs != emptyArray} indeterminate={calcs != defaultCalcs} onChange={event => {
                            switch (event.currentTarget.checked) {
                                case true:
                                    setCalcs([]);
                                    break;
                                case false:
                                    setCalcs(defaultCalcs);
                                    break;
                            }
                        }} />
                    } />
                    <>
                        {defaultCalcs.map(calc => <FormControlLabel label={calc} key={calc} control={
                            <Checkbox checked={calcs.includes(calc)} onChange={event => {
                                switch (event.currentTarget.checked) {
                                    case true:
                                        setCalcs(destroyer(calcs, calc));
                                        break;
                                    case false:
                                        setCalcs([...calcs, calc]);
                                        break;
                                }
                            }} />
                        } />)}
                    </>
                </>
            </FormGroup>
        </div>
    );
}
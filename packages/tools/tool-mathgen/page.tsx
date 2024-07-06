"use client";
import {
    Button,
    ButtonGroup,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    List,
    Paper,
    TextField
} from "@mui/material";
import No from "@verkfi/shared/No";
import {
    useEffect,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import removeArrayItem from "remove-item-from-array";
import {
    calc,
    defaultCalcs
} from "./consts";
import genNumber from "./genNumber";
import SingleMath from "./singleMath";
import created from "./createdMath";
import range from "@verkfi/shared/range";
const defaultMax = 10,
    defaultItemCount = 20;
function MathGen() {
    const [min, setMin] = useState(0),
        [max, setMax] = useState(defaultMax),
        [itemCount, setItemCount] = useState(defaultItemCount),
        [maths, setMath] = useState<string[]>([]),
        [subtractionCheck, setSubtractionCheck] = useState(true),
        [divisionCheck, setDivisionCheck] = useState(true),
        [showOut, setShowOut] = useState(false),
        [calcs, setCalcs] = useState<calc[]>([
            "+",
            "-"
        ]),
        calcMath = () => setMath([...new Set(calcs.map(mode => {
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
                return [one, two, created.evaluate(`${one} ${modeS} ${two}`)];
            }
            return [...range(itemCount / calcs.length - 1, 1)].map(step => {
                let [one, two, out] = genMathS(),
                    math = `${one}${mode}${two}=${out}`;
                function reGenMath() {
                    [one, two, out] = genMathS();
                    math = `${one}${mode}${two}=${out}`;
                }
                while (mode === "%" && two === 0 || out > max) {
                    reGenMath();
                }
                return math;
            });
        })).keys()].flat(1));
    useEffect(calcMath, [min, max, itemCount, calcs, subtractionCheck, divisionCheck]);
    return (
        <>
            <FormGroup sx={{
                mb: 2
            }}>
                <TextField margin="normal" label={get("上限")} type="number" slotProps={{
                    inputLabel: {
                        shrink: true,
                        inputMode: "numeric"
                    }
                }} onChange={event => {
                    setMax(Number(event.target.value));
                }} defaultValue={max} />
                <TextField margin="normal" label={get("下限")} type="number" slotProps={{
                    inputLabel: {
                        shrink: true,
                        inputMode: "numeric"
                    }
                }} onChange={event => {
                    setMin(Number(event.target.value));
                }} defaultValue={min} />
                <TextField margin="normal" label={get("个数")} type="number" slotProps={{
                    inputLabel: {
                        shrink: true,
                        inputMode: "numeric"
                    }
                }} onChange={event => {
                    setItemCount(Number(event.target.value));
                }} defaultValue={itemCount} />
                <FormControlLabel label={get("mathgen.减数检查")} control={
                    <Checkbox checked={subtractionCheck} onChange={event => {
                        setSubtractionCheck(event.target.checked);
                    }} />
                } />
                <FormControlLabel label={get("mathgen.除数检查")} control={
                    <Checkbox checked={divisionCheck} onChange={event => {
                        setDivisionCheck(event.target.checked);
                    }} />
                } />
                <Paper sx={{
                    mb: 2,
                    "> *": {
                        p: 1
                    }
                }}>
                    <FormGroup>
                        <FormLabel component="legend">
                            {get("mathgen.选择计算方法")}
                        </FormLabel>
                        <FormControlLabel label={get("全选")} control={
                            <Checkbox checked={calcs === defaultCalcs} onChange={event => setCalcs(event.target.checked ? defaultCalcs : [])} />
                        } />
                        {defaultCalcs.map(calc => <FormControlLabel label={calc === "%" ? "%（求余）" : calc} key={calc} control={
                            <Checkbox checked={calcs.includes(calc)} onChange={event => {
                                setCalcs(old => event.target.checked ? removeArrayItem(old, calc) : [...old, calc]);
                            }} />
                        } />)}
                    </FormGroup>
                </Paper>
                <ButtonGroup fullWidth>
                    <Button variant="contained" onClick={calcMath}>
                        {get("计算")}
                    </Button>
                    <Button variant="outlined" onClick={event => {
                        showOut ? setShowOut(false) : setShowOut(true);
                    }}>
                        {showOut ? "隐藏" : "显示"}{get("答案")}
                    </Button>
                </ButtonGroup>
            </FormGroup>
            {maths.toString() === "" ? <No>
                {get("mathgen.没有任何已生成的算式")}
            </No> : <List>
                {maths.map(math => <SingleMath math={math} showOut={showOut} key={math} />)}
            </List>
            }
        </>
    );
}
export default MathGen;

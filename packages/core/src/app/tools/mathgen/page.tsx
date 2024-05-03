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
import No from "No";
import {
    useEffect,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import removeArrayItem from "remove-item-from-array";
import calcMath from "./calcMath";
import {
    calc,
    defaultCalcs
} from "./consts";
import SingleMath from "./singleMath";
function MathGen(): JSX.Element {
    const [min, setMin] = useState<number>(0),
        [max, setMax] = useState<number>(10),
        [itemCount, setItemCount] = useState<number>(20),
        [maths, setMath] = useState<string[]>([]),
        [subtractionCheck, setSubtractionCheck] = useState<boolean>(true),
        [divisionCheck, setDivisionCheck] = useState<boolean>(true),
        [showOut, setShowOut] = useState<boolean>(false),
        [calcs, setCalcs] = useState<calc[]>([
            "+",
            "-"
        ]),
        packagedCalcMath = () => calcMath(calcs, subtractionCheck, divisionCheck, max, min, itemCount, setMath);
    useEffect(packagedCalcMath, [
        min,
        max,
        itemCount,
        calcs
    ]);
    return (
        <>
            <FormGroup sx={{
                mb: 2
            }}>
                <TextField margin="normal" label={get("上限")} type="number" InputLabelProps={{
                    shrink: true
                }} onChange={event => {
                    setMax(Number(event.target.value));
                }} defaultValue={max} />
                <TextField margin="normal" label={get("下限")} type="number" InputLabelProps={{
                    shrink: true
                }} onChange={event => {
                    setMin(Number(event.target.value));
                }} defaultValue={min} />
                <TextField margin="normal" label={get("个数")} type="number" InputLabelProps={{
                    shrink: true
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
                    <Button variant="contained" onClick={packagedCalcMath}>
                        {get("计算")}
                    </Button>
                    <Button variant="outlined" onClick={event => {
                        showOut ? setShowOut(false) : setShowOut(true);
                    }}>
                        {showOut ? "隐藏" : "显示"}{get("答案")}
                    </Button>
                </ButtonGroup>
            </FormGroup>
            {maths.toString() === "" ? (
                <No>
                    {get("mathgen.没有任何已生成的算式")}
                </No>
            ) : (
                <List>
                    {maths.map(math => <SingleMath math={math} showOut={showOut} key={math} />)}
                </List>
            )}
        </>
    );
}
export default MathGen;

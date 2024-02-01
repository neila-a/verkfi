"use client";
import {
    get
} from 'react-intl-universal';
import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    Button,
    Typography,
    FormLabel,
    Paper,
    Box,
    ButtonGroup
} from "@mui/material";
import {
    useEffect,
    useState
} from "react";
import destroyer from "../../components/destroyer";
import SingleMath from "./singleMath";
import {
    calc,
    defaultCalcs
} from "./consts";
import calcMath from "./calcMath";
import {
    SyncProblem as SyncProblemIcon
} from '@mui/icons-material';
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
            <Box sx={{
                p: 1
            }}>
                <FormGroup>
                    <TextField label={get('上限')} type="number" InputLabelProps={{
                        shrink: true,
                    }} onChange={event => {
                        setMax(Number(event.currentTarget.value));
                    }} defaultValue={max} />
                    <br />
                    <TextField label={get('下限')} type="number" InputLabelProps={{
                        shrink: true,
                    }} onChange={event => {
                        setMin(Number(event.currentTarget.value));
                    }} defaultValue={min} />
                    <br />
                    <TextField label={get('个数')} type="number" InputLabelProps={{
                        shrink: true,
                    }} onChange={event => {
                        setItemCount(Number(event.currentTarget.value));
                    }} defaultValue={itemCount} />
                    <FormControlLabel label={get('mathgen.减数检查')} control={
                        <Checkbox checked={subtractionCheck} onChange={event => {
                            setSubtractionCheck(event.currentTarget.checked);
                        }} />
                    } />
                    <FormControlLabel label={get('mathgen.除数检查')} control={
                        <Checkbox checked={divisionCheck} onChange={event => {
                            setDivisionCheck(event.currentTarget.checked);
                        }} />
                    } />
                    <Paper sx={{
                        "> *": {
                            p: 1
                        }
                    }}>
                        <FormGroup>
                            <FormLabel component="legend">{get('mathgen.选择计算方法')}</FormLabel>
                            <FormControlLabel label={get('全选')} control={
                                <Checkbox checked={calcs == defaultCalcs} onChange={event => {
                                    switch (event.target.checked) {
                                        case false:
                                            setCalcs([]);
                                            break;
                                        case true:
                                            setCalcs(defaultCalcs);
                                            break;
                                    }
                                }} />
                            } />
                            {defaultCalcs.map(calc => <FormControlLabel label={calc == "%" ? "%（求余）" : calc} key={calc} control={
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
                        </FormGroup>
                    </Paper>
                    <br />
                    <ButtonGroup fullWidth>
                        <Button variant="contained" onClick={packagedCalcMath}>
                            {get('计算')}
                        </Button>
                        <Button variant="outlined" onClick={event => {
                            showOut ? setShowOut(false) : setShowOut(true);
                        }}>
                            {showOut ? "隐藏" : "显示"}{get('答案')}
                        </Button>
                    </ButtonGroup>
                    <br />
                </FormGroup>
                {maths.toString() === "" ? <Box sx={{
                    color: theme => theme.palette.text.disabled,
                    textAlign: "center"
                }}>
                    <SyncProblemIcon sx={{
                        fontSize: "500%"
                    }} />
                    <Typography>
                        {get("mathgen.没有任何已生成的算式")}
                    </Typography>
                </Box> : maths.map(math => <SingleMath math={math} showOut={showOut} key={math} />)}
            </Box>
        </>
    );
}
export default MathGen;

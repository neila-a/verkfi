import I18N from 'react-intl-universal';
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
import {
    emptyArray
} from "./filter";
import destroyer from "../../components/destroyer";
import SingleMath from "./singleMath";
import LpLogger from "lp-logger";
import {
    calc,
    defaultCalcs
} from "./consts";
import calcMath from "./calcMath";
export var logger = new LpLogger({
    name: "MathGen",
    level: "log", // 空字符串时，不显示任何信息
});
export function MathGen(): JSX.Element {
    var [min, setMin] = useState<number>(0),
        [max, setMax] = useState<number>(10),
        [itemCount, setItemCount] = useState<number>(20),
        [maths, setMath] = useState<string[]>([]),
        [subtractionCheck, setSubtractionCheck] = useState<boolean>(true),
        [divisionCheck, setDivisionCheck] = useState<boolean>(true),
        [showOut, setShowOut] = useState<boolean>(false),
        [calcs, setCalcs] = useState<calc[]>([
            "+",
            "-"
        ]);
    const packagedCalcMath = () => calcMath(calcs, subtractionCheck, divisionCheck, max, min, itemCount, setMath);
    useEffect(function () {
        logger.log("calcs为", calcs);
    }, [calcs]);
    useEffect(packagedCalcMath, [
        min,
        max,
        itemCount
    ]);
    return (
        <>
            <Box sx={{
                p: 1
            }}>
                <FormGroup>
                    <TextField label={I18N.get('上限')} type="number" InputLabelProps={{
                        shrink: true,
                    }} onChange={event => {
                        setMax(Number(event.currentTarget.value));
                    }} defaultValue={max} />
                    <br />
                    <TextField label={I18N.get('下限')} type="number" InputLabelProps={{
                        shrink: true,
                    }} onChange={event => {
                        setMin(Number(event.currentTarget.value));
                    }} defaultValue={min} />
                    <br />
                    <TextField label={I18N.get('个数')} type="number" InputLabelProps={{
                        shrink: true,
                    }} onChange={event => {
                        setItemCount(Number(event.currentTarget.value));
                    }} defaultValue={itemCount} />
                    <FormControlLabel label={I18N.get('减数检查')} control={
                        <Checkbox checked={subtractionCheck} onChange={event => {
                            setSubtractionCheck(event.currentTarget.checked);
                        }} />
                    } />
                    <FormControlLabel label={I18N.get('除数检查')} control={
                        <Checkbox checked={divisionCheck} onChange={event => {
                            setDivisionCheck(event.currentTarget.checked);
                        }} />
                    } />
                    <Paper elevation={6} sx={{
                        "> *": {
                            p: 1
                        }
                    }}>
                        <FormGroup>
                            <FormLabel component="legend">{I18N.get('选择计算方法')}</FormLabel>
                            <FormControlLabel label={I18N.get('全选')} control={
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
                    <ButtonGroup variant="contained">
                        <Button variant="contained" onClick={packagedCalcMath}>
                            {I18N.get('计算')}
                        </Button>
                        <Button variant="outlined" onClick={event => {
                            showOut ? setShowOut(false) : setShowOut(true);
                        }}>
                            {showOut ? "隐藏" : "显示"}{I18N.get('答案')}
                        </Button>
                    </ButtonGroup>
                    <br />
                </FormGroup>
                {maths == emptyArray ? <Typography>{I18N.get('没有任何已生成的算式')}</Typography> : maths.map(math => <SingleMath math={math} showOut={showOut} key={math} />)}
            </Box>
        </>
    );
}
export default MathGen;

import I18N from 'react-intl-universal';
import {
    Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup
} from "@mui/material";
import LpLogger from "lp-logger";
import {
    useState,
    Fragment
} from "react";
import InputDialog from "../../components/dialog/InputDialog";
import AlertDialog from "../../components/dialog/AlertDialog";
import style from "./CountLetter.module.scss"
var logger = new LpLogger({
    name: "CountLetter",
    level: "log", // 空字符串时，不显示任何信息
});
import table from "./table";
type numberType = 2 | 8 | 10 | 16;
function CountLetter(): JSX.Element {
    var [enterDialogOpen, setEnterDialogOpen] = useState<boolean>(false),
        [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false),
        [out, setOut] = useState<string>(""),
        [numberType, setNumberType] = useState<numberType>(10);
    return (
        <>
            <div>
                <Button onClick={() => {
                    logger.log("已弹出输入框。");
                    setEnterDialogOpen(true);
                }} variant="contained" fullWidth>{I18N.get('输入')}</Button>
                {enterDialogOpen ? <InputDialog context={I18N.get('输入你要转换的字符（串）')} onDone={context => {
                    table.forEach(single => {
                        context = context.replace(new RegExp(single, "g"), (table.indexOf(single.toUpperCase()) + 1).toString(numberType).toUpperCase());
                    })
                    setEnterDialogOpen(false);
                    setOut(context);
                    setAlertDialogOpen(true);
                    logger.log(`已处理完毕，结果为${context}。`);
                }} title={I18N.get('输入字符')} label={I18N.get('在这里输入')} /> : <Fragment /> /* 输入对话框容器 */}
                {alertDialogOpen ? <AlertDialog title={I18N.get('输出')} description={out} onDone={() => {
                    setAlertDialogOpen(false);
                }} /> : <Fragment /> /* 输出对话框容器 */}
            </div>
            <br />
            <FormControl>
                <FormLabel id="radio-buttons-group-label">数字进制</FormLabel>
                <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    defaultValue="10"
                    value={numberType}
                    onChange={event => {
                        setNumberType(event.target.value as unknown as numberType);
                    }}
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="16" control={<Radio />} label="十六进制" />
                    <FormControlLabel value="10" control={<Radio />} label="十进制" />
                    <FormControlLabel value="8" control={<Radio />} label="八进制" />
                    <FormControlLabel value="2" control={<Radio />} label="二进制" />
                </RadioGroup>
            </FormControl>
        </>
    );
};
export default CountLetter;

"use client";
import {
    get
} from 'react-intl-universal';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup
} from "@mui/material";
import LpLogger from "lp-logger";
import {
    useState
} from "react";
import dynamic from 'next/dynamic';
const InputDialog = dynamic(() => import("../../components/dialog/InputDialog"));
const AlertDialog = dynamic(() => import("../../components/dialog/AlertDialog"));
const logger = new LpLogger({
    name: "CountLetter",
    level: "log", // 空字符串时，不显示任何信息
});
import table from "./table";
type numberType = 2 | 8 | 10 | 16;
function CountLetter(): JSX.Element {
    const [enterDialogOpen, setEnterDialogOpen] = useState<boolean>(false),
        [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false),
        [out, setOut] = useState<string>(""),
        [numberType, setNumberType] = useState<numberType>(10);
    return (
        <>
            <Box mb={2} component="section">
                <Button onClick={() => {
                    logger.log("已弹出输入框。");
                    setEnterDialogOpen(true);
                }} variant="contained" fullWidth>{get('输入')}</Button>
                <InputDialog open={enterDialogOpen} context={get('输入你要转换的字符（串）')} onDone={context => {
                    table.forEach(single => {
                        context = context.replace(new RegExp(single, "g"), (table.indexOf(single.toUpperCase()) + 1).toString(numberType).toUpperCase());
                    })
                    setEnterDialogOpen(false);
                    setOut(context);
                    setAlertDialogOpen(true);
                    logger.log(`已处理完毕，结果为${context}。`);
                }} title={get('输入字符')} label={get('在这里输入')} />
                <AlertDialog open={alertDialogOpen} title={get('输出')} description={out} onDone={() => {
                    setAlertDialogOpen(false);
                }} /> {/* 输出对话框容器 */}
            </Box>
            <FormControl component="section">
                <FormLabel id="radio-buttons-group-label">{get("countletter.system")}</FormLabel>
                <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    defaultValue="10"
                    value={numberType}
                    onChange={event => {
                        setNumberType(event.target.value as unknown as numberType);
                    }}
                    name="radio-buttons-group"
                >
                    {([2, 8, 10, 16] as numberType[]).map(type => (
                        <FormControlLabel key={type} value={type.toString()} control={<Radio />} label={get(`countletter.systemName.${type.toString()}`)} />
                    ))}
                </RadioGroup>
            </FormControl>
        </>
    );
};
export default CountLetter;

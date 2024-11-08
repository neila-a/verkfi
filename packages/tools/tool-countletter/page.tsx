/* eslint-disable no-magic-numbers */
// 这个文件中的魔数是数字进制
"use client";
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
    useId,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import table from "./table.json";
import InputDialog from "@verkfi/shared/dialog/Input";
import AlertDialog from "@verkfi/shared/dialog/Alert";
const logger = new LpLogger({
    name: "CountLetter",
    level: "log" // 空字符串时，不显示任何信息
});
type numberType = 2 | 8 | 10 | 16;
function CountLetter() {
    const [enterDialogOpen, setEnterDialogOpen] = useState(false),
        [alertDialogOpen, setAlertDialogOpen] = useState(false),
        [out, setOut] = useState(""),
        systemId = useId(),
        [numberType, setNumberType] = useState<numberType>(10);
    return (
        <>
            <Box mb={2} component="section">
                <Button onClick={() => {
                    logger.log("已弹出输入框。");
                    setEnterDialogOpen(true);
                }} variant="contained" fullWidth>
                    {get("输入")}
                </Button>
                <InputDialog open={enterDialogOpen} context={get("输入你要转换的字符（串）")} onDone={context => {
                    table.forEach(single => {
                        context = context.replace(
                            new RegExp(single, "g"),
                            (table.indexOf(single.toUpperCase()) + 1).toString(numberType).toUpperCase()
                        );
                    });
                    setEnterDialogOpen(false);
                    setOut(context);
                    setAlertDialogOpen(true);
                    logger.log(`已处理完毕，结果为${context}。`);
                }} title={get("输入字符")} label={get("在这里输入")} />
                <AlertDialog open={alertDialogOpen} title={get("输出")} description={out} onDone={() => {
                    setAlertDialogOpen(false);
                }} />
            </Box>
            <FormControl component="section">
                <FormLabel id={systemId}>
                    {get("countletter.system")}
                </FormLabel>
                <RadioGroup
                    aria-labelledby={systemId}
                    defaultValue="10"
                    value={numberType}
                    onChange={event => {
                        setNumberType(event.target.value as unknown as numberType);
                    }}
                    name="radio-buttons-group"
                >
                    {([2, 8, 10, 16] satisfies numberType[]).map(type => <FormControlLabel
                        key={type}
                        value={type.toString()}
                        control={<Radio />}
                        label={get(`countletter.systemName.${type.toString()}`)}
                    />)}
                </RadioGroup>
            </FormControl>
        </>
    );
}
export default CountLetter;

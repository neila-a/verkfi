"use client";
import {
    Close
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Chip,
    TextField,
    Typography
} from "@mui/material";
import CopyButton from "@verkfi/shared/CopyButton";
import LpLogger from "lp-logger";
import dynamic from "next/dynamic";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
type wordList = Map<number, string>;
const InputDialog = dynamic(() => import("@verkfi/shared/dialog/Input")),
    logger = new LpLogger({
        name: get("翻转"),
        level: "log" // 空字符串时，不显示任何信息
    }),
    /**
     * 随机所用的系数
     */
    randomFactor = 1000_0000_0000_0000;
function Reversal() {
    const [words, setWords] = useState(""),
        [wordList, setWordList] = useState<wordList>(new Map()),
        [output, setOutput] = useState(""),
        [showSplitDialog, setShowSplitDialog] = useState(false);
    return <>
        <Box sx={{
            "> *": {
                mb: 1
            }
        }}>
            <Alert severity="info" sx={{
                cursor: "help"
            }}>
                {get("reversal.以空格分隔，按回车添加。")}
            </Alert>
            <TextField fullWidth label={get("输入框")} id="input" onKeyDown={event => {
                if (event.key === "Enter") {
                    setWordList(current => ({
                        ...current,
                        [Math.random() * randomFactor]: words
                    }));
                    setWords("");
                    logger.log("已保存至列表。");
                }
            }} onChange={event => {
                setWords(event.target.value);
            }} value={words} />
            {Object.keys(wordList).map(a => Number(a)).map(id => {
                return (
                    <Chip key={id} label={wordList[id]} onDelete={() => {
                        const draft = structuredClone(wordList);
                        Reflect.deleteProperty(draft, id);
                        setWordList(draft);
                    }} deleteIcon={<Close />} />
                );
            })}
            <ButtonGroup fullWidth sx={{
                mt: 1
            }}>
                <Button variant="contained" onClick={() => {
                    const stageOutput = [...wordList.entries()];
                    stageOutput.sort(() => {
                        // 0.5用于随机
                        // eslint-disable-next-line no-magic-numbers
                        return Math.random() - 0.5;
                    });
                    setOutput(stageOutput.map(wordArray => {
                        return wordArray[0];
                    }).join(""));
                    logger.log("已处理。");
                }}>
                    {get("处理")}
                </Button>
                <Button variant="outlined" onClick={() => {
                    setWordList(new Map());
                    setWords("");
                    setOutput("");
                    logger.log("已重置。");
                }}>
                    {get("重来")}
                </Button>
                <Button variant="outlined" onClick={() => {
                    setShowSplitDialog(true);
                    logger.log("已打开输入对话框。");
                }}>
                    {get("拆分")}
                </Button>
                <CopyButton add={{
                    variant: "outlined"
                }}>
                    {output}
                </CopyButton>
            </ButtonGroup>
        </Box>
        <Typography variant="body1">
            {get("结果：")}{output}
        </Typography>
        <InputDialog open={showSplitDialog} label="" title={get("拆分")} context={get("reversal.请输入拆分的符号，不输入则是逐字拆分")} onDone={context => {
            const draft: wordList = new Map();
            words.split(context).forEach(word => (draft.set(Math.random() * randomFactor, word)));
            setWordList(draft);
            logger.log("已拆分。");
            setShowSplitDialog(false);
        }} />
    </>;
}
export default Reversal;

"use client";
import {
    Close,
    Translate
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    TextField,
    Theme,
    Typography
} from "@mui/material";
import CopyButton from "@verkfi/shared/CopyButton";
import Transition from "@verkfi/shared/dialog/Transition";
import LpLogger from "lp-logger";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
type wordList = Map<number, string>;
const logger = new LpLogger({
    name: get("翻转"),
    level: "log" // 空字符串时，不显示任何信息
}),
    /**
     * 随机所用的系数
     */
    randomFactor = 1000_0000_0000_0000,
    getId = () => Math.random() * randomFactor;
function Reversal() {
    const [words, setWords] = useState(""),
        [wordList, setWordList] = useState<wordList>(new Map()),
        [output, setOutput] = useState(""),
        [separator, setSeparator] = useState(""),
        [cnSegment, setCnSegment] = useState(false),
        [showSplitDialog, setShowSplitDialog] = useState(false);
    function split() {
        const draft: wordList = new Map();
        if (cnSegment) {
            const segmenter = new Intl.Segmenter("zh-Hans", {
                granularity: "word"
            });
            for (let segmentData of segmenter.segment(words)) {
                draft.set(segmentData.index, segmentData.segment);
            }
        } else {
            words.split(separator).forEach(word => draft.set(getId(), word));
        }
        setWordList(draft);
        logger.log("已拆分。");
        setShowSplitDialog(false);
    }
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
            {Object.keys(wordList).map(a => +a).map(id => {
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
                    const stageOutput = [...wordList.values()];
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
        <Dialog open={showSplitDialog} onClose={event => setShowSplitDialog(false)} TransitionComponent={Transition} keepMounted>
            <DialogTitle>
                {get("拆分")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {get("reversal.请输入拆分的符号，不输入则是逐字拆分")}
                </DialogContentText>
                <FormControlLabel control={<Checkbox
                    icon={<Translate sx={{
                        color: (theme: Theme) => theme.palette.text.primary
                    }} />}
                    checked={cnSegment}
                    onClick={event => {
                        setCnSegment(old => !old);
                    }}
                    checkedIcon={<Translate />}
                />} label={get("reversal.cn")} />
                <TextField onKeyDown={event => {
                    if (event.key === "Enter") {
                        split();
                    }
                }} autoFocus margin="dense" label={get("拆分")} fullWidth onChange={event => {
                    setSeparator(event.target.value);
                }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={split}>
                    {get("确定")}
                </Button>
            </DialogActions>
        </Dialog>
    </>;
}
export default Reversal;

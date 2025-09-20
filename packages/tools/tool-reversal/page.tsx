"use client";
import {
    Close,
    Translate
} from "@mui/icons-material";
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Chip,
    FormControlLabel,
    Tab,
    Tabs,
    TextField,
    Theme,
    Typography
} from "@mui/material";
import CopyButton from "@verkfi/shared/CopyButton";
import LpLogger from "lp-logger";
import {
    useMemo,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import iterator from "./iterator";
import {
    atom,
    useAtom,
    useAtomValue
} from "jotai";
type wordList = Map<number, string>;
export const logger = new LpLogger({
    name: get("翻转"),
    level: "log" // 空字符串时，不显示任何信息
});
const getId = () => Math.random() * randomFactor,
    /**
     * 随机所用的系数
     */
    randomFactor = 1000_0000_0000_0000,
    defaultTop = 100,
    wordsAtom = atom(""),
    separatorAtom = atom("");
function Split() {
    const [words, setWords] = useAtom(wordsAtom),
        [wordList, setWordList] = useState<wordList>(new Map()),
        output = useMemo(() => wordList.values().toArray().toSorted(
            // 0.5用于随机
            // eslint-disable-next-line no-magic-numbers
            () => Math.random() - 0.5
        ).map(wordArray => wordArray[0]).join(""), [wordList]),
        separator = useAtomValue(separatorAtom),
        [cnSegment, setCnSegment] = useState(false);
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
    }
    return <>
        <Box sx={{
            "> *": {
                mb: 1
            }
        }}>
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
            }} value={words} placeholder={get("reversal.以空格分隔，按回车添加。")} />
            {wordList.keys().toArray().map(id => <Chip key={id} label={wordList.get(id)} onDelete={() => {
                const draft = structuredClone(wordList);
                Reflect.deleteProperty(draft, id);
                setWordList(draft);
            }} deleteIcon={<Close />} />)}
            <ButtonGroup fullWidth sx={{
                mt: 1
            }}>
                <Button variant="contained" onClick={split}>
                    {get("处理")}
                </Button>
                <Button variant="outlined" onClick={() => {
                    setWordList(new Map());
                    setWords("");
                    logger.log("已重置。");
                }}>
                    {get("重来")}
                </Button>
                <CopyButton add={{
                    variant: "outlined"
                }}>
                    {output}
                </CopyButton>
            </ButtonGroup>
        </Box>
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
        <Typography variant="body1">
            {get("结果：")}{output}
        </Typography>
    </>;
}
function Iterator() {
    const [words, setWords] = useAtom(wordsAtom),
        [period, setPeriod] = useState("."),
        spliter = useAtomValue(separatorAtom),
        [top, setTop] = useState(defaultTop),
        output = iterator(top, words, period, (c, w) => w === spliter).toArray().join("");
    return <>
        <TextField fullWidth label={get("输入框")} onChange={event => {
            setWords(event.target.value);
        }} value={words} />
        <TextField fullWidth label={get("reversal.period")} onChange={event => {
            setPeriod(event.target.value);
        }} value={period} />
        <TextField label={get("reversal.top")} value={top} onChange={event => setTop(+event.target.value)} slotProps={{
            htmlInput: {
                step: 1,
                type: "number"
            }
        }} />
        <CopyButton add={{
            variant: "outlined"
        }}>
            {output}
        </CopyButton>
        <Typography variant="body1">
            {get("结果：")}{output}
        </Typography>
    </>;
}
enum algorithmType {
    split,
    iterator
}
function Reversal() {
    const [separator, setSeparator] = useAtom(separatorAtom),
        [type, setType] = useState<algorithmType>(algorithmType.split);
    return <>
        <Tabs value={type} onChange={(event, value) => setType(value)}>
            <Tab label={get("reversal.split")} />
            <Tab label={get("reversal.iterator")} />
        </Tabs>
        <TextField fullWidth label={get("reversal.spliter")} onChange={event => {
            setSeparator(event.target.value);
        }} value={separator} />
        {type === algorithmType.split ? <Split /> : <Iterator />}
    </>;
}
export default Reversal;

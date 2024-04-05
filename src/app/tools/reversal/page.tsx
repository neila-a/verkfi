"use client";
import {
    get
} from 'react-intl-universal';
import {
    useState
} from "react";
import {
    Typography,
    TextField,
    Alert,
    Chip,
    Button,
    ButtonGroup,
    Box
} from "@mui/material";
import removeArrayItem from "remove-item-from-array";
import {
    Close
} from "@mui/icons-material";
import LpLogger from "lp-logger";
import dynamic from 'next/dynamic';
const InputDialog = dynamic(() => import("../../components/dialog/InputDialog"));
const logger = new LpLogger({
    name: get('翻转'),
    level: "log", // 空字符串时，不显示任何信息
});
import CopyButton from '../../components/CopyButton';
function Reversal(): JSX.Element {
    const [wordList, setWordList] = useState<[string, number][]>([]),
        [words, setWords] = useState<string>(""),
        [output, setOutput] = useState<string>(""),
        [showSplitDialog, setShowSplitDialog] = useState<boolean>(false);
    return (
        <Box>
            <Box sx={{
                "> *": {
                    mb: 1
                }
            }}>
                <Alert severity="info" sx={{
                    cursor: "help"
                }}>
                    {get('reversal.以空格分隔，按回车添加。')}
                </Alert>
                <TextField fullWidth label={get('输入框')} id="input" onKeyDown={event => {
                    if (event.key == "Enter") {
                        setWordList(current => [...current, [
                            words,
                            Math.random() * 1000000000000000
                        ]]);
                        setWords("");
                        logger.log("已保存至列表。");
                    }
                }} onChange={event => {
                    setWords(event.target.value);
                }} value={words} />
                {wordList.map(wordArray => {
                    return (
                        <Chip key={wordArray[1]} label={wordArray[0]} onDelete={() => {
                            setWordList(oldWordList => removeArrayItem(oldWordList, wordArray));
                        }} deleteIcon={<Close />} />
                    );
                })}
                <ButtonGroup fullWidth sx={{
                    mt: 1
                }}>
                    <Button variant="contained" onClick={() => {
                        var stageOutput: [string, number][] = wordList;
                        stageOutput.sort(() => {
                            return Math.random() - 0.5;
                        });
                        setOutput(stageOutput.map(wordArray => {
                            return wordArray[0];
                        }).join(""));
                        logger.log("已处理。");
                    }}>{get('处理')}</Button>
                    <Button variant="outlined" onClick={() => {
                        setWordList([]);
                        setWords("");
                        setOutput("");
                        logger.log("已重置。");
                    }}>{get('重来')}</Button>
                    <Button variant="outlined" onClick={() => {
                        setShowSplitDialog(true);
                        logger.log("已打开输入对话框。");
                    }}>{get('拆分')}</Button>
                    <CopyButton add={{
                        variant: "outlined"
                    }}>
                        {output}
                    </CopyButton>
                </ButtonGroup>
            </Box>
            <Typography variant="body1">{get('结果：')}{output}</Typography>
            <InputDialog open={showSplitDialog} label="" title={get('拆分')} context={get('reversal.请输入拆分的符号，不输入则是逐字拆分')} onDone={context => {
                setWordList(words.split(context).map(word => {
                    return [
                        word,
                        Math.random() * 10000000000000000
                    ];
                }));
                logger.log("已拆分。");
                setShowSplitDialog(false);
            }} />
        </Box>
    );
};
export default Reversal;

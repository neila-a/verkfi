"use client";
import I18N from 'react-intl-universal';
import React, {
    useState,
    useEffect
} from "react";
import {
    Typography,
    TextField,
    Alert,
    Chip,
    Button,
    ButtonGroup
} from "@mui/material";
import {
    Close
} from "@mui/icons-material";
import LpLogger from "lp-logger";
import InputDialog from "../../components/dialog/InputDialog";
import AlertDialog from "../../components/dialog/AlertDialog";
import Snackbar from "../../components/snackbar/up";
var logger = new LpLogger({
    name: I18N.get('翻转'),
    level: "log", // 空字符串时，不显示任何信息
});
import destroyer from "../../components/destroyer";
export function Reversal(): JSX.Element {
    var [wordList, setWordList] = useState<[string, number][]>([]),
        [words, setWords] = useState<string>(""),
        [output, setOutput] = useState<string>(""),
        [showCopyErrorDialog, setShowCopyErrorDialog] = useState<boolean>(false),
        [copyError, setCopyError] = useState<string>(""),
        [showSplitDialog, setShowSplitDialog] = useState<boolean>(false),
        [showCopyDoneDialog, setShowCopyDoneDialog] = useState<boolean>(false);
    return (
        <>
            <Alert severity="info">{I18N.get('以空格分隔，按回车添加。')}</Alert>
            <TextField fullWidth label={I18N.get('输入框')} id="input" onKeyDown={event => {
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
                        setWordList(oldWordList => destroyer(oldWordList, wordArray));
                    }} deleteIcon={<Close />} />
                );
            })}
            <br />
            <ButtonGroup>
                <Button variant="contained" onClick={() => {
                    var stageOutput: [string, number][] = wordList;
                    stageOutput.sort(() => {
                        return Math.random() - 0.5;
                    });
                    setOutput(stageOutput.map(wordArray => {
                        return wordArray[0];
                    }).join(""));
                    logger.log("已处理。");
                }}>{I18N.get('处理')}</Button>
                <Button variant="outlined" onClick={() => {
                    setWordList([]);
                    setWords("");
                    setOutput("");
                    logger.log("已重置。");
                }}>{I18N.get('重来')}</Button>
                <Button variant="outlined" onClick={() => {
                    setShowSplitDialog(true);
                    logger.log("已打开输入对话框。");
                }}>{I18N.get('拆分')}</Button>
                <Button variant="outlined" onClick={() => {
                    navigator.clipboard.writeText(output).then(() => {
                        setShowCopyDoneDialog(true);
                    }).catch(error => {
                        setCopyError(`复制结果时出现错误，请报告给开发人员：${error}`);
                        setShowCopyErrorDialog(true);
                    });
                }}>{I18N.get('复制')}</Button>
            </ButtonGroup>
            <Typography variant="body1">{I18N.get('结果：')}{output}</Typography>
            {showCopyErrorDialog && <AlertDialog onDone={() => {
                setShowCopyErrorDialog(false);
            }} title={I18N.get('复制出现错误')} description={copyError} />}
            {showSplitDialog && <InputDialog label="" title={I18N.get('拆分')} context={I18N.get('请输入拆分的符号，不输入则是逐字拆分')} onDone={context => {
                setWordList(words.split(context).map(word => {
                    return [
                        word,
                        Math.random() * 10000000000000000
                    ];
                }));
                logger.log("已拆分。");
                setShowSplitDialog(false);
            }} />}
            <Snackbar open={showCopyDoneDialog} message={I18N.get('已把结果复制至剪贴板。')} onClose={() => {
                setShowCopyDoneDialog(false);
            }}/>
        </>
    );
};
export default Reversal;

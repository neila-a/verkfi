"use client";
import {
    get
} from 'react-intl-universal';
import {
    useState
} from "react";
import {
    Button,
    ButtonOwnProps,
    Snackbar
} from "@mui/material";
import {
    ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import {
    AlertDialog
} from '../tools/pi/page';
export default function CopyButton(props: {
    children: string;
    add?: ButtonOwnProps;
}) {
    const [showCopyDoneDialog, setShowCopyDoneDialog] = useState<boolean>(false),
        [copyError, setCopyError] = useState<string>(""),
        [showCopyErrorDialog, setShowCopyErrorDialog] = useState<boolean>(false);
    return (
        <>
            <Button {...props.add} startIcon={<ContentCopyIcon />} sx={{
                ...props.add.sx,
                cursor: "copy"
            }} onClick={() => {
                navigator.clipboard.writeText(props.children).then(() => {
                    setShowCopyDoneDialog(true);
                }).catch(error => {
                    setCopyError(`复制结果时出现错误，请报告给开发人员：${error}`);
                    setShowCopyErrorDialog(true);
                });
            }}>{get('copy.复制')}</Button>
            <Snackbar open={showCopyDoneDialog} message={get('copy.已把结果复制至剪贴板。')} onClose={() => {
                setShowCopyDoneDialog(false);
            }} />
            <AlertDialog open={showCopyErrorDialog} onDone={() => {
                setShowCopyErrorDialog(false);
            }} title={get('copy.复制出现错误')} description={copyError} />
        </>
    );
}

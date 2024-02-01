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
    IconButton,
    IconButtonOwnProps,
    Snackbar,
    SxProps,
    Theme
} from "@mui/material";
import {
    ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
const AlertDialog = dynamic(() => import("./dialog/AlertDialog"));
import MouseOverPopover from './Popover';
function CopyButton(props: {
    children: string;
    add?: ButtonOwnProps;
}): JSX.Element;
function CopyButton(props: {
    children: string;
    onlyIcon: true;
    add?: IconButtonOwnProps;
}): JSX.Element;
function CopyButton(props: {
    children: string;
    onlyIcon?: boolean;
    add?: ButtonOwnProps | IconButtonOwnProps;
}) {
    const [showCopyDoneDialog, setShowCopyDoneDialog] = useState<boolean>(false),
        [copyError, setCopyError] = useState<string>(""),
        [showCopyErrorDialog, setShowCopyErrorDialog] = useState<boolean>(false),
        handleCopy = () => {
            navigator.clipboard.writeText(props.children).then(() => {
                setShowCopyDoneDialog(true);
            }).catch(error => {
                setCopyError(`复制结果时出现错误，请报告给开发人员：${error}`);
                setShowCopyErrorDialog(true);
            });
        },
        add = "add" in props ? props.add : {},
        sx: SxProps<Theme> = {
            ...("sx" in add ? add.sx : {}),
            cursor: "copy"
        };
    return (
        <>
            {props.onlyIcon ? <MouseOverPopover text={get('copy.复制')}>
                <IconButton {...props.add} sx={sx} onClick={handleCopy} aria-label={get('copy.复制')}>
                    <ContentCopyIcon />
                </IconButton>
            </MouseOverPopover> : <Button aria-label={get('copy.复制')} {...props.add as ButtonOwnProps} startIcon={<ContentCopyIcon />} sx={sx} onClick={handleCopy}>
                {get('copy.复制')}
            </Button>}
            <Snackbar open={showCopyDoneDialog} message={get('copy.已把结果复制至剪贴板。')} onClose={() => {
                setShowCopyDoneDialog(false);
            }} />
            <AlertDialog open={showCopyErrorDialog} onDone={() => {
                setShowCopyErrorDialog(false);
            }} title={get('copy.复制出现错误')} description={copyError} />
        </>
    );
}
export default CopyButton;
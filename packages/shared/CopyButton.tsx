"use client";
import {
    ContentCopy as ContentCopyIcon
} from "@mui/icons-material";
import {
    Button,
    ButtonOwnProps,
    IconButton,
    IconButtonOwnProps,
    Snackbar,
    SxProps,
    Theme
} from "@mui/material";
import dynamic from "next/dynamic";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import MouseOverPopover from "./Popover";
const AlertDialog = dynamic(() => import("./dialog/Alert"));
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
    const [showCopyDoneDialog, setShowCopyDoneDialog] = useState(false),
        [copyError, setCopyError] = useState(""),
        [showCopyErrorDialog, setShowCopyErrorDialog] = useState(false),
        handleCopy = async () => {
            try {
                await navigator.clipboard.writeText(props.children);
                setShowCopyDoneDialog(true);
            } catch (error) {
                setCopyError(get("copy.errorInfo", {
                    error: error
                }));
                setShowCopyErrorDialog(true);
            }
        },
        add = "add" in props ? props.add || {
        } : {
        },
        sx: SxProps<Theme> = {
            ..."sx" in add ? add.sx : {
            },
            cursor: "copy"
        };
    return <>
        {props.onlyIcon ? <MouseOverPopover text={get("copy.复制")}>
            <IconButton {...props.add} sx={sx} onClick={handleCopy} aria-label={get("copy.复制")}>
                <ContentCopyIcon />
            </IconButton>
        </MouseOverPopover> : <Button
            aria-label={get("copy.复制")}
            {...props.add as ButtonOwnProps}
            startIcon={<ContentCopyIcon />}
            sx={sx}
            onClick={handleCopy}
        >
            {get("copy.复制")}
        </Button>}
        <Snackbar open={showCopyDoneDialog} message={get("copy.已把结果复制至剪贴板。")} onClose={() => {
            setShowCopyDoneDialog(false);
        }} />
        <AlertDialog open={showCopyErrorDialog} onDone={() => {
            setShowCopyErrorDialog(false);
        }} title={get("copy.复制出现错误")} description={copyError} />
    </>;
}
export default CopyButton;

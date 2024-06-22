import {
    Close as CloseIcon
} from "@mui/icons-material";
import {
    DialogTitle,
    IconButton
} from "@mui/material";
import {
    ReactNode
} from "react";
import {
    get
} from "react-intl-universal";
import MouseOverPopover from "../Popover";
export default function BootstrapDialogTitle(props: {
    children: ReactNode;
    onClose: () => void;
}) {
    const {
        children,
        onClose
    } = props;
    return (
        <DialogTitle sx={{
            m: 0,
            p: 2
        }}>
            {children}
            {onClose ? <MouseOverPopover text={get("close")}>
                <IconButton
                    aria-label={get("close")}
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </MouseOverPopover> : null}
        </DialogTitle>
    );
}

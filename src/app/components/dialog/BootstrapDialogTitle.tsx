import {
    DialogTitle,
    IconButton
} from "@mui/material";
import {
    ReactNode
} from "react";
import {
    Close as CloseIcon
} from "@mui/icons-material";
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
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}
import {
    DialogActions,
    DialogContent,
    DialogProps
} from "@mui/material";
import {
    ReactNode
} from "react";
import BootstrapDialog from "./BootstrapDialog";
import BootstrapDialogTitle from "./BootstrapDialogTitle";
import Transition from "./Transition";
export default function PureDialog(props: {
    /**
     * 标题
     */
    title: ReactNode;
    /**
     * 内容
     */
    children: ReactNode;
    action?: ReactNode;
    /**
     * 关闭后的回调
     */
    onClose: Function;
    add?: Omit<DialogProps, "open">;
    open: boolean;
}) {
    const handleClose = () => {
        props.onClose();
    };
    return (
        <BootstrapDialog {...props.add} onClose={handleClose} open={props.open} TransitionComponent={Transition}>
            <BootstrapDialogTitle onClose={handleClose}>{props.title}</BootstrapDialogTitle>
            <DialogContent dividers>
                {props.children}
            </DialogContent>
            <DialogActions>
                {props.action}
            </DialogActions>
        </BootstrapDialog>
    );
}
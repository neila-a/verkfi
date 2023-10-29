import {
    DialogContent
} from "@mui/material";
import {
    ReactNode,
    useState
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
    /**
     * 关闭后的回调
     */
    onClose: Function;
    open: boolean;
}) {
    const handleClose = () => {
        props.onClose();
    };
    return (
        <BootstrapDialog onClose={handleClose} open={props.open} TransitionComponent={Transition}>
            <BootstrapDialogTitle onClose={handleClose}>{props.title}</BootstrapDialogTitle>
            <DialogContent dividers>
                {props.children}
            </DialogContent>
        </BootstrapDialog>
    );
}
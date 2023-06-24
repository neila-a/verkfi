import {
    DialogContent
} from "@mui/material";
import React from "react";
import BootstrapDialog from "./BootstrapDialog";
import BootstrapDialogTitle from "./BootstrapDialogTitle";
export default function PureDialog(props: {
    /**
     * 标题
     */
    title: string;
    /**
     * 内容
     */
    context: JSX.Element;
    /**
     * 关闭后的回调
     */
    onClose: () => any;
}) {
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };
    return (
        <BootstrapDialog onClose={handleClose} open={open}>
            <BootstrapDialogTitle onClose={handleClose}>{props.title}</BootstrapDialogTitle>
            <DialogContent dividers>
                {props.context}
            </DialogContent>
        </BootstrapDialog>
    );
}
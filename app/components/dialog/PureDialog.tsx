import {
    DialogContent
} from "@mui/material";
import {
    ReactNode,
    useState
} from "react";
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
    children: ReactNode;
    /**
     * 关闭后的回调
     */
    onClose: () => any;
}) {
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };
    return (
        <BootstrapDialog onClose={handleClose} open={open}>
            <BootstrapDialogTitle onClose={handleClose}>{props.title}</BootstrapDialogTitle>
            <DialogContent dividers>
                {props.children}
            </DialogContent>
        </BootstrapDialog>
    );
}
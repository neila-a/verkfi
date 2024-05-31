import {
    Dialog,
    DialogProps
} from "@mui/material";
export const BootstrapDialog = (props: DialogProps) => <Dialog {...props} sx={{
    ...props.sx,
    "& .MuiDialogContent-root": {
        p: 2
    },
    "& .MuiDialogActions-root": {
        p: 1
    }
}} />;
export default BootstrapDialog;

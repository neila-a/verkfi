import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {
    useId
} from "react";
import {
    get
} from "react-intl-universal";
import Transition from "./Transition";
export default function AlertDialog(props: {
    title: string;
    description: string;
    onDone(): any;
    open: boolean;
}) {
    const thisDialogStartId = useId(),
        titleId = `${thisDialogStartId}-alert-dialog-title`,
        descriptionId = `${thisDialogStartId}-alert-dialog-description`;
    function handleClose() {
        props.onDone();
    }
    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            TransitionComponent={Transition}
            role="alertdialog"
        >
            <DialogTitle id={titleId}>
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id={descriptionId}>
                    {props.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    {get("确定")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

import {
    get
} from 'react-intl-universal';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";
import Transition from "./Transition";
import {
    useId
} from 'react';
export default function AlertDialog(props: {
    title: string;
    description: string;
    onDone(): any;
    open: boolean;
}) {
    const handleClose = () => {
        props.onDone();
    },
        thisDialogStartId = useId(),
        titleId = `${thisDialogStartId}-alert-dialog-title`,
        descriptionId = `${thisDialogStartId}-alert-dialog-description`;
    return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby={titleId} aria-describedby={descriptionId} TransitionComponent={Transition}>
            <DialogTitle id={titleId}>
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id={descriptionId}>
                    {props.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    {get('确定')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
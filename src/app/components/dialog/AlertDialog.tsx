import I18N from 'react-intl-universal';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";
import React from "react";
import Transition from "./Transition";
export default function AlertDialog(props: {
    title: string;
    description: string;
    onDone(): any;
    open: boolean;
}) {
    const handleClose = () => {
        props.onDone();
    };
    return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" TransitionComponent={Transition}>
            <DialogTitle id="alert-dialog-title">
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    {I18N.get('确定')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
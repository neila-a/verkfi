import React, {
    useState
} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    TextField
} from "@mui/material";
import {
    TransitionProps
} from '@mui/material/transitions';
export const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export function AlertDialog(props: {
    title: string;
    description: string;
    onDone(): any;
}) {
    var [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        props.onDone();
    };
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
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
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export function InputDialog(props: {
    label: string;
    context: string | JSX.Element;
    title: string;
    onDone(context: string): any;
}) {
    var [open, setOpen] = useState(true),
        [input, setInput] = useState<string>("");
    const handleClose = () => {
        setOpen(false);
        props.onDone(input);
    };
    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} keepMounted>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.context}
                </DialogContentText>
                <TextField autoFocus margin="dense" label={props.label} fullWidth variant="standard" onChange={event => {
                    setInput(event.target.value);
                }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>确定</Button>
            </DialogActions>
        </Dialog>
    );
}
export function CheckDialog(props: {
    title: string;
    onFalse(): any;
    onTrue(): any;
    description: string;
    open: boolean;
}) {
    const [open, setOpen] = useState(props.open);
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="description">
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="description">
                    {props.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.onFalse();
                    handleClose();
                }}>取消</Button>
                <Button onClick={() => {
                    props.onTrue();
                    handleClose();
                }}>确定</Button>
            </DialogActions>
        </Dialog>
    );
}
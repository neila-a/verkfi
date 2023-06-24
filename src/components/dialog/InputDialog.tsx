import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button
} from "@mui/material";
import {
    useState
} from "react";
import Transition from "./Transition";
export default function InputDialog(props: {
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
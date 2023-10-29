import I18N from 'react-intl-universal';
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
    open: boolean;
}) {
    var [input, setInput] = useState<string>("");
    const handleClose = () => {
        props.onDone(input);
    };
    return (
        <Dialog open={props.open} onClose={handleClose} TransitionComponent={Transition} keepMounted>
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
                <Button onClick={handleClose}>{I18N.get('确定')}</Button>
            </DialogActions>
        </Dialog>
    );
}
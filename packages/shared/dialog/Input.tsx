import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    SxProps,
    TextField,
    TextFieldProps,
    Theme
} from "@mui/material";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import Transition from "./Transition";
export default function InputDialog(props: {
    label: string;
    context: string | JSX.Element;
    title: string;
    onDone(context: string): any;
    onCancel?: () => any;
    inputAdd?: Omit<TextFieldProps, "autoFocus" | "margin" | "label" | "fullWidth" | "variant" | "onChange">;
    sx?: SxProps<Theme>
    open: boolean;
}) {
    const [input, setInput] = useState<string>(""),
        handleClose = () => {
            if ("onCancel" in props) {
                props.onCancel();
            }
        };
    return (
        <Dialog open={props.open} onClose={handleClose} TransitionComponent={Transition} keepMounted sx={props?.sx}>
            <DialogTitle>
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.context}
                </DialogContentText>
                <TextField autoFocus margin="dense" label={props.label} fullWidth onChange={event => {
                    setInput(event.target.value);
                }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={event => props.onDone(input)}>
                    {get("确定")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

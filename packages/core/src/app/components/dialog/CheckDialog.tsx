import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    SxProps,
    Theme
} from "@mui/material";
import {
    ReactNode, useId
} from "react";
import {
    get
} from "react-intl-universal";
import Transition from "./Transition";
export default function CheckDialog(props: {
    title: string;
    onFalse(): any;
    onTrue(): any;
    insert?: ReactNode;
    description: string;
    open: boolean;
    sx?: SxProps<Theme>;
}) {
    const startId = useId(),
        descriptionId = `${startId}-check-dialog-description`;
    return (
        <Dialog sx={props.sx} open={props.open} TransitionComponent={Transition} aria-describedby={descriptionId}>
            <DialogTitle>
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id={descriptionId}>
                    {props.description}
                </DialogContentText>
                {props.insert}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.onFalse();
                }}>
                    {get("取消")}
                </Button>
                <Button onClick={() => {
                    props.onTrue();
                }}>
                    {get("确定")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

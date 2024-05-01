import {
    Close as CloseIcon
} from "@mui/icons-material";
import {
    AppBar,
    Dialog,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import {
    ReactNode
} from "react";
import {
    get
} from "react-intl-universal";
import MouseOverPopover from "../Popover";
import Transition from "./Transition";
export default function FullScreenDialog(props: {
    title: string;
    context: ReactNode;
    onDone(): any;
    open: boolean;
}) {
    const handleClose = () => {
        props.onDone();
    };
    return (
        <>
            <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar sx={{
                    position: 'relative'
                }}>
                    <Toolbar>
                        <Typography sx={{
                            ml: 2,
                            flex: 1
                        }} variant="h6" component="div">
                            {props.title}
                        </Typography>
                        <MouseOverPopover text={get("close")}>
                            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label={get("close")}>
                                <CloseIcon />
                            </IconButton>
                        </MouseOverPopover>
                    </Toolbar>
                </AppBar>
                {props.context}
            </Dialog>
        </>
    );
}
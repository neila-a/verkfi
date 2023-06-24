import {
    Dialog,
    AppBar,
    Toolbar,
    Typography,
    IconButton
} from "@mui/material";
import {
    ReactNode,
    useState
} from "react";
import {
    Close as CloseIcon
} from "@mui/icons-material"
import Transition from "./Transition";
export default function FullScreenDialog(props: {
    title: string;
    context: ReactNode;
    onDone(): any;
}) {
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        props.onDone();
        setOpen(false);
    };
    return (
        <>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
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
                        <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {props.context}
            </Dialog>
        </>
    );
}
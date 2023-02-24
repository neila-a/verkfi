import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide
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
export function CheckDialog(props: {
    title: string;
    onFalse(): any;
    onTrue(): any;
    description: string;
    open: boolean;
}) {
    const [open, setOpen] = React.useState(props.open);
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="description"
        >
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
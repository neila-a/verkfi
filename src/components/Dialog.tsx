import React, {
    ReactNode,
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
    TextField,
    IconButton,
    AppBar,
    Toolbar,
    Typography
} from "@mui/material";
import {
    TransitionProps
} from '@mui/material/transitions';
import {
    styled
} from '@mui/material/styles';
import {
    Close as CloseIcon
} from "@mui/icons-material";
export const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export function BootstrapDialogTitle(props: {
    children: ReactNode;
    onClose: () => void;
}) {
    const { children, onClose } = props;
    return (
        <DialogTitle sx={{ m: 0, p: 2 }}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}
export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
export default function PureDialog(props: {
    /**
     * 标题
     */
    title: string;
    /**
     * 内容
     */
    context: JSX.Element;
    /**
     * 关闭后的回调
     */
    onClose: () => any;
}) {
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };
    return (
        <BootstrapDialog onClose={handleClose} open={open}>
            <BootstrapDialogTitle onClose={handleClose}>{props.title}</BootstrapDialogTitle>
            <DialogContent dividers>
                {props.context}
            </DialogContent>
        </BootstrapDialog>
    );
}
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
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" TransitionComponent={Transition}>
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
}) {
    const [open, setOpen] = useState(true);
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
export function FullScreenDialog(props: {
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
import { I18N } from '@common/I18N';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";
import {
    useState
} from "react";
import Transition from "./Transition";
export default function CheckDialog(props: {
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
                }}>{I18N.get('取消')}</Button>
                <Button onClick={() => {
                    props.onTrue();
                    handleClose();
                }}>{I18N.get('确定')}</Button>
            </DialogActions>
        </Dialog>
    );
}
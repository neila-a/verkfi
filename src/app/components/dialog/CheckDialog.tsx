import {
    get
} from 'react-intl-universal';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";
import Transition from "./Transition";
import {
    ReactNode
} from 'react';
export default function CheckDialog(props: {
    title: string;
    onFalse(): any;
    onTrue(): any;
    insert?: ReactNode;
    description: string;
    open: boolean
}) {
    return (
        <Dialog open={props.open} TransitionComponent={Transition} aria-describedby="description">
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="description">
                    {props.description}
                </DialogContentText>
                {props.insert}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.onFalse();
                }}>{get('取消')}</Button>
                <Button onClick={() => {
                    props.onTrue();
                }}>{get('确定')}</Button>
            </DialogActions>
        </Dialog>
    );
}
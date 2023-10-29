import I18N from 'react-intl-universal';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";
import Transition from "./Transition";
export default function CheckDialog(props: {
    title: string;
    onFalse(): any;
    onTrue(): any;
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
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.onFalse();
                }}>{I18N.get('取消')}</Button>
                <Button onClick={() => {
                    props.onTrue();
                }}>{I18N.get('确定')}</Button>
            </DialogActions>
        </Dialog>
    );
}
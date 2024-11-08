import {
    CardActions
} from "@mui/material";
import {
    globalProps
} from "../consts";
export default function SingleToolActions(props: Pick<globalProps, "actions">) {
    return props?.actions && <CardActions sx={{
        justifyContent: "center",
        alignItems: "center"
    }} onClick={event => {
        event.stopPropagation();
    }} classes={{
        root: "singleTool-editControler"
    }}>
        {props?.actions}
    </CardActions>;
}

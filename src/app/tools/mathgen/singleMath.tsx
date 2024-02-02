import {
    get
} from 'react-intl-universal';
import {
    useState,
    Fragment
} from "react";
import {
    Typography,
    TextField,
    Box,
    ListItem
} from "@mui/material";
import style from "./SingleMath.module.scss";
export default function SingleMath(props: {
    math: string;
    showOut: boolean;
}): JSX.Element {
    const [isError, setError] = useState<boolean>(false),
        {
            math,
            showOut
        } = props;
    return (
        <ListItem className={style["single"]}>
            <Typography>{math.replace(/=.*/g, "")}</Typography>
            <Box className={style["out"]}>
                <TextField label={get('结果')} type="number" InputLabelProps={{
                    shrink: true,
                }} error={isError} onChange={event => {
                    setError((event.currentTarget.value == math.replace(/.*=/g, "")) ? false : true);
                }} />
                {showOut == true ? <Typography>{get('答案：')}{math.replace(/.*=/g, "")}</Typography> : <Fragment />}
            </Box>
        </ListItem>
    );
}

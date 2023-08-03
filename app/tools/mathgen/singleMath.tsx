import I18N from 'react-intl-universal';
import {
    useState,
    Fragment
} from "react";
import {
    Typography,
    TextField
} from "@mui/material";
import style from "../../styles/SingleMath.module.scss";
export default function SingleMath(props: {
    math: string;
    showOut: boolean;
}): JSX.Element {
    var [isError, setError] = useState<boolean>(false),
        { math, showOut } = props;
    return (
        <div className={style["single"]}>
            <Typography>{math.replace(/=.*/g, "")}</Typography>
            <div className={style["out"]}>
                <TextField label={I18N.get('结果')} type="number" InputLabelProps={{
                    shrink: true,
                }} error={isError} onChange={event => {
                    setError((event.currentTarget.value == math.replace(/.*=/g, "")) ? false : true);
                }} />
                {showOut == true ? <Typography>{I18N.get('答案：')}{math.replace(/.*=/g, "")}</Typography> : <Fragment />}
            </div>
        </div>
    );
}
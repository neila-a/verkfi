import {
    useState,
    Fragment
} from "react";
import {
    Typography,
    TextField
} from "@mui/material";
import style from "@/styles/SingleMath.module.scss";
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
                <TextField label="结果" type="number" InputLabelProps={{
                    shrink: true,
                }} error={isError} onChange={event => {
                    setError((event.currentTarget.value == math.replace(/.*=/g, "")) ? false : true);
                }} />
                {showOut == true ? <Typography>答案：{math.replace(/.*=/g, "")}</Typography> : <Fragment />}
            </div>
        </div>
    );
}
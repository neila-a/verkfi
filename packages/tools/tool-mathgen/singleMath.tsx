import {
    Box,
    ListItem,
    TextField,
    Typography
} from "@mui/material";
import {
    Fragment,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
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
        <ListItem sx={{
            display: "flex"
        }}>
            <Typography>
                {math.replace(/=.*/g, "")}
            </Typography>
            <Box sx={{
                flex: 1,
                textAlign: "right"
            }}>
                <TextField label={get("结果")} type="number" InputLabelProps={{
                    shrink: true
                }} error={isError} onChange={event => {
                    setError(event.target.value === math.replace(/.*=/g, "") ? false : true);
                }} />
                {showOut === true ? <Typography>
                    {get("答案：")}{math.replace(/.*=/g, "")}
                </Typography> : <Fragment />}
            </Box>
        </ListItem>
    );
}

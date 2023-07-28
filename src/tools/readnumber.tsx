import I18N from 'react-intl-universal';
import {
    FormGroup,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import LpLogger from "lp-logger";
import {
    useState
} from "react";
export const logger = new LpLogger({
    name: "ReadNumber",
    level: "log", // 空字符串时，不显示任何信息
});
import getNzh from "./readnumber/nzh";
export default function ReadNumber(): JSX.Element {
    var [blur, setBlur] = useState<"number" | "string">("number"),
        [string, setString] = useState<string>(""),
        [number, setNumber] = useState<string>("0");
    function proc(p: string) {
        const nzh = getNzh(I18N);
        switch (blur) {
            case "number":
                setString(nzh.encode(p));
                break;
            case "string":
                setNumber(nzh.decode(p));
                break;
        }
    }
    return (
        <>
            <FormGroup>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="number" gutterBottom>
                            {I18N.get('数字')}
                        </Typography>
                    </Grid>
                    <Grid item>
                    <TextField value={number} type="number" fullWidth InputLabelProps={{
                        shrink: true,
                        "aria-labelledby": "number"
                    }} onChange={event => {
                        const { value } = event.target;
                        setBlur("number");
                        setNumber(value);
                        proc(value);
                    }} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="string" gutterBottom>
                            {I18N.get('汉字')}
                        </Typography>
                    </Grid>
                    <Grid item>
                    <TextField InputLabelProps={{
                        "aria-labelledby": "string"
                    }} value={string} fullWidth onChange={event => {
                        const { value } = event.target;
                        setBlur("string");
                        setString(value);
                        proc(value);
                    }} />
                    </Grid>
                </Grid>
            </FormGroup>
        </>
    );
};

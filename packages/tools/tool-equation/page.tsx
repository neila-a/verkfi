"use client";
import {
    get
} from "react-intl-universal";
import Editor from "@verkfi/shared/Editor";
import {
    useState
} from "react";
import {
    TextField,
    Typography
} from "@mui/material";
import run from "./run";
import Decimal from "decimal.js";
export const initialMaxTimes = 1_0000_0000;
export default function Equation() {
    const [maxTimes, setMaxTimes] = useState(initialMaxTimes),
        [result, setResult] = useState<Decimal>(new Decimal(0)),
        [times, setTimes] = useState(0);
    return <Editor
        run={code => {
            const ran = run(maxTimes, code);
            setResult(ran.result);
            setTimes(ran.times);
        }}
        // eslint-disable-next-line no-magic-numbers
        tip={Array(4).fill(null).map((item, index) => get(`equation.tips.${index}`)).join("\n// ")}
    >
        <TextField
            fullWidth
            value={maxTimes}
            onChange={event => setMaxTimes(+event.target.value)}
            label={get("equation.maxTimes")}
            variant="outlined"
            type="number"
        />
        <Typography variant="body1" sx={{
            mt: 2,
            mb: 2
        }}>
            {get("equation.result", {
                times,
                result: result.toString()
            })}
        </Typography>
    </Editor>;
}

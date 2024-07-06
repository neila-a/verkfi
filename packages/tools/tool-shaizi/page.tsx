"use client";
import {
    Stack,
    TextField
} from "@mui/material";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import ShaiZiCanvas from "./shaiziCanvas";
const defaultCishu = 10;
function ShaiZi() {
    const [cishu, setCishu] = useState(defaultCishu);
    return (
        <>
            <Stack spacing={2} component="section">
                <ShaiZiCanvas cishu={cishu} />
                <TextField label={get("shaizi.掷色子的次数")} variant="outlined" value={cishu} type="number" onChange={event => {
                    setCishu(Number(event.target.value));
                }} />
            </Stack>
        </>
    );
}
export default ShaiZi;

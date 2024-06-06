"use client";
import {
    Button,
    Stack,
    TextField
} from "@mui/material";
import dynamic from "next/dynamic";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    ShaiZiCanvas
} from "./shaiziCanvas";
function ShaiZi(): JSX.Element {
    const [cishu, setCishu] = useState<number>(10);
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

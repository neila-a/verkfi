"use client";
import {
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
export default function Pillar(): JSX.Element {
    const [type, setType] = useState<0 | 1 | 2>(2);
    return (
        <>
            <FormGroup>
                <FormControl sx={{
                    mb: "9px"
                }}>
                    <TextField label={get("pillar.length")} variant="outlined" type="number" />
                </FormControl>
                <FormControl>
                    <FormLabel id="chooses-label">{get("pillar.position")}</FormLabel>
                    <RadioGroup aria-labelledby="chooses-label" defaultValue={0} name="chooses-group">
                        {[0, 1, 2].map((single) => <FormControlLabel value={single} key={single} control={<Radio />} label={get(`pillar.types.${single}`)} />)}
                    </RadioGroup>
                </FormControl>
            </FormGroup>
        </>
    );
};

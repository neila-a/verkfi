"use client";
import {
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import {
    useMemo,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import SingleCollocation from "./SingleCollocation";
type type = 0 | 1 | 2;
/**
 * 0：间隔  
 * 1：柱子
 */
const examples: (0 | 1)[][] = [[0, 1, 0], [1, 0, 1, 0], [1, 0, 1]];
/**
 * 0：柱子长度
 * 1：柱子个数
 * 2：间隔长度
 * 3：间隔个数
 */
export type collocation = [number, number, number, number];
export default function Pillar(): JSX.Element {
    const [type, setType] = useState<type>(2),
        [length, setLength] = useState<number>(0),
        pillars = useMemo<collocation[]>(() => [[1, 2, 3, 4]], [type, length]);
    return (
        <>
            <FormGroup>
                <FormControl sx={{
                    mb: "9px"
                }}>
                    <TextField
                        value={length}
                        onChange={event => setLength(Number(event.target.value))}
                        label={get("pillar.length")}
                        variant="outlined"
                        type="number"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel id="chooses-label">{get("pillar.position")}</FormLabel>
                    <RadioGroup aria-labelledby="chooses-label" value={type} onChange={(event, value) => setType(Number(value) as type)} name="chooses-group">
                        {[0, 1, 2].map((single) => (
                            <Box key={single} sx={{
                                display: "flex"
                            }}>
                                <FormControlLabel value={single} control={<Radio />} label={get(`pillar.types.${single}`)} />
                                {examples[single].map((block, index) => {
                                    const pillar = block === 1;
                                    return (
                                        <Box key={index} sx={{
                                            mb: 1,
                                            width: 48,
                                            height: 48,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: theme => `inset 0 0 0 3px ${theme.palette[pillar ? "primary" : "secondary"][theme.palette.mode]}`,
                                        }}>
                                            <Typography>{pillar ? get("pillar.name") : get("pillar.distance")}</Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
                    </RadioGroup>
                </FormControl>
            </FormGroup>
            {pillars.map(single => <SingleCollocation key={single.toString()} collocation={single} />)}
        </>
    );
};

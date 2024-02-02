"use client";
import {
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    List,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import {
    SyncProblem as SyncProblemIcon
} from "@mui/icons-material";
import {
    useMemo,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import SingleCollocation from "./SingleCollocation";
import calcPillars from "./calcPillars";
/**
 * 0：只有中间有柱子  
 * 1：一端和中间有柱子  
 * 2：两端和中间有柱子
 */
export type type = 0 | 1 | 2;
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
    const [type, setType] = useState<type>(1),
        [length, setLength] = useState<number>(0),
        pillars = calcPillars(type, length);
    return (
        <>
            <FormGroup>
                <FormControl sx={{
                    mb: 2
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
            {pillars.length === 0 ? <Box sx={{
                color: theme => theme.palette.text.disabled,
                textAlign: "center",
                cursor: "default",
                ["*"]: {
                    cursor: "default"
                }
            }}>
                <SyncProblemIcon sx={{
                    fontSize: "500%"
                }} />
                <Typography>
                    {get("pillar.no")}
                </Typography>
            </Box> : <Grid container spacing={2} component="ul" sx={{
                listStyle: "none"
            }}>
                {pillars.map(single => <SingleCollocation key={single.toString()} collocation={single} />)}
            </Grid>}
        </>
    );
};

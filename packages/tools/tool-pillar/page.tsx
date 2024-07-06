"use client";
import {
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    Slider,
    TextField,
    Typography
} from "@mui/material";
import No from "@verkfi/shared/No";
import {
    Fragment,
    useId,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import SingleCollocation from "./SingleCollocation";
import calcPillars from "./calcPillars";
const enum block {
    empty,
    fill
}
/**
 * 0：间隔
 * 1：柱子
 */
const examples = {
    "onlyMiddle": [block.empty, block.fill, block.empty],
    "oneEndAndMiddle": [block.fill, block.empty, block.fill, block.empty],
    "twoEndAndMiddle": [block.fill, block.empty, block.fill]
};
export type pillarPositions = keyof typeof examples;
const values = ["pillarLength", "pillarCount", "distanceLength", "distanceCount"] as const;
type value = typeof values[number];
/**
 * 0：柱子长度
 * 1：柱子个数
 * 2：间隔长度
 * 3：间隔个数
 */
export type collocation = Record<value, number>;
type filterRule = typeof emptyFilterRule;
type filterRules = Record<value, filterRule>;
const
    emptyFilterRule = {
        min: 0,
        max: 100
    },
    emptyFilterRules = {
    } as filterRules;
values.forEach(value => {
    emptyFilterRules[value] = {
        ...emptyFilterRule
    };
});
export default function Pillar() {
    const [type, setType] = useState<pillarPositions>("oneEndAndMiddle"),
        [length, setLength] = useState(0),
        [filterRules, setFilterRules] = useState(emptyFilterRules as filterRules),
        choosesId = useId(),
        sizeLabelId = useId(),
        pillars = calcPillars(type, length),
        filteredPillars = pillars.filter(
            single => (Object.keys(filterRules) as value[]).every(
                singleRule => single[singleRule] >= filterRules[singleRule].min && single[singleRule] <= filterRules[singleRule].max
            )
        ).map(single => <SingleCollocation key={JSON.stringify(single)} collocation={single} />);
    return (
        <>
            <FormGroup sx={{
                mb: 2
            }}>
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
                    <FormLabel id={choosesId}>
                        {get("pillar.position")}
                    </FormLabel>
                    <RadioGroup
                        aria-labelledby={choosesId}
                        value={type}
                        onChange={(event, value) => setType(value as pillarPositions)}
                        name="chooses-group"
                    >
                        {(Object.keys(examples) as pillarPositions[]).map(single => <Box key={single} sx={{
                            display: "flex"
                        }}>
                            <FormControlLabel value={single} control={<Radio />} label={get(`pillar.types.${single}`)} />
                            {examples[single].map((block, index) => <Box key={index} sx={{
                                mb: 1,
                                width: 48,
                                height: 48,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: theme => `inset 0 0 0 ${theme.spacing(1)} ${theme.palette[
                                    block === 1 ? "primary" : "secondary"
                                ][theme.palette.mode]}`
                            }}>
                                <Typography>
                                    {block === 1 ? get("pillar.name") : get("pillar.distance")}
                                </Typography>
                            </Box>)}
                        </Box>
                        )}
                    </RadioGroup>
                </FormControl>
                <Grid rowSpacing={2} container sx={{
                    mt: 1
                }}>
                    {Object.entries(filterRules).map(ruleEntrie => {
                        const name = ruleEntrie[0] as value,
                            rule = ruleEntrie[1];
                        return (
                            <Fragment key={name}>
                                <Grid item xs={1}>
                                    <FormLabel id={choosesId}>
                                        {get(`pillar.collocationShow.${name}`)}
                                    </FormLabel>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <TextField label={get("filter.type.min")} sx={{
                                        mr: 2
                                    }} value={rule.min} onChange={event => setFilterRules(old => {
                                        const realOld = {
                                            ...old
                                        };
                                        realOld[name].min = Number(event.target.value);
                                        return realOld;
                                    })} slotProps={{
                                        htmlInput: {
                                            step: 1,
                                            type: "number"
                                        }
                                    }} />
                                </Grid>
                                <Grid item xs={3} sm={7}>
                                    <Slider marks step={1} min={0} onChange={(event, newValue) => setFilterRules(old => {
                                        const realOld = {
                                            ...old
                                        };
                                        if (newValue instanceof Array) {
                                            realOld[name].min = Number(newValue[0]);
                                            realOld[name].max = Number(newValue[1]);
                                        }
                                        return realOld;
                                    })} max={length} value={[rule.min, rule.max]} aria-labelledby={sizeLabelId} />
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <TextField label={get("filter.type.max")} sx={{
                                        ml: 2
                                    }} value={rule.max} onChange={event => setFilterRules(old => {
                                        const realOld = {
                                            ...old
                                        };
                                        realOld[name].max = Number(event.target.value);
                                        return realOld;
                                    })} slotProps={{
                                        htmlInput: {
                                            step: 1,
                                            type: "number"
                                        }
                                    }} />
                                </Grid>
                            </Fragment>
                        );
                    })}
                </Grid>
            </FormGroup>
            {
                filteredPillars.length === 0 ? <No>
                    {get("pillar.no")}
                </No> : <Grid container spacing={2} component="ul" sx={{
                    listStyle: "none"
                }}>
                    {filteredPillars}
                </Grid>

            }
        </>
    );
}

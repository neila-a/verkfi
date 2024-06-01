"use client";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    FilterList as FilterListIcon,
    FilterListOff as FilterListOffIcon
} from "@mui/icons-material";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Slider,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import No from "@verkfi/shared/No";
import MouseOverPopover from "@verkfi/shared/Popover";
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
export type pillarPositions = "onlyMiddle" | "oneEndAndMiddle" | "twoEndAndMiddle";
/**
 * 0：间隔
 * 1：柱子
 */
const examples = {
    "onlyMiddle": [0, 1, 0],
    "oneEndAndMiddle": [1, 0, 1, 0],
    "twoEndAndMiddle": [1, 0, 1]
} satisfies ({
    [key in pillarPositions]: (0 | 1)[];
});
type value = "pillarLength" | "pillarCount" | "distanceLength" | "distanceCount";
const values: value[] = ["pillarLength", "pillarCount", "distanceLength", "distanceCount"];
/**
 * 0：柱子长度
 * 1：柱子个数
 * 2：间隔长度
 * 3：间隔个数
 */
export type collocation = {
    [key in value]: number;
};
interface filterRule {
    min: number;
    max: number;
}
type filterRules = {
    [key in value]: filterRule;
};
const emptyFilterRule: filterRule = {
    min: 0,
    max: 100
},
    emptyFilterRules = {
    };
values.forEach(value => {
    emptyFilterRules[value] = {
        ...emptyFilterRule
    };
});
export default function Pillar(): JSX.Element {
    const [type, setType] = useState<pillarPositions>("oneEndAndMiddle"),
        [length, setLength] = useState<number>(0),
        [filterRules, setFilterRules] = useState(emptyFilterRules as filterRules),
        choosesId = useId(),
        valueSelectLabelId = useId(),
        sizeLabelId = useId(),
        pillars = calcPillars(type, length),
        filteredPillars = pillars.filter(single => Object.entries(filterRules).every(singleRule => (
            single[singleRule[0]] >= singleRule[1].min && single[singleRule[0]] <= singleRule[1].max
        ))).map(single => (
            <SingleCollocation key={JSON.stringify(single)} collocation={single} />
        ));
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
                    <RadioGroup aria-labelledby={choosesId} value={type} onChange={(event, value: pillarPositions) => setType(value)} name="chooses-group">
                        {Object.keys(examples).map(single => (
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
                                            boxShadow: theme => `inset 0 0 0 ${theme.spacing(1)} ${theme.palette[pillar ? "primary" : "secondary"][theme.palette.mode]}`
                                        }}>
                                            <Typography>
                                                {pillar ? get("pillar.name") : get("pillar.distance")}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
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
                                    })} inputProps={{
                                        step: 1,
                                        type: "number"
                                    }} />
                                </Grid>
                                <Grid item xs={3} sm={7}>
                                    <Slider marks step={1} min={0} max={length} value={[rule.min, rule.max]} onChange={(event, newValue) => setFilterRules(old => {
                                        const realOld = {
                                            ...old
                                        };
                                        realOld[name].min = Number(newValue[0]);
                                        realOld[name].max = Number(newValue[1]);
                                        return realOld;
                                    })} aria-labelledby={sizeLabelId} />
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
                                    })} inputProps={{
                                        step: 1,
                                        type: "number"
                                    }} />
                                </Grid>
                            </Fragment>
                        );
                    })}
                </Grid>
            </FormGroup>
            {
                filteredPillars.length === 0 ? (
                    <No>
                        {get("pillar.no")}
                    </No>
                ) : (
                    <Grid container spacing={2} component="ul" sx={{
                        listStyle: "none"
                    }}>
                        {filteredPillars}
                    </Grid>
                )
            }
        </>
    );
}

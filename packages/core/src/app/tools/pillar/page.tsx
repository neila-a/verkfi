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
    Stack,
    TextField,
    Typography
} from "@mui/material";
import No from "No";
import MouseOverPopover from "components/Popover";
import {
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
type filterType = "<" | "=" | ">";
type values = "pillarLength" | "pillarCount" | "distanceLength" | "distanceCount";
const values = ["pillarLength", "pillarCount", "distanceLength", "distanceCount"];
/**
 * 0：柱子长度  
 * 1：柱子个数  
 * 2：间隔长度  
 * 3：间隔个数
 */
export type collocation = {
    [key in values]: number;
};
interface filterRule {
    value: values;
    type: filterType;
    filter: number;
    enabled: boolean;
};
export default function Pillar(): JSX.Element {
    const [type, setType] = useState<pillarPositions>("oneEndAndMiddle"),
        [length, setLength] = useState<number>(0),
        [filterRules, setFilterRules] = useState<filterRule[]>([]),
        choosesId = useId(),
        pillars = calcPillars(type, length);
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
                                            boxShadow: theme => `inset 0 0 0 ${theme.spacing(1)} ${theme.palette[pillar ? "primary" : "secondary"][theme.palette.mode]}`,
                                        }}>
                                            <Typography>{pillar ? get("pillar.name") : get("pillar.distance")}</Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormControl>
                    <Paper sx={{
                        pt: 1
                    }}>
                        <Button sx={{
                            ml: 1,
                            mr: 1,
                            width: "calc(100% - 16px)"
                        }} onClick={event => setFilterRules(old => {
                            const realOld = old.slice(0); // 深复制
                            realOld.push({
                                value: "pillarLength",
                                type: "<",
                                filter: 1,
                                enabled: true
                            });
                            return realOld;
                        })} fullWidth variant="contained" startIcon={<AddIcon />}>
                            {get("filter.addRule")}
                        </Button>
                        {filterRules.length === 0 ? (
                            <No>
                                {get("filter.noRule")}
                            </No>
                        ) : (
                            <List sx={{
                                mt: 1
                            }}>
                                {filterRules.map((rule, ruleIndex) => (
                                    <ListItem key={JSON.stringify(rule)}>
                                        <ListItemAvatar>
                                            <MouseOverPopover text={rule.enabled ? get("filter.disableRule") : get("filter.enableRule")}>
                                                <IconButton edge="start" onClick={event => {
                                                    setFilterRules(old => {
                                                        const realOld = old.slice(0),
                                                            oldRule = {
                                                                ...rule
                                                            },
                                                            oldEnabled = oldRule.enabled;
                                                        oldRule.enabled = !oldEnabled;
                                                        realOld[ruleIndex] = oldRule;
                                                        return realOld; // 解决深复制太难了，勉强这样吧，能跑就行
                                                    })
                                                }} aria-label={rule.enabled ? get("filter.disableRule") : get("filter.enableRule")}>
                                                    {rule.enabled ? <FilterListIcon /> : <FilterListOffIcon />}
                                                </IconButton>
                                            </MouseOverPopover>
                                        </ListItemAvatar>
                                        <Stack direction="row" spacing={1}>
                                            {Object.entries({
                                                value: [
                                                    values,
                                                    "pillar.collocationShow"
                                                ],
                                                type: [
                                                    ["<", "=", ">"],
                                                    "filter.type"
                                                ]
                                            }).map((select: [string, [string[], string]], index) => (
                                                <FormControl key={select[0]}>
                                                    <InputLabel id={`${select[0]}-select-label`}>
                                                        {get(`${select[1][1]}.default`)}
                                                    </InputLabel>
                                                    <Select value={rule[select[0]]} onChange={event => setFilterRules(old => {
                                                        const realOld = old.slice(0); // 深复制
                                                        realOld[ruleIndex][select[0]] = event.target.value;
                                                        return realOld;
                                                    })} labelId={`${select[0]}-select-label`} id={`${select[0]}-select`} label={get(`${select[1][1]}.default`)}>
                                                        {select[1][0].map(choose => (
                                                            <MenuItem key={choose} value={choose}>
                                                                {get(`${select[1][1]}.${choose}`)}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ))}
                                            <TextField
                                                value={rule.filter}
                                                onChange={event => setFilterRules(old => {
                                                    const realOld = old.slice(0); // 深复制
                                                    realOld[ruleIndex].filter = Number(event.target.value);
                                                    return realOld;
                                                })}
                                                label={get("pillar.collocationShow.default")}
                                                variant="outlined"
                                                type="number"
                                            />
                                        </Stack>
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label={get("删除")} onClick={event => setFilterRules(old => {
                                                const realOld = old.slice(0); // 深复制
                                                realOld.splice(ruleIndex, 1);
                                                return realOld;
                                            })}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </FormControl>
            </FormGroup>
            {pillars.length === 0 ? (
                <No>
                    {get("pillar.no")}
                </No>
            ) : (
                <Grid container spacing={2} component="ul" sx={{
                    listStyle: "none"
                }}>
                    {pillars.filter(single => {
                        const usableFilterRules = filterRules.filter(singleRule => singleRule.enabled);
                        return usableFilterRules.every(singleRule => {
                            switch (singleRule.type) {
                                case "<":
                                    return single[singleRule.value] < singleRule.filter;
                                case "=":
                                    return single[singleRule.value] == singleRule.filter; // 别用严格全等
                                case ">":
                                    return single[singleRule.value] > singleRule.filter;
                            }
                        })
                    }).map(single => <SingleCollocation key={JSON.stringify(single)} collocation={single} />)}
                </Grid>
            )}
        </>
    );
};

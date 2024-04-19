"use client";
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
    Stack,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {
    FilterList as FilterListIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    FilterListOff as FilterListOffIcon
} from "@mui/icons-material";
import {
    useId,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import SingleCollocation from "./SingleCollocation";
import calcPillars from "./calcPillars";
import No from "No";
import MouseOverPopover from "components/Popover";
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
type filterType = "<" | "=" | ">";
type filterRule = [0 | 1 | 2 | 3, filterType, number, boolean];
export default function Pillar(): JSX.Element {
    const [type, setType] = useState<type>(1),
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
                    <RadioGroup aria-labelledby={choosesId} value={type} onChange={(event, value) => setType(Number(value) as type)} name="chooses-group">
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
                            realOld.push([0, "<", 1, true]);
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
                                    <ListItem key={rule.toString()}>
                                        <ListItemAvatar>
                                            <MouseOverPopover text={filterRules[ruleIndex][3] ? get("filter.disableRule") : get("filter.enableRule")}>
                                                <IconButton edge="start" onClick={event => {
                                                    setFilterRules(old => {
                                                        const realOld = old.slice(0),
                                                            oldRule = rule.slice(0) as filterRule,
                                                            oldEnabled = oldRule[3];
                                                        oldRule[3] = !oldEnabled;
                                                        realOld[ruleIndex] = oldRule;
                                                        return realOld; // 解决深复制太难了，勉强这样吧，能跑就行
                                                    })
                                                }} aria-label={filterRules[ruleIndex][3] ? get("filter.disableRule") : get("filter.enableRule")}>
                                                    {filterRules[ruleIndex][3] ? <FilterListIcon /> : <FilterListOffIcon />}
                                                </IconButton>
                                            </MouseOverPopover>
                                        </ListItemAvatar>
                                        <Stack direction="row" spacing={1}>
                                            {([
                                                [
                                                    [0, 1, 2, 3],
                                                    "pillar.collocationShow"
                                                ],
                                                [
                                                    ["<", "=", ">"],
                                                    "filter.type"
                                                ]
                                            ] satisfies [
                                                (number | string)[],
                                                string
                                            ][]).map((select, index) => (
                                                <FormControl key={index}>
                                                    <InputLabel id={`${select[1]}-select-label`}>{get(`${select[1]}.default`)}</InputLabel>
                                                    <Select onChange={event => setFilterRules(old => {
                                                        const realOld = old.slice(0); // 深复制
                                                        realOld[ruleIndex][index] = index === 0 ? Number(event.target.value) : (event.target.value as filterType);
                                                        return realOld;
                                                    })} labelId={`${select[1]}-select-label`} id={`${select[1]}-select`} value={
                                                        rule[index] as any
                                                        /*
                                                         * 此处rule[index]的类型应为 filterType | 0 | 1 | 2 | 3，但是由于TS的类型自动推断出现了问题，只能省略类型
                                                         */
                                                    } label={get(`${select[1]}.default`)}>
                                                        {select[0].map(choose => <MenuItem key={choose} value={choose}>{get(`${select[1]}.${choose}`)}</MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                            ))}
                                            <TextField
                                                value={rule[2]}
                                                onChange={event => setFilterRules(old => {
                                                    const realOld = old.slice(0); // 深复制
                                                    realOld[ruleIndex][2] = Number(event.target.value);
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
                        const usableFilterRules = filterRules.filter(singleRule => singleRule[3]);
                        return usableFilterRules.every(singleRule => {
                            switch (singleRule[1]) {
                                case "<":
                                    return single[singleRule[0]] < singleRule[2];
                                case "=":
                                    return single[singleRule[0]] == singleRule[2]; // 别用严格全等
                                case ">":
                                    return single[singleRule[0]] > singleRule[2];
                            }
                        })
                    }).map(single => <SingleCollocation key={single.toString()} collocation={single} />)}
                </Grid>
            )}
        </>
    );
};

import {
    FC,
    useState
} from "react"
import {
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Button,
    Paper
} from "@mui/material"
import I18N from "react-intl-universal";
import {
    getTools
} from "../tools/info";
function not(a: string[], b: string[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}
function intersection(a: string[], b: string[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}
export default function TransferList(props: {
    left: string[];
    right: string[];
    onLeftChange: (context: string[]) => void;
    onRightChange: (context: string[]) => void;
}) {
    const toolsList = getTools(I18N),
        [checked, setChecked] = useState<string[]>([]),
        [left, setLeft] = useState<string[]>(props.left),
        [right, setRight] = useState<string[]>(props.right),
        leftChecked = intersection(checked, left),
        rightChecked = intersection(checked, right),
        handleToggle = (value: string) => () => {
            const currentIndex = checked.indexOf(value);
            const newChecked = [...checked];
            if (currentIndex === -1) {
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setChecked(newChecked);
        },
        handleAllRight = () => {
            const newRight = right.concat(left);
            setRight(newRight);
            setLeft([]);
            props.onLeftChange([]);
            props.onRightChange(newRight);
        },
        handleCheckedRight = () => {
            const newRight = right.concat(leftChecked),
                newLeft = not(left, leftChecked);
            setRight(newRight);
            setLeft(newLeft);
            setChecked(not(checked, leftChecked));
            props.onLeftChange(newLeft);
            props.onRightChange(newRight);
        },
        handleCheckedLeft = () => {
            const newLeft = left.concat(rightChecked),
                newRight = not(right, rightChecked);
            setLeft(newLeft);
            setRight(newRight);
            setChecked(not(checked, rightChecked));
            props.onLeftChange(newLeft);
            props.onRightChange(newRight);
        },
        handleAllLeft = () => {
            const newLeft = left.concat(right);
            setLeft(newLeft);
            setRight([]);
            props.onLeftChange(newLeft);
            props.onRightChange([]);
        },
        customList = (items: string[]) => {
            return (
                <Paper sx={{
                    width: 200,
                    height: 230,
                    overflow: 'auto'
                }}>
                    <List dense component="div" role="list">
                        {items.map(value => {
                            var Icon: FC = () => <></>;
                            toolsList.forEach(single => {
                                if (single.name === value) {
                                    Icon = single.icon;
                                }
                            });
                            const labelId = `transfer-list-item-${value}-label`;
                            return (
                                <ListItem
                                    key={value}
                                    role="listitem"
                                    button
                                    onClick={handleToggle(value)}
                                >
                                    <ListItemIcon sx={{
                                        alignItems: "center"
                                    }}>
                                        <Checkbox
                                            checked={checked.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{
                                                'aria-labelledby': labelId,
                                            }}
                                        />
                                        <Icon />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={value} />
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            );
        }
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{
            p: "10px 0px"
        }}>
            <Grid item>{customList(left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList(right)}</Grid>
        </Grid>
    );
}
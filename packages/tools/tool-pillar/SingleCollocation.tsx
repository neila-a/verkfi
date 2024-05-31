"use client";
import {
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper
} from "@mui/material";
import CopyButton from "@verkfi/shared/CopyButton";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    collocation
} from "./page";
export default function SingleCollocation(props: {
    collocation: collocation;
}) {
    const [elevation, setElevation] = useState<number>(2);
    return (
        <Grid item component="li">
            <Paper sx={{
                minWidth: 155 // 经过测量得出的
            }} elevation={elevation} onMouseEnter={event => {
                setElevation(8);
            }} onMouseLeave={event => {
                setElevation(2); // reset to default
            }}>
                <List>
                    {Object.entries(props.collocation).map((value, index) => (
                        <ListItem key={value[0]} sx={{
                            mb: index === 1 && 1,
                            pt: 0,
                            pb: 0
                        }} secondaryAction={(
                            <CopyButton onlyIcon>
                                {value.toString()}
                            </CopyButton>
                        )}>
                            <ListItemText>
                                {get(`pillar.collocationShow.${value[0]}`)}: {value[1]}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Grid>
    );
}

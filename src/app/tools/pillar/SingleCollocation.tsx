"use client";
import {
    Paper,
    Typography
} from "@mui/material";
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
        <Paper sx={{
            p: 2
        }} elevation={elevation} onMouseEnter={event => {
            setElevation(8);
        }} onMouseLeave={event => {
            setElevation(2); // reset to default
        }}>
            {props.collocation.map((value, index) => <Typography sx={{
                mb: index === 1 ? 1 : ""
            }} key={index}>{get(`pillar.collocationShow.${index}`)}: {value}</Typography>)}
        </Paper>
    );
}

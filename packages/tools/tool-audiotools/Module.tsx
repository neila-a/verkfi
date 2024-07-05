"use client";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography
} from "@mui/material";
import {
    ReactNode
} from "react";
import {
    get
} from "react-intl-universal";
export default function Module(props: {
    title: string;
    children: ReactNode;
}) {
    return <Accordion defaultExpanded>
        <AccordionSummary>
            <Typography variant="h4">
                {get(props.title)}
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            {props.children}
        </AccordionDetails>
    </Accordion>;
}

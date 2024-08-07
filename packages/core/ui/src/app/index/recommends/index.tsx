"use client";
import {
    Box,
    Button,
    Collapse,
    Typography
} from "@mui/material";
import recommendAtom from "@verkfi/shared/atoms/recommend";
import {
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    get
} from "react-intl-universal";
import {
    showRecommendsAtom
} from "index/atoms";
import {
    Suspense,
    startTransition
} from "react";
import InnerRecommends from "./Inner";
import ToolsSkeleton from "index/showTool/skeleton";
export default function Recommends() {
    const refreshTries = useSetAtom(recommendAtom),
        showRecommends = useAtomValue(showRecommendsAtom);
    return <Collapse in={showRecommends}>
        <Box>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Typography variant="h4">
                    {get("index.trythese")}
                </Typography>
                <Button onClick={event => {
                    return startTransition(refreshTries);
                }}>
                    {get("index.newTries")}
                </Button>
            </Box>
            <Box sx={{
                p: 1
            }}>
                <Suspense fallback={<ToolsSkeleton />}>
                    <InnerRecommends />
                </Suspense>
            </Box>
        </Box>
    </Collapse>;
}

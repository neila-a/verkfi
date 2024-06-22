"use client";
import {
    Box,
    Button,
    Collapse,
    Typography
} from "@mui/material";
import ToolsStack from "index/showTool";
import recommendAtom from "@verkfi/shared/atoms/recommend";
import {
    useAtom,
    useAtomValue
} from "jotai";
import {
    get
} from "react-intl-universal";
import {
    showRecommendsAtom
} from "index/atoms";
export default function Recommends() {
    const [recommend, refreshTries] = useAtom(recommendAtom), showRecommends = useAtomValue(showRecommendsAtom);
    return <Collapse in={showRecommends}>
        <Box>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Typography variant="h4">
                    {get("index.trythese")}
                </Typography>
                <Button onClick={event => refreshTries()}>
                    {get("index.newTries")}
                </Button>
            </Box>
            <Box sx={{
                p: 1
            }}>
                <ToolsStack
                    paramTool={recommend.filter(item => item !== undefined)} />
            </Box>
        </Box>
    </Collapse>;
}

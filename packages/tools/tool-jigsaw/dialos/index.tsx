"use client";
import {
    Close,
    Replay
} from "@mui/icons-material";
import {
    AppBar,
    Dialog,
    DialogContent,
    Drawer,
    IconButton,
    ImageList,
    Toolbar,
    Typography,
    useMediaQuery
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import Transition from "@verkfi/shared/dialog/Transition";
import {
    get
} from "react-intl-universal";
import {
    useAtom,
    useAtomValue,
    useSetAtom
} from "jotai";
import atoms from "../atoms";
import Selects from "../selects";
import JigsawBlocks from "../JigsawBlocks";
export default function MainDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(atoms.dialogOpen.main),
        [width, height] = useAtomValue(atoms.image.size),
        imageFile = useAtomValue(atoms.image.file),
        setResetDialogOpen = useSetAtom(atoms.dialogOpen.reset),

        // 响应式
        portrait = useMediaQuery("(orientation: portrait)"),
        widtha = portrait ? `calc(100vw / ${width})` : `calc(100vw / (${width} + 1))`;
    return <Dialog TransitionComponent={Transition} open={dialogOpen} fullScreen onClose={() => {
        setDialogOpen(false);
    }} sx={{
        zIndex: "38601"
    }}>
        <AppBar position="relative">
            <Toolbar sx={{
                mr: !portrait ? widtha : ""
            }}>
                <Typography sx={{
                    flex: 1
                }} variant="h6" component="div">
                    {imageFile.name}
                </Typography>
                <MouseOverPopover text={get("jigsaw.reset")}>
                    <IconButton sx={{
                        mr: 1
                    }} edge="end" color="inherit" onClick={async () => {
                        setResetDialogOpen(true);
                    }} aria-label={get("jigsaw.reset")}>
                        <Replay />
                    </IconButton>
                </MouseOverPopover>
                <MouseOverPopover text={get("close")}>
                    <IconButton edge="end" color="inherit" onClick={() => {
                        setDialogOpen(false);
                    }} aria-label={get("close")}>
                        <Close />
                    </IconButton>
                </MouseOverPopover>
            </Toolbar>
        </AppBar>
        <DialogContent sx={{
            p: 0
        }}>
            <ImageList variant="masonry" cols={height} gap={1} sx={{
                width: `calc(${widtha} * ${width})`,
                writingMode: "vertical-lr",
                m: 0
            }}>
                <JigsawBlocks />
            </ImageList>
            <Drawer sx={{
                width: portrait ? "100vw" : widtha,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: portrait ? "100vw" : widtha,
                    flexDirection: portrait ? "row" : "column"
                }
            }} variant="persistent" anchor={portrait ? "bottom" : "right"} open>
                <Selects />
            </Drawer>
        </DialogContent>
    </Dialog>;
}

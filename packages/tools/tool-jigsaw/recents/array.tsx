import {
    useAtom,
    useSetAtom
} from "jotai";
import atoms from "../atoms";
import {
    Delete,
    PlayArrow
} from "@mui/icons-material";
import {
    ImageListItem,
    ImageListItemBar,
    Box,
    IconButton
} from "@mui/material";
import No from "@verkfi/shared/No";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    get
} from "react-intl-universal";
export default function RecentsArray() {
    const [jigsaws, setJigsaws] = useAtom(atoms.jigsaws.all),
        setSize = useSetAtom(atoms.image.size),
        setImageArray = useSetAtom(atoms.image.array),
        setDialogOpen = useSetAtom(atoms.dialogOpen.main);
    return Object.keys(jigsaws).length === 0 ? <No>
        {get("jigsaw.noRecent")}
    </No> : Object.entries(jigsaws).map(jigsaw => {
        const src = URL.createObjectURL(jigsaw[1].file);
        return <ImageListItem key={jigsaw[0]}>
            <img src={src} alt={jigsaw[1].file.name} onLoad={event => {
                URL.revokeObjectURL(src);
            }} loading="lazy" />
            <ImageListItemBar title={jigsaw[1].file.name} subtitle={(
                <>
                    {get("jigsaw.split.height")}: {jigsaw[1].rightBlocks.length}
                    <br />
                    {get("jigsaw.split.width")}: {jigsaw[1].rightBlocks[0].length}
                </>
            )} actionIcon={(
                <Box sx={{
                    ["& button"]: {
                        color: theme => `${theme.palette.primary.main} !important`
                    }
                }}>
                    <MouseOverPopover text={get("jigsaw.delete")}>
                        <IconButton onClick={async event => {
                            const old = structuredClone(jigsaws);
                            Reflect.deleteProperty(old, jigsaw[0]);
                            setJigsaws(old);
                        }} aria-label={get("jigsaw.delete")}>
                            <Delete />
                        </IconButton>
                    </MouseOverPopover>
                    <MouseOverPopover text={get("jigsaw.start")}>
                        <IconButton onClick={event => {
                            setSize([
                                jigsaw[1].rightBlocks[0].length,
                                jigsaw[1].rightBlocks.length
                            ]);
                            setImageArray([jigsaw[1].file]);
                            setDialogOpen(true);
                        }} aria-label={get("jigsaw.start")}>
                            <PlayArrow />
                        </IconButton>
                    </MouseOverPopover>
                </Box>
            )} />
        </ImageListItem>;
    });
}

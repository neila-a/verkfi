import {
    ImageListItem,
    useMediaQuery
} from "@mui/material";
import {
    useSetAtom,
    useAtomValue
} from "jotai";
import atoms from "./atoms";
export default function JigsawBlocks() {
    const

        // states
        jigsaws = useAtomValue(atoms.jigsaws.all),
        imageKey = useAtomValue(atoms.image.fileKey),
        selecting = useAtomValue(atoms.selecting),
        [width, height] = useAtomValue(atoms.image.size),
        publicMoving = useSetAtom(atoms.jigsaws.movinger),

        // 响应式
        portrait = useMediaQuery("(orientation: portrait)"),
        widtha = portrait ? `calc(100vw / ${width})` : `calc(100vw / (${width} + 1))`,
        heighta = portrait ? `calc((100vh - 56px) / (${height} + 1))` : `calc((100vh - 64px) / ${height})`;
    return jigsaws[imageKey].rightBlocks.map((b, rowIndex) => b.map((c, columnIndex) => {
        const jigsaw = jigsaws[imageKey],
            finding = jigsaw.blocks.flat()[rowIndex * width + columnIndex],
            right = finding !== undefined && finding !== null,
            moving = () => publicMoving(jigsaw, rowIndex, columnIndex);
        return (
            <ImageListItem key={`${rowIndex},${columnIndex}`} onClick={async event => {
                if (selecting[0] === rowIndex && selecting[1] === columnIndex) {
                    await moving();
                }
            }} onDragOver={event => {
                event.preventDefault();
            }} onDrop={async event => {
                event.preventDefault();
                const parsed = JSON.parse(event.dataTransfer.getData("application/json")) satisfies typeof selecting;
                if (parsed[0] === rowIndex && parsed[1] === columnIndex) {
                    await moving();
                }
            }} sx={{
                borderColor: theme => right ? theme.palette.primary.main : theme.palette.grey[400],
                borderWidth: 1,
                borderStyle: "solid",
                width: widtha,
                height: `${heighta} !important`
            }}>
                <img alt="" style={{
                    objectFit: "fill",
                    display: right ? "" : "none"
                }} src={URL.createObjectURL(c)} />
            </ImageListItem>
        );
    }));
}

import {
    useAtomValue,
    useSetAtom
} from "jotai";
import atoms from "../atoms";
import {
    useMediaQuery
} from "@mui/material";
import {
    dragImageSize
} from "../consts";
export default function SingleSelect(props: {
    rowIndex: number;
    columnIndex: number;
    column: Blob;
}) {
    const

        // 拼图
        thisJigsaw = useAtomValue(atoms.jigsaws.selected),
        [width, height] = useAtomValue(atoms.image.size),
        setSelecting = useSetAtom(atoms.selecting),
        finding = thisJigsaw.blocks.flat()[props.rowIndex * width + props.columnIndex],

        // 响应式
        portrait = useMediaQuery("(orientation: portrait)"),
        widtha = portrait ? `calc(100vw / ${width})` : `calc(100vw / (${width} + 1))`,
        heighta = portrait ? `calc((100vh - 56px) / (${height} + 1))` : `calc((100vh - 64px) / ${height})`;
    if (finding === undefined || finding === null) {
        const src = URL.createObjectURL(props.column);
        // eslint-disable-next-line @next/next/no-img-element
        return <img draggable onDragStart={event => {
            event.dataTransfer.setData("application/json", JSON.stringify([props.rowIndex, props.columnIndex]));
            event.dataTransfer.setDragImage(event.currentTarget, dragImageSize, dragImageSize);
            event.dataTransfer.dropEffect = "move";
        }
        } onClick={event => {
            setSelecting([props.rowIndex, props.columnIndex]);
        }
        } onLoad={event => {
            URL.revokeObjectURL(src);
        }} alt="" style={{
            width: widtha,
            height: heighta,
            borderColor: "green",
            borderWidth: 1,
            borderStyle: "solid",
            display: "inline-block"
        }} src={src} />;
    }
    return null;
}

import {
    TextField
} from "@mui/material";
import {
    get
} from "react-intl-universal";
import {
    useAtomValue,
    useSetAtom
} from "jotai";
import atoms from "./atoms";
export default function SplitInputs() {
    const [width, height] = useAtomValue(atoms.image.size),
        set = useSetAtom(atoms.image.size);
    return <>
        <TextField margin="dense" value={width} variant="outlined" onChange={event => {
            set([Number(event.target.value), height]);
        }} label={get("jigsaw.split.width")} type="number" />
        <TextField margin="dense" value={height} variant="outlined" onChange={event => {
            set([width, Number(event.target.value)]);
        }} label={get("jigsaw.split.height")} type="number" />
    </>;
}

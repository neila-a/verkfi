import {
    Done
} from "@mui/icons-material";
import {
    Box,
    SxProps,
    Theme,
    Typography
} from "@mui/material";
import {
    shuffle
} from "d3-array";
import atoms from "../atoms";
import SingleSelect from "./single";
import {
    useAtomValue
} from "jotai";
import {
    get
} from "react-intl-universal";
export default function Selects() {
    const
        thisJigsaw = useAtomValue(atoms.jigsaws.selected),
        selects = thisJigsaw?.rightBlocks.map((row, rowIndex) => row.map(
            (column, columnIndex) => <SingleSelect rowIndex={rowIndex} columnIndex={columnIndex} column={column} key={[rowIndex, columnIndex].join()} />
        ));
    return selects.flat(Infinity).filter(select => select !== undefined).length === 0 ? <Box sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    }}>
        <Done sx={{
            fontSize: "500%",
            color: theme => theme.palette.primary.main
        } as SxProps<Theme>} />
        <Typography variant="h4">
            {get("jigsaw.allDone")}
        </Typography>
    </Box> : shuffle(selects);
}
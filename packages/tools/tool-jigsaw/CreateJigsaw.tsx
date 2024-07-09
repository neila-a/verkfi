"use client";
import {
    PlayArrow
} from "@mui/icons-material";
import {
    Box,
    Button,
    Theme,
    Typography,
    useMediaQuery
} from "@mui/material";
import {
    FilePondServerConfigProps
} from "filepond";
import {
    FilePond
} from "react-filepond"; // Import React FilePond
import {
    get
} from "react-intl-universal";
import SplitInputs from "./SplitInputs";
import {
    useAtom,
    useSetAtom
} from "jotai";
import atoms from "./atoms";
export default function CreateJigsaw() {
    const column = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm")),
        [imageArray, setImageArray] = useAtom(atoms.image.array),
        start = useSetAtom(atoms.jigsaws.starter),
        setDialogOpen = useSetAtom(atoms.dialogOpen.main);
    return <Box sx={{
        mb: 5
    }}>
        <Typography variant="h4">
            {get("jigsaw.new")}
        </Typography>
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            flexDirection: column ? "column" : "row"
        }}>
            <Box sx={column ? {
                width: "100%"
            } : {
                flex: 0.95
            }}>
                <FilePond
                    files={imageArray as unknown as FilePondServerConfigProps["files"]}
                    onupdatefiles={images => {
                        const fileImages = images.map(image => new File([image.file], image.filename, {
                            ...image.file
                        }));
                        setImageArray(fileImages);
                    }}
                    maxFiles={1}
                    acceptedFileTypes={["image/*"]}
                    name="files"
                    labelIdle={get("drag.拖拽图片到这里")}
                />
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column"
            }}>
                <SplitInputs />
            </Box>
        </Box>
        <Button variant="contained" onClick={async () => {
            start();
            setDialogOpen(true);
        }} fullWidth disabled={imageArray.length === 0} startIcon={<PlayArrow />}>
            {get("jigsaw.start")}
        </Button>
    </Box>;
}

"use client";
import {
    Close,
    Delete,
    Done,
    PlayArrow,
    Replay
} from "@mui/icons-material";
import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogContent,
    Drawer,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {
    FilePondFile,
    FilePondServerConfigProps
} from "filepond";
import {
    useState
} from "react";
import {
    FilePond
} from 'react-filepond'; // Import React FilePond
import {
    get
} from "react-intl-universal";
import Transition from "components/dialog/Transition";
import CheckDialog from "dialog/Check";
import useStoragedState from "useStoragedState";
import {
    shuffle
} from "d3-array";
import canvasToBlob from "./canvasToBlob";
import No from "No";
import MouseOverPopover from "components/Popover";
type block = Blob & {
    rotation: number;
};
interface jigsaw {
    /**
     * 第一个数组是—，第二数组是|
     */
    rightBlocks: Blob[][];
    blocks: block[][];
    /**
     * 效验用
     */
    all: Blob;
    fileName: string;
}
const blobToInt8Array = async (blob: Blob) => new Int8Array(await blob.arrayBuffer()).join("");
export default function JigsawEntry(): JSX.Element {
    const [imageArray, setImageArray] = useState<FilePondFile[]>([]),
        [imageFileName, setImageFileName] = useState<string>(""),
        [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [width, setWidth] = useState<number>(3),
        [height, setHeight] = useState<number>(3),
        [jigsaws, setJigsaws] = useStoragedState<jigsaw[]>("jigsaws", "拼图", []),
        [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false),
        theme = useTheme(),
        portrait = useMediaQuery("(orientation: portrait)"),
        widtha = portrait ? `calc(100vw / ${width})` : `calc(100vw / (${width} + 1))`,
        heighta = portrait ? `calc((100vh - 56px) / (${height} + 1))` : `calc((100vh - 64px) / ${height})`,
        column = useMediaQuery(theme.breakpoints.down('sm')),
        splitInputs = (
            <>
                <TextField margin="dense" value={width} variant="outlined" onChange={event => {
                    setWidth(Number(event.target.value));
                }} label={get("jigsaw.split.width")} type="number" />
                <TextField margin="dense" value={height} variant="outlined" onChange={event => {
                    setHeight(Number(event.target.value));
                }} label={get("jigsaw.split.height")} type="number" />
            </>
        ),
        [selecting, setSelecting] = useState<[number, number]>([-1, -1]),
        [imageFile, setImageFile] = useState<Blob>(new Blob()),
        selects = jigsaws.filter(a => a.all === imageFile).map(n => n.rightBlocks.map((b, rowIndex) => b.map((c, columnIndex) => {
            const finding = n.blocks.flat()[rowIndex * width + columnIndex];
            if (finding === undefined || finding === null) {
                return (
                    <img draggable onDragStart={event => {
                        event.dataTransfer.setData("application/json", JSON.stringify([rowIndex, columnIndex]));
                        event.dataTransfer.setDragImage(event.currentTarget, 32, 32);
                        event.dataTransfer.dropEffect = "move";
                    }} onClick={event => {
                        setSelecting([rowIndex, columnIndex]);
                    }} alt="" key={`${rowIndex},${columnIndex}`} style={{
                        width: widtha,
                        height: heighta,
                        borderColor: "green",
                        borderWidth: 1,
                        borderStyle: "solid",
                        display: "inline-block"
                    }} src={URL.createObjectURL(c)} />
                );
            }
        })));
    function start() {
        const img = new Image();
        img.src = URL.createObjectURL(imageFile);
        img.onload = async event => {
            const canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                splited: Blob[][] = [];
            canvas.width = img.width / width;
            canvas.height = img.height / height;
            for (let y = 0; y < height; y++) {
                const thisBuffer: Blob[] = [];
                for (let x = 0; x < width; x++) {
                    context.drawImage(img, x * img.width / width, y * img.height / height, img.width / width, img.height / height, 0, 0, img.width / width, img.height / height);
                    thisBuffer.push(await canvasToBlob(canvas));
                    context.clearRect(0, 0, img.width / width, img.height / height);
                }
                splited.push(thisBuffer);
            }
            URL.revokeObjectURL(img.src);
            const addingJigsaw = {
                rightBlocks: splited,
                blocks: [],
                all: imageFile,
                fileName: imageFileName
            },
                booleans = await Promise.all(jigsaws.map(async jigsaw => await blobToInt8Array(jigsaw.all) === await blobToInt8Array(imageFile))),
                index = booleans.indexOf(true);
            if (index > -1) {
                const old = jigsaws.slice(0);
                old[index] = addingJigsaw;
                setJigsaws(old);
            } else {
                const old = jigsaws.slice(0);
                old.push(addingJigsaw);
                setJigsaws(old);
            }
        }
    }
    return (
        <>
            <Box sx={{
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
                                setImageArray(images);
                                images.forEach(image => {
                                    setImageFileName(image.filename);
                                    setImageFile(image.file);
                                });
                            }}
                            maxFiles={1}
                            acceptedFileTypes={["image/*"]}
                            name="files"
                            labelIdle={get('drag.拖拽图片到这里')}
                        />
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        {splitInputs}
                    </Box>
                </Box>
                <Button variant="contained" onClick={async event => {
                    await start();
                    setDialogOpen(true);
                }} fullWidth disabled={imageArray.length === 0} startIcon={<PlayArrow />}>
                    {get("jigsaw.start")}
                </Button>
            </Box>
            <Box>
                <ImageListItem key="Subheader">
                    <Typography variant="h4">
                        {get("jigsaw.recent")}
                    </Typography>
                </ImageListItem>
                {jigsaws.length === 0 ? (
                    <No>
                        {get("jigsaw.noRecent")}
                    </No>
                ) : jigsaws.map(jigsaw => (
                    <ImageListItem key={`${jigsaw.all.size}@${jigsaw.fileName}`}>
                        <img
                            src={URL.createObjectURL(jigsaw.all)}
                            alt={jigsaw.fileName}
                            loading="lazy"
                        />
                        <ImageListItemBar title={jigsaw.fileName} subtitle={(
                            <>
                                {get("jigsaw.split.height")}: {jigsaw.rightBlocks.length}
                                <br />
                                {get("jigsaw.split.width")}: {jigsaw.rightBlocks[0].length}
                            </>
                        )} actionIcon={(
                            <Box sx={{
                                ["& button"]: {
                                    color: theme => `${theme.palette.primary.main} !important`
                                }
                            }}>
                                <MouseOverPopover text={get("jigsaw.delete")}>
                                    <IconButton onClick={async event => {
                                        jigsaws.forEach(async (singleOld, index) => {
                                            if (await blobToInt8Array(singleOld.all) === await blobToInt8Array(jigsaw.all)) {
                                                setJigsaws(jigsaws.toSpliced(index, 1));
                                            }
                                        });
                                    }} aria-label={get("jigsaw.delete")}>
                                        <Delete />
                                    </IconButton>
                                </MouseOverPopover>
                                <MouseOverPopover text={get("jigsaw.start")}>
                                    <IconButton onClick={event => {
                                        setWidth(jigsaw.rightBlocks[0].length);
                                        setHeight(jigsaw.rightBlocks.length);
                                        setImageFile(jigsaw.all);
                                        setImageFileName(jigsaw.fileName);
                                        setDialogOpen(true);
                                    }} aria-label={get("jigsaw.start")}>
                                        <PlayArrow />
                                    </IconButton>
                                </MouseOverPopover>
                            </Box>
                        )} />
                    </ImageListItem>
                ))}
            </Box>
            <Dialog TransitionComponent={Transition} open={dialogOpen} fullScreen onClose={event => {
                setDialogOpen(false);
            }} sx={{
                zIndex: "38601"
            }}>
                <AppBar position="relative">
                    <Toolbar sx={{
                        mr: !portrait && widtha
                    }}>
                        <Typography sx={{
                            flex: 1
                        }} variant="h6" component="div">
                            {imageFileName}
                        </Typography>
                        <MouseOverPopover text={get("jigsaw.reset")}>
                            <IconButton sx={{
                                mr: 1
                            }} edge="end" color="inherit" onClick={async event => {
                                setResetDialogOpen(true);
                            }} aria-label={get("jigsaw.reset")}>
                                <Replay />
                            </IconButton>
                        </MouseOverPopover>
                        <MouseOverPopover text={get("close")}>
                            <IconButton edge="end" color="inherit" onClick={event => {
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
                        {jigsaws.filter(a => a.all === imageFile).map(n => n.rightBlocks.map((b, rowIndex) => b.map((c, columnIndex) => {
                            const finding = n.blocks.flat()[rowIndex * width + columnIndex],
                                right = finding !== undefined && finding !== null;
                            async function publicMoving() {
                                const addingJigsaw: jigsaw = {
                                    ...n,
                                    blocks: n.rightBlocks.map((b1, indexb1) => b1.map((c1, indexc1) => {
                                        if (indexb1 === rowIndex && indexc1 === columnIndex) {
                                            const old = c1 as block;
                                            Object.defineProperty(old, "rotation", {
                                                value: 0
                                            });
                                            return old;
                                        }
                                        return n.blocks?.[indexb1]?.[indexc1];
                                    })).filter(item => item !== undefined)
                                },
                                    booleans = await Promise.all(jigsaws.map(async jigsaw => await blobToInt8Array(jigsaw.all) === await blobToInt8Array(imageFile))),
                                    index = booleans.indexOf(true);
                                const old = jigsaws.slice(0);
                                old[index] = addingJigsaw;
                                setJigsaws(old);
                            }
                            return (
                                <ImageListItem key={`${rowIndex},${columnIndex}`} onClick={async event => {
                                    if (selecting[0] === rowIndex && selecting[1] === columnIndex) {
                                        await publicMoving();
                                    }
                                }} onDragOver={event => {
                                    event.preventDefault();
                                }} onDrop={async event => {
                                    event.preventDefault();
                                    const parsed = JSON.parse(event.dataTransfer.getData("application/json")) satisfies typeof selecting;
                                    if (parsed[0] === rowIndex && parsed[1] === columnIndex) {
                                        await publicMoving();
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
                        })))}
                    </ImageList>
                    <Drawer sx={{
                        width: portrait ? "100vw" : widtha,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: portrait ? "100vw" : widtha,
                            flexDirection: portrait ? "row" : "column"
                        }
                    }} variant="persistent" anchor={portrait ? "bottom" : "right"} open>
                        {selects.flat(Infinity).filter(select => select !== undefined).length === 0 ? <Box sx={{
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
                            }} />
                            <Typography variant="h4">
                                {get("jigsaw.allDone")}
                            </Typography>
                        </Box> : shuffle(selects)}
                    </Drawer>
                </DialogContent>
            </Dialog>
            <CheckDialog sx={{
                zIndex: "38602"
            }} insert={splitInputs} open={resetDialogOpen} onFalse={() => {
                setResetDialogOpen(false);
            }} title={get("jigsaw.reset")} description={get("jigsaw.resetDescription")} onTrue={async () => {
                start();
                setResetDialogOpen(false);
            }} />
        </>
    );
};
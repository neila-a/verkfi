"use client";
/* eslint-disable @next/next/no-img-element */
// 这里的img全是blob生成的
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
    Theme,
    Toolbar,
    Typography,
    useMediaQuery
} from "@mui/material";
import No from "@verkfi/shared/No";
import MouseOverPopover from "@verkfi/shared/Popover";
import Transition from "@verkfi/shared/dialog/Transition";
import {
    shuffle
} from "d3-array";
import CheckDialog from "@verkfi/shared/dialog/Check";
import {
    FilePondServerConfigProps
} from "filepond";
import {
    useEffect,
    useMemo,
    useState
} from "react";
import {
    FilePond
} from "react-filepond"; // Import React FilePond
import {
    get
} from "react-intl-universal";
import useStoragedState from "@verkfi/shared/reader/useStoragedState";
import canvasToBlob from "./canvasToBlob";
import range from "@verkfi/shared/range";
type block = Blob & {
    rotation: number;
};
interface jigsaw {
    /**
     * 第一个数组是—，第二数组是|
     */
    rightBlocks: Blob[][];
    blocks: block[][];
    file: File;
}
const keySize = 10000,
    emptyFile = new File([], "empty"),
    blobToInt8Array = async (blob: Blob) => new Int8Array(await blob.slice(0, keySize).arrayBuffer()).join("").slice(0, keySize),
    initialSize = 3,
    dragImageSize = 32;
export default function JigsawEntry() {
    const

        // 拼图本身信息
        [imageArray, setImageArray] = useState<File[]>([]),
        imageFile = useMemo(() => imageArray?.[0] || emptyFile, [imageArray]),
        [width, setWidth] = useState(initialSize),
        [height, setHeight] = useState(initialSize),

        /** 
         * 计算的key
         */
        [imageFileKey, setImageFileKey] = useState<string>(""),
        [selecting, setSelecting] = useState<[number, number]>([-1, -1]),

        // 所有拼图
        [jigsaws, setJigsaws] = useStoragedState<Record<string, jigsaw>>("jigsaws", {
        }),
        thisJigsaw = jigsaws[imageFileKey],

        // dialogs
        [resetDialogOpen, setResetDialogOpen] = useState(false),
        [dialogOpen, setDialogOpen] = useState(false),

        // 响应式
        portrait = useMediaQuery("(orientation: portrait)"),
        widtha = portrait ? `calc(100vw / ${width})` : `calc(100vw / (${width} + 1))`,
        heighta = portrait ? `calc((100vh - 56px) / (${height} + 1))` : `calc((100vh - 64px) / ${height})`,
        column = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm")),

        // elements
        splitInputs = <>
            <TextField margin="dense" value={width} variant="outlined" onChange={event => {
                setWidth(Number(event.target.value));
            }} label={get("jigsaw.split.width")} type="number" />
            <TextField margin="dense" value={height} variant="outlined" onChange={event => {
                setHeight(Number(event.target.value));
            }} label={get("jigsaw.split.height")} type="number" />
        </>,
        selects = thisJigsaw?.rightBlocks.map((b, rowIndex) => b.map((c, columnIndex) => {
            const finding = thisJigsaw.blocks.flat()[rowIndex * width + columnIndex];
            if (finding === undefined || finding === null) {
                const src = URL.createObjectURL(c);
                return (
                    <img draggable onDragStart={event => {
                        event.dataTransfer.setData("application/json", JSON.stringify([rowIndex, columnIndex]));
                        event.dataTransfer.setDragImage(event.currentTarget, dragImageSize, dragImageSize);
                        event.dataTransfer.dropEffect = "move";
                    }} onClick={event => {
                        setSelecting([rowIndex, columnIndex]);
                    }} onLoad={event => {
                        URL.revokeObjectURL(src);
                    }} alt="" key={`${rowIndex},${columnIndex}`} style={{
                        width: widtha,
                        height: heighta,
                        borderColor: "green",
                        borderWidth: 1,
                        borderStyle: "solid",
                        display: "inline-block"
                    }} src={src} />
                );
            }
        })) || [],
        selectsWithNone = useMemo(() => selects.flat(Infinity).filter(select => select !== undefined).length === 0 ? <Box sx={{
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
        </Box> : shuffle(selects), [selects]),
        jigsawBlocks = jigsaws[imageFileKey].rightBlocks.map((b, rowIndex) => b.map((c, columnIndex) => {
            const jigsaw = jigsaws[imageFileKey],
                finding = jigsaw.blocks.flat()[rowIndex * width + columnIndex],
                right = finding !== undefined && finding !== null,
                moving = () => publicMoving(jigsaw, rowIndex, columnIndex)
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
        })) || false,
        recents = Object.keys(jigsaws).length === 0 ? <No>
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
                                setWidth(jigsaw[1].rightBlocks[0].length);
                                setHeight(jigsaw[1].rightBlocks.length);
                                setImageFileKey(jigsaw[0]);
                                setDialogOpen(true);
                            }} aria-label={get("jigsaw.start")}>
                                <PlayArrow />
                            </IconButton>
                        </MouseOverPopover>
                    </Box>
                )} />
            </ImageListItem>;
        }),
        start = () => new Promise<typeof jigsaws>(resolve => {
            const img = new Image();
            img.src = URL.createObjectURL(imageFile);
            img.addEventListener("load", async event => {
                URL.revokeObjectURL(img.src);

                const canvas = document.createElement("canvas"),
                    context = canvas.getContext("2d"),
                    splited: Blob[][] = [];
                canvas.width = img.width / width;
                canvas.height = img.height / height;
                for (let y of range(height - 1)) {
                    const thisBuffer: Blob[] = [];
                    for (let x of range(width - 1)) {
                        context!.drawImage(
                            img,
                            x * img.width / width,
                            y * img.height / height,
                            img.width / width,
                            img.height / height,
                            0,
                            0,
                            img.width / width,
                            img.height / height
                        );
                        thisBuffer.push(await canvasToBlob(canvas));
                        context!.clearRect(0, 0, img.width / width, img.height / height);
                    }
                    splited.push(thisBuffer);
                }

                const
                    addingJigsaw = {
                        rightBlocks: splited,
                        blocks: [],
                        file: imageFile,
                        fileName: imageFile.name
                    },
                    old = structuredClone(jigsaws);
                old[imageFileKey] = addingJigsaw;
                setJigsaws(old);
                resolve(old);
            });
        });
    async function publicMoving(jigsaw: jigsaw, rowIndex: number, columnIndex: number) {
        const addingJigsaw: jigsaw = {
            ...jigsaw,
            blocks: jigsaw.rightBlocks.map((b1, indexb1) => b1.map((c1, indexc1) => {
                if (indexb1 === rowIndex && indexc1 === columnIndex) {
                    const old = c1 as block;
                    Object.defineProperty(old, "rotation", {
                        value: 0
                    });
                    return old;
                }
                return jigsaw.blocks?.[indexb1]?.[indexc1];
            })).filter(item => item !== undefined)
        };
        const draft = structuredClone(jigsaws);
        draft[imageFileKey] = addingJigsaw;
        return setJigsaws(draft);
    }
    useEffect(() => {
        blobToInt8Array(imageFile).then(key => setImageFileKey(key));
    }, [imageFile]);
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
                                const fileImages = images.map(image => new File([image.file], image.filename, {
                                    ...image.file,
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
                        {splitInputs}
                    </Box>
                </Box>
                <Button variant="contained" onClick={async event => {
                    start();
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
                {recents}
            </Box>
            <Dialog TransitionComponent={Transition} open={dialogOpen} fullScreen onClose={event => {
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
                        {jigsawBlocks}
                    </ImageList>
                    <Drawer sx={{
                        width: portrait ? "100vw" : widtha,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: portrait ? "100vw" : widtha,
                            flexDirection: portrait ? "row" : "column"
                        }
                    }} variant="persistent" anchor={portrait ? "bottom" : "right"} open>
                        {selectsWithNone}
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
}

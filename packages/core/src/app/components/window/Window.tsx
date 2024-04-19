"use client";
import {
    Divider,
    IconButton,
    Typography,
    Box,
    TextField,
    GlobalStyles
} from "@mui/material";
import {
    CSSProperties,
    useRef,
    useState
} from "react";
import {
    CropDin as CropDinIcon,
    Close as CloseIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    ArrowBackIos as ArrowBackIosIcon,
    ArrowForwardIos as ArrowForwardIosIcon
} from "@mui/icons-material";
import {
    useRouter
} from "next/navigation";
import Draggable from "react-draggable";
import {
    Hex
} from "declare";
import {
    get
} from "react-intl-universal";
import MouseOverPopover from "../Popover";
import {
    Route
} from "next";
export interface WindowOptions {
    to: string;
    name: string;
    page: string;
    id: string;
    color: [Hex.Hex, Hex.Hex]
    sx?: CSSProperties;
}
export default function Window(props: WindowOptions): JSX.Element {
    const {
        id
    } = props,
        realSx: CSSProperties = props?.sx === undefined ? {} : props?.sx,
        router = useRouter(),
        [open, setOpen] = useState<boolean>(true),
        nodeRef = useRef<HTMLDivElement>(null),
        [size, setSize] = useState<[number, number]>([50, 50]), /* height, width */
        [extension, setExtension] = useState<boolean>(false),
        [type, setType] = useState<"normal" | "min">("normal"),
        sizeStyle: CSSProperties = {
            height: `${size[0]}vh`,
            width: `${size[1]}vw`
        };
    return open && (
        <Box component="article">
            <GlobalStyles styles={{
                "& .top0": {
                    top: 0
                }
            }} />
            <Draggable handle={`#title${id}`} cancel={`[class*="context${id}"]`} allowAnyClick nodeRef={nodeRef} defaultClassName="top0">
                <Box sx={{
                    borderColor: "black",
                    borderWidth: 1,
                    borderStyle: "solid",
                    zIndex: "38601",
                    position: "fixed",
                    overflow: "auto",
                    borderRadius: "1em",
                    ...sizeStyle
                }} ref={nodeRef}>
                    <Box sx={{
                        zIndex: "38602",
                        display: "flex",
                        position: "sticky",
                        top: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        ...realSx
                    }}>
                        {extension && (
                            <Box sx={{
                                display: "flex"
                            }}>
                                <TextField label={get('height')} type="number" InputLabelProps={{
                                    shrink: true,
                                }} onChange={event => {
                                    setSize(old => [Number(event.target.value), old[1]]);
                                }} value={size[0]} />
                                <TextField label={get('width')} type="number" InputLabelProps={{
                                    shrink: true,
                                }} onChange={event => {
                                    setSize(old => [old[0], Number(event.target.value)]);
                                }} value={size[1]} />
                            </Box>
                        )}
                        <Box sx={{
                            cursor: "move",
                            flex: 1,
                            textAlign: "center"
                        }} id={`window-title-${id}`} /* id暂时没用 */>
                            <Typography variant="subtitle1">
                                {props.name}
                            </Typography>
                        </Box>
                        {extension ? (
                            <>
                                <MouseOverPopover text={get("window.collapse")}>
                                    <IconButton aria-label={get("window.collapse")} edge="end" onClick={event => setExtension(false)}>
                                        <ArrowForwardIosIcon />
                                    </IconButton>
                                </MouseOverPopover>
                                <MouseOverPopover text={get("window.changeSize")}>
                                    <IconButton aria-label={get("window.changeSize")} edge="end" onClick={event => type === "min" ? setType("normal") : setType("min")}>
                                        {type === "min" ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                                    </IconButton>
                                </MouseOverPopover>
                                <MouseOverPopover text={get("window.maxmize")}>
                                    <IconButton aria-label={get("window.maxmize")} edge="end" onClick={event => {
                                        router.push(props.to satisfies Route);
                                        setOpen(false);
                                    }}>
                                        <CropDinIcon />
                                    </IconButton>
                                </MouseOverPopover>
                                <MouseOverPopover text={get("close")}>
                                    <IconButton aria-label={get("close")} edge="end" onClick={event => setOpen(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </MouseOverPopover>
                            </>
                        ) : (
                            <MouseOverPopover text={get("expand")}>
                                <IconButton aria-label={get("expand")} edge="end" onClick={event => setExtension(true)}>
                                    <ArrowBackIosIcon />
                                </IconButton>
                            </MouseOverPopover>
                        )}
                    </Box>
                    <Divider />
                    <iframe style={{
                        border: "none",
                        ...sizeStyle
                    }} src={props.page} />
                </Box>
            </Draggable>
        </Box>
    );
}

"use client";
import {
    Divider,
    IconButton,
    Typography,
    Box,
    TextField
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
import "./Window.scss"; // 你说的对，但是我懒得用模块
import {
    useTheme
} from "@mui/material/styles";
import {
    Hex
} from "../../declare";
import { get } from "react-intl-universal";
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
        theme = useTheme();
    var realSx: CSSProperties = {};
    const router = useRouter();
    if (props.sx !== undefined) {
        realSx = props.sx;
    }
    const [open, setOpen] = useState<boolean>(true),
        nodeRef = useRef<HTMLDivElement>(null),
        [size, setSize] = useState<[number, number]>([50, 50]), /* height, width */
        [extended, setExtended] = useState<boolean>(false),
        [type, setType] = useState<"normal" | "min">("normal"),
        sizeStyle: CSSProperties = {
            height: `${size[0]}vh`,
            width: `${size[1]}vw`
        };
    return open && (
        <Box component="article">
            <Draggable handle={`#title${id}`} cancel={`[class*="context${id}"]`} allowAnyClick nodeRef={nodeRef} defaultClassName="top0">
                <Box sx={{
                    borderColor: "black",
                    borderWidth: 1,
                    borderStyle: "solid",
                    zindex: 38601,
                    position: "fixed",
                    overflow: "auto",
                    borderRadius: "1em",
                    ...sizeStyle
                }} ref={nodeRef}>
                    <Box sx={{
                        zindex: 38602,
                        display: "flex",
                        position: "sticky",
                        top: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        ...realSx
                    }}>
                        {extended && <Box sx={{
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
                        </Box>}
                        <Box sx={{
                            cursor: "move",
                            flex: 1,
                            textAlign: "center"
                        }} id={`title${id}`}>
                            <Typography variant="subtitle1">
                                {props.name}
                            </Typography>
                        </Box>
                        {extended ? (
                            <>
                                <IconButton aria-label="collapse" edge="end" onClick={event => setExtended(false)}>
                                    <ArrowForwardIosIcon />
                                </IconButton>
                                <IconButton aria-label="change size" edge="end" onClick={event => type === "min" ? setType("normal") : setType("min")}>
                                    {type === "min" ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                                </IconButton>
                                <IconButton aria-label="maxmize" edge="end" onClick={event => {
                                    router.push(props.to);
                                    setOpen(false);
                                }}>
                                    <CropDinIcon />
                                </IconButton>
                                <IconButton aria-label="close" edge="end" onClick={event => setOpen(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </>
                        ) : (
                            <IconButton aria-label="extend" edge="end" onClick={event => setExtended(true)}>
                                <ArrowBackIosIcon />
                            </IconButton>
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

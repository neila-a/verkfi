"use client";
import {
    Divider,
    IconButton,
    Typography,
    Box
} from "@mui/material";
import {
    CSSProperties,
    useRef,
    useState
} from "react";
import style from "./Window.module.scss";
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
    useTheme
} from "@mui/material/styles";
export interface WindowOptions {
    to: string;
    name: string;
    Component: () => JSX.Element;
    id: string;
    sx?: CSSProperties;
}
export default function Window(props: WindowOptions): JSX.Element {
    const {
        id,
        Component
    } = props,
        theme = useTheme();
    var realSx: CSSProperties = {};
    const router = useRouter();
    if (props.sx !== undefined) {
        realSx = props.sx;
    }
    var [open, setOpen] = useState<boolean>(true),
        nodeRef = useRef<HTMLDivElement>(null),
        [extended, setExtended] = useState<boolean>(false),
        [type, setType] = useState<"normal" | "min">("normal");
    return open && (
        <article>
            <Draggable handle={`#title${id}`} cancel={`[class*="context${id}"]`} allowAnyClick nodeRef={nodeRef} defaultClassName={style["top0"]}>
                <div className={style["outer"]} ref={nodeRef}>
                    <div className={style["top"]} style={realSx}>
                        <div className={style["title"]} id={`title${id}`}>
                            <Typography variant="subtitle1">
                                {props.name}
                            </Typography>
                        </div>
                        {extended ? (
                            <>
                                <IconButton aria-label="collapse" edge="end" onClick={event => setExtended(false)}>
                                    <ArrowForwardIosIcon />
                                </IconButton>
                                <IconButton aria-label="change size" edge="end" onClick={event => type === "min" ? setType("normal") : setType("min")}>
                                    {type === "min" ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                                </IconButton>
                                <IconButton aria-label="maxmize" edge="end" onClick={event => router.push(props.to)}>
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
                    </div>
                    <Divider />
                    <Box sx={{
                        p: 3,
                        zIndex: 38602,
                        display: type === "min" ? "none" : "",
                        backgroundColor: theme.palette.mode === "dark" ? "#000000" : "#ffffff"
                    }} id={`context${id}`}>
                        <Component />
                    </Box>
                </div>
            </Draggable>
        </article>
    );
}

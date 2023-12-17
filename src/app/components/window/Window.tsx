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
import {
    Hex
} from "../../declare";
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
        [type, setType] = useState<"normal" | "min">("normal");
    const sizeStyle: CSSProperties = {
        height: `${size[0]}vh`,
        width: `${size[1]}vw`
    };
    return open && (
        <article>
            <Draggable handle={`#title${id}`} cancel={`[class*="context${id}"]`} allowAnyClick nodeRef={nodeRef} defaultClassName={style["top0"]}>
                <div className={style["outer"]} ref={nodeRef} style={sizeStyle}>
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
                    </div>
                    <Divider />
                    <iframe style={{
                        border: "none",
                        ...sizeStyle
                    }} src={props.page} />
                </div>
            </Draggable>
        </article>
    );
}

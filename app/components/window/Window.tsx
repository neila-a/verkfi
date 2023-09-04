import {
    Divider,
    IconButton,
    Typography
} from "@mui/material";
import {
    CSSProperties,
    Fragment,
    ReactNode,
    useRef,
    useState
} from "react";
import style from "./Window.module.scss";
import {
    CropDin as CropDinIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import {
    useRouter
} from "next/navigation";
import Draggable from "react-draggable";
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
    } = props;
    var realSx: CSSProperties = {};
    const router = useRouter();
    if (props.sx !== undefined) {
        realSx = props.sx;
    }
    var [closed, setClose] = useState<boolean>(false),
        nodeRef = useRef<HTMLDivElement>(null);
    return closed ? <Fragment /> : <>
        <Draggable handle={`#title${id}`} cancel={`[class*="context${id}"]`} allowAnyClick nodeRef={nodeRef} defaultClassName={style["top0"]}>
            <div className={style["outer"]} ref={nodeRef}>
                <div className={style["top"]} style={realSx}>
                    <div className={style["title"]} id={`title${id}`}>
                        <Typography variant="subtitle1">
                            {props.name}
                        </Typography>
                    </div>
                    <IconButton aria-label="maxmize" edge="end" onClick={event => router.push(props.to)}>
                        <CropDinIcon />
                    </IconButton>
                    <IconButton aria-label="close" edge="end" onClick={event => setClose(true)}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <Divider />
                <div id={`context${id}`}>
                    <Component />
                </div>
            </div>
        </Draggable>
    </>;
}

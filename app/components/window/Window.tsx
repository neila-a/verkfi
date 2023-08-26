import {
    Divider,
    IconButton,
    Typography
} from "@mui/material";
import {
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
    Component(): JSX.Element;
}
export default function Window(props: WindowOptions): JSX.Element {
    const {
        Component
    } = props;
    const router = useRouter();
    var [closed, setClose] = useState<boolean>(false);
    const id = Math.random().toString().replace(/0\./g, "");
    return (
        <>
            {closed ? <></> : <Draggable handle={`#title${id}`} cancel={`[class*="context${id}"]`} allowAnyClick>
                <div className={style["outer"]}>
                    <div className={style["top"]}>
                        <div className={style["title"]} id={`title${id}`}>
                            <Typography variant="subtitle1">
                                {props.name}
                            </Typography>
                        </div>
                        <IconButton aria-label="maxmize" edge="end" onClick={_e => router.push(props.to)}>
                            <CropDinIcon />
                        </IconButton>
                        <IconButton aria-label="close" edge="end" onClick={_e => setClose(true)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <div id={`context${id}`}>
                        <Component />
                    </div>
                </div>
            </Draggable>}
        </>
    );
}

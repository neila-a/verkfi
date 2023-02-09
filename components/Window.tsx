import {
    Divider,
    IconButton,
    Typography
} from "@mui/material";
import React, {
    useEffect,
    useState
} from "react";
import style from "../styles/Window.module.scss";
import {
    CropDin as CropDinIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import {
    useRouter
} from "next/router";
export interface WindowOptions {
    to: string;
    name: string;
    Component(): JSX.Element;
}
export default function Window(props: WindowOptions): JSX.Element {
    const router = useRouter();
    var [closed, setClose] = useState<boolean>(false);
    var [move, setMove] = useState<boolean>(false);
    var [pos, setPos] = useState<number[]>([0, 0]); // [x,y]
    return (
        <>
            {closed ? <></> : <div className={style["outer"]}>
                <div className={style["top"]} style={{
                    top: pos[0],
                    right: pos[1]
                }}>
                    <div className={style["title"]} onMouseDown={_event => setMove(true)} onMouseMove={event => {
                        setPos([event.clientX, event.clientY]);
                    }} onMouseUp={_event => setMove(false)}>
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
                <props.Component />
            </div>}
        </>
    );
}
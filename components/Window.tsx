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
    var [posX, setPosX] = useState<number>(0);
    var [posY, setPosY] = useState<number>(0);
    return (
        <>
            {closed ? <></> : <div className={style["outer"]} style={{
                    top: posX,
                    right: posY
                }}>
                <div className={style["top"]}>
                    <div className={style["title"]} onMouseDown={_event => setMove(true)} onMouseMove={event => {
                        if (move) {
                            setPosX(event.clientX);
                            setPosY(event.clientY);
                        }
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
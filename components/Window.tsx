import {
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
    return (
        <>
            {closed ? <></> : <div className={style["outer"]}>
                <div className={style["top"]}>
                    <Typography variant="subtitle1">
                        {props.name}
                    </Typography>
                    <IconButton aria-label="maxmize" edge="end" onClick={_e => router.push(props.to)}>
                        <CropDinIcon />
                    </IconButton>
                    <IconButton aria-label="close" edge="end" onClick={_e => setClose(true)}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <props.Component />
            </div>}
        </>
    );
}
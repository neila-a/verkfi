"use client";
import {
    Toolbar,
    Box
} from "@mui/material";
import {
    useSearchParams
} from "next/navigation";
import HeadBar from "../components/headBar/HeadBar";
import {
    useContext,
    useEffect,
    useState
} from "react";
import stringToBoolean from "../setting/stringToBoolean";
import db, {
    single
} from "./db";
import {
    colorMode
} from "../layoutClient";
export default function ExtendedTools() {
    const param = useSearchParams();
    var toolID = "",
        [tool, setTool] = useState<single>({
            name: "",
            desc: "",
            to: "",
            icon: "",
            color: ["", ""],
            file: ""
        }),
        colorContext = useContext(colorMode),
        color = colorContext.value;
    const {
        name = ""
    } = tool;
    if (param.has("id")) {
        toolID = param.get("id");
    }
    useEffect(() => {
        db.extendedTools.get({
            to: toolID
        }).then(real => {
            setTool(real);
        });
    }, []);
    return (
        <>
            {!param.has("only") && (
                <>
                    <HeadBar isIndex={false} pageName={name} only={false} sx={{
                        backgroundImage: `linear-gradient(45deg, #${tool.color[0]}, #${tool.color[1]})`
                    }} />
                    <Toolbar />
                </>
            )}
            <Box sx={{
                p: 3
            }} component="article" id="container">
                <div id="neilatools_context" dangerouslySetInnerHTML={{
                    __html: tool.file
                }} />
            </Box>
            <section id="outside" />
        </>
    );
}
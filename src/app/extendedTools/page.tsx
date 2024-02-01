"use client";
import {
    Box
} from "@mui/material";
import {
    useSearchParams
} from "next/navigation";
import HeadBar from "../components/headBar/HeadBar";
import {
    useEffect,
    useState
} from "react";
import db, {
    single
} from "./db";
export default function ExtendedTools() {
    const param = useSearchParams();
    var toolID = "";
    const [tool, setTool] = useState<single>({
        name: "",
        desc: "",
        to: "",
        icon: "",
        color: ["", ""],
        files: [],
        main: ""
    }),
        {
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
                </>
            )}
            <Box sx={{
                p: 3
            }} component="article" id="container">
                <iframe style={{
                    border: "none"
                }} src={`/extendedfiles/${tool.to}/${tool.main}`} />
            </Box>
            <section id="outside" />
        </>
    );
}
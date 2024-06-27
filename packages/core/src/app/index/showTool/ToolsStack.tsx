"use client";
import {
    Stack
} from "@mui/material";
import No from "@verkfi/shared/No";
import {
    useAtomValue
} from "jotai";
import {
    viewModeAtom
} from "@verkfi/shared/atoms";
import {
    get
} from "react-intl-universal";
import {
    tool
} from "tools/info";
import {
    editModeAtom
} from "index/atoms";
import {
    FC,
    ReactNode
} from "react";
import {
    listSpacing,
    gridSpacing
} from ".";
export default function ToolsStack(props: {
    paramTool: any[];
    notfound?: ReactNode;
    ListContainer: FC;
    GridContainer: FC;
}) {
    const viewMode = useAtomValue(viewModeAtom), editMode = useAtomValue(editModeAtom);
    return <Stack spacing={viewMode === "list" ? listSpacing : gridSpacing} sx={{
        flexDirection: viewMode === "grid" && "row",
        display: viewMode === "grid" && "flex",
        width: "100%",
        flexWrap: "wrap",
        alignContent: "center",
        alignItems: "flex-end",
        justifyContent: "space-evenly",
        textAlign: "center",
        ["& *"]: {
            cursor: "pointer"
        },
        ["& > *"]: {
            width: viewMode === "list" ? "100%" : "unset"
        }
    }}> {/* 工具总览 */}
        {props.paramTool.length === 0 ? props?.notfound
            || <No>
                {get("index.notfound")}
            </No> : viewMode === "list" && editMode ? <props.ListContainer /> : <props.GridContainer />}
    </Stack>;
}

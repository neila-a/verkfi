"use client";
import I18N from 'react-intl-universal';
import {
    useContext
} from 'react';
import {
    Stack,
    Typography
} from "@mui/material";
import Style from "./Index.module.scss";
import {
    tool
} from "../tools/info";
import SingleTool from './SingleTool';
import {
    viewMode
} from './consts';
import stringToBoolean from '../setting/stringToBoolean';
import {
    setState
} from '../declare';
import {
    darkMode as darkModeContext
} from '../layoutClient';
export default function ToolsStack(props: {
    paramTool: tool[];
    viewMode: viewMode;
    searchText: string;
    sortingFor: string;
    setTools: setState<tool[]>;
    editMode: boolean;
}) {
    const {
        viewMode
    } = props;
    var darkModeFormStorage = useContext(darkModeContext).mode, darkMode = stringToBoolean(darkModeFormStorage.replace("light", "false").replace("dark", "true"));
    return (
        <Stack spacing={viewMode == "list" ? 3 : 5} className={Style["items"]} sx={{
            flexDirection: viewMode == "grid" ? "row" : "",
            display: viewMode == "grid" ? "flex" : "block",
            width: "100%"
        }}> {/* 工具总览 */}
            {props.paramTool.length === 0 ? <Typography>{I18N.get('未找到任何工具')}</Typography> : props.paramTool.map((tool, index) => (
                <SingleTool
                    isFirst={(props.searchText !== "") && (index === 0)}
                    tool={tool}
                    sortingFor={props.sortingFor}
                    key={tool.to}
                    darkMode={darkMode}
                    viewMode={viewMode}
                    setTools={props.setTools}
                    editMode={props.editMode} />
            ))}
        </Stack>
    );
}

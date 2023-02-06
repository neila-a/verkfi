import Link from "next/link";
import HeadBar from "../components/HeadBar";
import * as React from 'react';
import {
    Stack,
    Card,
    CardContent,
    Typography,
    Divider,
    IconButton,
    InputBase,
    Paper
} from "@mui/material";
import {
    Search as SearchIcon,
    ViewModule as ViewModuleIcon,
    ViewList as ViewListIcon
} from "@mui/icons-material";
import Style from "../styles/Index.module.scss";
import LpLogger from "lp-logger";
import realTools, {
    tool
} from "../components/tools";
export { realTools };
export var logger = new LpLogger({
    name: "Index",
    level: "log", // 空字符串时，不显示任何信息
});
export default function Index(): JSX.Element {
    var [tools, setTools] = React.useState<tool[]>(realTools);
    var [searchText, setSearchText] = React.useState<string>("");
    var [viewMode, setViewMode] = React.useState<"list" | "grid">("grid");
    function searchTools() {
        var calcTools: tool[] = [];
        realTools.forEach(tool => {
            if (tool.desc.includes(searchText) || tool.to.includes(searchText) || tool.name.includes(searchText)) calcTools.push(tool);
        });
        setTools(calcTools);
    };
    return (
        <>
            <HeadBar isIndex={true} pageName="NeilaTools" />
            <br />
            <Paper component="form" sx={{ // 搜索栏
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <IconButton type="button" sx={{
                    p: '10px'
                }} aria-label="search" onClick={searchTools}>
                    <SearchIcon />
                </IconButton>
                <InputBase sx={{
                    ml: 1,
                    flex: 1
                }} placeholder="搜索工具" inputProps={{
                    'aria-label': 'searchtools',
                    onKeyDown: event => {
                        setSearchText(event.currentTarget.value);
                        searchTools();
                    }
                }} />
                <Divider sx={{
                    height: 28,
                    m: 0.5
                }} orientation="vertical" />
                <IconButton color="primary" sx={{
                    p: '10px'
                }} aria-label="directions" onClick={_event => {
                    switch (viewMode) {
                        case "grid":
                            setViewMode("list");
                            break;
                        case "list":
                            setViewMode("grid");
                            break;
                    };
                }}>
                    {viewMode == "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
                </IconButton>
            </Paper>
            <br />
            <Stack spacing={5} className={Style["items"]} sx={{
                flexDirection: viewMode == "grid" ? "row" : "",
                display: viewMode == "grid" ? "flex" : "block"
            }}> {/* 工具总览 */}
                {tools.map((tool, _index, _array) => { // 遍历tools
                    const ToolIcon = tool.icon;
                    return (
                        <> {/* 单个工具 */}
                            <Link href={`/tools/${tool.to}`} key={tool.name} style={{
                                textDecoration: "none"
                            }}>
                                <Card sx={viewMode == "grid" ? {
                                    minWidth: 275
                                } : {
                                    minWidth: "100%"
                                }} elevation={10}>
                                    <CardContent>
                                        {viewMode == "grid" ? <>
                                            <Typography variant="h5" component="div">
                                                <ToolIcon />
                                                {tool.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {tool.desc}
                                            </Typography>
                                        </> : <>
                                            <Typography variant="body2">
                                                <ToolIcon />{tool.name} - {tool.desc}
                                            </Typography>
                                        </>}
                                    </CardContent>
                                </Card>
                            </Link>
                            {viewMode == "grid" ? <></> : <br />}
                        </>
                    );
                })}
            </Stack>
        </>
    );
};
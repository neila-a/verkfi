import {
    DragIndicator as DragIndicatorIcon,
    ExitToApp as ExitToAppIcon
} from "@mui/icons-material";
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    SxProps,
    Theme
} from "@mui/material";
import {
    useAtomValue
} from "jotai";
import {
    gradientToolAtom as gradientToolAtom
} from "@verkfi/shared/atoms";
import dynamic from "next/dynamic";
import {
    useRouter
} from "next/navigation";
import {
    Fragment
} from "react";
import {
    editModeAtom
} from "index/atoms";
import atoms from "../atoms";
import {
    ToolTypography,
    fullWidth,
    globalProps
} from "../consts";
import {
    useAtomCallback
} from "jotai/utils";
import {
    handleClickAtom,
    handleMouseEnterAtom,
    handleMouseLeaveAtom,
    handleRightClickAtom
} from "../handles";
import SingleToolIframe from "../parts/iframe";
import SingleToolDeleteButtons from "../parts/deleteButtons";
import SingleToolActions from "../parts/actions";
export default function SingleToolInListMode(props: globalProps) {
    const router = useRouter(),
        editMode = useAtomValue(editModeAtom),
        gradientTool = useAtomValue(gradientToolAtom),
        elevation = useAtomValue(atoms.elevation),

        // 常量
        {
            tool
        } = props,
        ToolIcon = tool.icon,
        subStyle = {
            sx: {
                color: theme => theme.palette.mode === "light" ? "" : "#999999"
            } as SxProps<Theme>
        },

        // 事件捕获器
        handleRightClick = useAtomCallback(handleRightClickAtom(props, tool)),
        handleClick = useAtomCallback(handleClickAtom(props, tool, router)),
        handleMouseEnter = useAtomCallback(handleMouseEnterAtom(props, tool, router)),
        handleMouseLeave = useAtomCallback(handleMouseLeaveAtom);
    return <Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} elevation={elevation} sx={{
        width: fullWidth,
        maxWidth: fullWidth,
        boxShadow: theme => props.focus && `inset 0 0 0 ${theme.spacing(1)} ${theme.palette.primary[theme.palette.mode]}`,
        backgroundColor: !gradientTool && `#${tool.color[0]}`,
        backgroundImage: gradientTool && `linear-gradient(45deg, #${tool.color[0]}, #${tool.color[1]})`
    } as SxProps<Theme>} id={`toolAbleToSelect-${tool.to}`} onClick={handleClick} onContextMenu={handleRightClick}>
        <Box sx={{
            textAlign: "left",
            position: "relative",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <Box sx={{
                textAlign: "left",
                position: "relative",
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
            }}>
                <CardHeader avatar={(
                    <ToolIcon />
                )} title={(
                    <ToolTypography variant="h5">
                        {tool.isGoto && !tool.to.startsWith("/tools/extension") ? <ExitToAppIcon /> : <Fragment />}
                        {tool.name}
                    </ToolTypography>
                )} />
                <CardContent>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center"
                    }}>
                        <ToolTypography {...subStyle} variant="subtitle1">
                            {tool.desc}
                        </ToolTypography>
                    </Box>
                </CardContent>
            </Box>
            {editMode && <CardActions onClick={event => {
                event.stopPropagation();
            }} classes={{
                root: "singleTool-editControler"
            }} sx={{
                display: "flex",
                alignItems: "center"
            }}>
                <SingleToolDeleteButtons {...props} />
                <DragIndicatorIcon />
            </CardActions>}
            <SingleToolActions {...props} />
        </Box>
        <SingleToolIframe {...props} />
    </Card>;
}

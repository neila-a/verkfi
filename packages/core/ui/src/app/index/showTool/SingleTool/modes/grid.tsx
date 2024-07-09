import {
    ExitToApp as ExitToAppIcon
} from "@mui/icons-material";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    SxProps,
    Theme
} from "@mui/material";
import {
    useAtom,
    useAtomValue
} from "jotai";
import {
    gradientToolAtom as gradientToolAtom
} from "@verkfi/shared/atoms";
import {
    useRouter
} from "next/navigation";
import {
    Fragment,
    useContext
} from "react";
import DownButton from "../../../sorting/DownButton";
import UpButton from "../../../sorting/UpButton";
import {
    editModeAtom,
    sorting,
    sortingForAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
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
export default function SingleToolInGridMode(props: globalProps) {
    const isImplant = useContext(isImplantContext),
        router = useRouter(),
        sortingFor = useAtomValue(sortingForAtom)(isImplant),
        editMode = useAtomValue(editModeAtom),
        gradientTool = useAtomValue(gradientToolAtom),
        elevation = useAtomValue(atoms.elevation),

        // 常量
        {
            tool
        } = props,
        ToolIcon = tool.icon,
        buttonOptions = {
            tool,
            sortingFor: sortingFor as sorting
        },
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
    return <Card elevation={elevation} id={`toolAbleToSelect-${tool.to}`} onClick={handleClick} onContextMenu={handleRightClick} sx={{
        width: `min(275px, ${fullWidth})`,
        boxShadow: theme => props.focus && `inset 0 0 0 ${theme.spacing(1)} ${theme.palette.primary[theme.palette.mode]}`,
        backgroundColor: !gradientTool && `#${tool.color[0]}`,
        backgroundImage: gradientTool && `linear-gradient(45deg, #${tool.color[0]}, #${tool.color[1]})`
    } as SxProps<Theme>} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <CardHeader title={(
            <ToolTypography variant="h5">
                {tool.isGoto && !tool.to.startsWith("/tools/extension") ? <ExitToAppIcon /> : <Fragment />}
                {tool.name}
            </ToolTypography>
        )} avatar={(
            <ToolIcon />
        )} />
        <CardContent>
            <ToolTypography {...subStyle} variant="subtitle1">
                {tool.desc}
            </ToolTypography>
        </CardContent>
        {editMode && <CardActions sx={{
            justifyContent: "center",
            alignItems: "center"
        }} onClick={event => {
            event.stopPropagation();
        }} classes={{
            root: "singleTool-editControler"
        }}>
            <DownButton {...buttonOptions} />
            <UpButton {...buttonOptions} />
            <SingleToolDeleteButtons {...props} />
        </CardActions>}
        <SingleToolActions {...props} />
        <SingleToolIframe {...props} />
    </Card>;
}

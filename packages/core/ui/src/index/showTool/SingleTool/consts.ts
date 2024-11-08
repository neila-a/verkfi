import {
    styled,
    Typography
} from "@mui/material";
import {
    ReactNode
} from "react";
import {
    tool
} from "tools/info";
export interface globalProps {
    tool: tool;
    actions?: ReactNode;
    focus?: boolean;
    disableClick?: boolean;
}
export const gridWidth = 275,
    ToolTypography = styled(Typography)({
        wordBreak: "break-all"
    }),
    fullWidth = "100%";

import {
    Box,
    Popover,
    Typography
} from "@mui/material";
import {
    CSSProperties,
    MouseEvent,
    ReactNode,
    useState
} from "react";
export default function MouseOverPopover(props: {
    children: ReactNode;
    text: string;
    sx?: CSSProperties;
}) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null),
        handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        },
        handlePopoverClose = () => {
            setAnchorEl(null);
        },
        open = Boolean(anchorEl);
    return (
        <Box sx={props?.sx ? props.sx : {
        }}>
            <Box aria-haspopup="true" onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} title={props.text}>
                {props.children}
            </Box>
            <Popover classes={{
                root: "mouse-over-popover" /* 暂时没用，仅作为标记 */
            }} sx={{
                pointerEvents: "none",
                zIndex: "38602"
            }} open={open} anchorEl={anchorEl} anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }} transformOrigin={{
                vertical: "top",
                horizontal: "left"
            }} onClose={handlePopoverClose} aria-label={props.text} disableRestoreFocus>
                <Typography sx={{
                    p: 1
                }}>
                    {props.text}
                </Typography>
            </Popover>
        </Box>
    );
}
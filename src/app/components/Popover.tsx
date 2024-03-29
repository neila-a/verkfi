import {
    ReactNode,
    useState,
    MouseEvent,
    CSSProperties
} from 'react';
import {
    Box,
    Popover,
    Typography
} from '@mui/material';
import {
    isMobile
} from 'react-device-detect';
import lpLogger from "lp-logger";
const logger = new lpLogger({
    name: "Popover",
    level: "log"
});
export default function MouseOverPopover(props: {
    children: ReactNode;
    text: string;
    sx?: CSSProperties;
}) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null),
        handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
            if (isMobile) {
                logger.log("检测到此设备为手机，停止显示弹出框");
            } else {
                setAnchorEl(event.currentTarget);
            }
        },
        handlePopoverClose = () => {
            setAnchorEl(null);
        },
        open = Boolean(anchorEl);
    return (
        <Box sx={props.sx ? props.sx : {}}>
            <Box
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                {props.children}
            </Box>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                    zIndex: "38602"
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{
                    p: 1
                }}>{props.text}</Typography>
            </Popover>
        </Box>
    );
}
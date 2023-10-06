import {
    ReactNode,
    useState,
    MouseEvent,
    CSSProperties
} from 'react';
import {
    Popover,
    Typography
} from '@mui/material';
import {
    isMobile
} from 'react-device-detect';
import lpLogger from "lp-logger";
import { ThemeHaveZIndex } from '../setting/layout';
var logger = new lpLogger({
    name: "Popover",
    level: "log"
});
export default function MouseOverPopover(props: {
    children: ReactNode;
    text: string;
    sx?: CSSProperties;
}) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
        if (isMobile) {
            logger.log("检测到此设备为手机，停止显示弹出框");
        } else {
            setAnchorEl(event.currentTarget);
        }
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (
        <div style={props.sx ? props.sx : {}}>
            <div
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                {props.children}
            </div>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                    zIndex: theme => (theme as ThemeHaveZIndex).zIndex.drawer + 2
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
                <Typography sx={{ p: 1 }}>{props.text}</Typography>
            </Popover>
        </div>
    );
}
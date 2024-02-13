import {
    Box,
    Theme
} from "@mui/material";
import {
    BoxOwnProps
} from "@mui/system";
import {
    ReactNode
} from "react";
/**
 * 居中
 * @returns {JSX.Element}  
 */
export const Center = (props: {
    children: ReactNode
} & BoxOwnProps<Theme>) => (
    <Box {...props} sx={{
        textAlign: "center"
    }}>
        {props.children}
    </Box>
);
export default Center;

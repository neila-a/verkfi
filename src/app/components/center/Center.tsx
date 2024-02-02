import {
    Box
} from "@mui/material";
import style from "./Center.module.scss";
/**
 * 居中
 * @returns {JSX.Element}  
 */
export const Center = props => (
    <Box className={style["center"]}>
        {props.children}
    </Box>
);
export default Center;

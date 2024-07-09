import {
    CardContent,
    Collapse,
    Box
} from "@mui/material";
import {
    globalProps
} from "../consts";
const SingleToolIframe = (props: Pick<globalProps, "actions" | "focus" | "tool">) => props.focus && !props?.actions && <CardContent>
    <Collapse in={props.focus} sx={{
        width: "100%",
        ["& .MuiCollapse-wrapperInner"]: {
            width: "100%"
        }
    }}>
        {!props.focus && <Box className="iframe-placeholder" sx={{
            height: "150px"
        }} />
        }
        {props.focus && <iframe style={{
            border: "none",
            width: "100%",
            height: "150px"
        }} src={props.tool.isGoto ? !props.tool.to.startsWith("/") ? props.tool.to : `${props.tool.to}&only=true` : `/tools/${props.tool.to}?only=true`} />}
    </Collapse>
</CardContent>;
export default SingleToolIframe;
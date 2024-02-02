import {
    Slide
} from "@mui/material";
import {
    TransitionProps
} from "@mui/material/transitions";
import {
    ReactElement,
    Ref,
    forwardRef
} from "react";
export const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});
export default Transition;
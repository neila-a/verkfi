import {
    Alert,
    FormControlLabel,
    Switch
} from "@mui/material";
import {
    get
} from "react-intl-universal";
import {
    option
} from "./option/page";
import {
    useContext
} from "react";
import stringToBoolean from "./stringToBoolean";
import {
    isBrowser
} from "../layout/layoutClient";
export type stringifyCheck = "false" | "true";
export function Switcher(props: {
    option: option;
}) {
    const {
        option
    } = props,
        value = useContext(option[0]),
        isShare = option[1] === "share.t",
        hasShare = "share" in (isBrowser() ? navigator : {}),
        isForkMeOnGitHub = option[1] === "Fork me on GitHub";
    return (
        <>
            {!hasShare && isShare && <Alert severity="warning">
                {get("share.none")}
            </Alert>}
            <FormControlLabel disabled={!hasShare && isShare} control={<Switch checked={value.value} onChange={event => {
                value.set(!value.value);
            }} />} label={isForkMeOnGitHub ? option[1] : get(option[1])} />
        </>
    );
}

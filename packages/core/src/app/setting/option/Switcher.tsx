import {
    Alert,
    FormControlLabel,
    Switch
} from "@mui/material";
import {
    useAtom
} from "jotai";
import isBrowser from "layout/isBrowser";
import {
    get
} from "react-intl-universal";
import {
    option
} from "./page";
export type stringifyCheck = "false" | "true";
export function Switcher(props: {
    option: option;
}) {
    const {
            option
        } = props,
        [value, setValue] = useAtom(option[0]),
        isShare = option[1] === "share.t",
        hasShare = "share" in (isBrowser() ? navigator : {
        }),
        isForkMeOnGitHub = option[1] === "Fork me on GitHub";
    return (
        <>
            {!hasShare && isShare && (
                <Alert severity="warning">
                    {get("share.none")}
                </Alert>
            )}
            <FormControlLabel disabled={!hasShare && isShare} control={(
                <Switch checked={value} onChange={event => {
                    setValue(!value);
                }} />
            )} label={isForkMeOnGitHub ? option[1] : get(option[1])} />
        </>
    );
}

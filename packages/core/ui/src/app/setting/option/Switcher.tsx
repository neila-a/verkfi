import {
    Alert,
    FormControlLabel,
    Switch
} from "@mui/material";
import {
    useAtom
} from "jotai";
import isBrowser from "@verkfi/shared/isBrowser";
import {
    get
} from "react-intl-universal";
import {
    option
} from "./page";
import {
    startTransition
} from "react";
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
    return <>
        {!hasShare && isShare && <Alert severity="warning">
            {get("share.none")}
        </Alert>}
        <FormControlLabel disabled={!hasShare && isShare} control={(
            <Switch checked={value} onChange={event => {
                startTransition(() => setValue(!value));
            }} />
        )} label={isForkMeOnGitHub ? option[1] : get(option[1])} />
    </>;
}

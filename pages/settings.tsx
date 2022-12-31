import {
    FormGroup,
    FormControlLabel,
    Switch
} from "@mui/material";
import HeadBar from "../components/HeadBar";
import {
    useState,
    useEffect
} from "react";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "Settings",
    level: "log", // 空字符串时，不显示任何信息
});
import * as React from "react";
export default function Settings(): JSX.Element {
    var [forkMeOnGitHub, setForkMeOnGitHub] = useState<boolean>(true);
	useEffect(function () {
		switch (window.localStorage.getItem("fork-me-on-github")) {
			case "true":
				setForkMeOnGitHub(true);
				break;
			case "false":
				setForkMeOnGitHub(false);
				break;
			default:
				window.localStorage.setItem("fork-me-on-github", "true");
		}
	}, [setForkMeOnGitHub]);
    return (
        <>
            <HeadBar isIndex={false} pageName="设置" />
            <FormGroup>
                <FormControlLabel control={<Switch checked={forkMeOnGitHub} onChange={(event) => {
                    setForkMeOnGitHub(event.target.checked);
                    window.localStorage.setItem("fork-me-on-github", String(event.target.checked));
                    logger.log(`已设置选项"Fork Me On GitHub" 为 ${forkMeOnGitHub}。`);
                    window.location.reload();
                }}/>} label="Fork Me On GitHub" />
            </FormGroup>
        </>
    );
};
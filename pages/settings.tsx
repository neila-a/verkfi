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
	var [erudaEnabled, setErudaEnabled] = useState<boolean>(false);
	useEffect(function () {
		switch (window.localStorage.getItem("fork-me-on-github")) {
			case "true":
				logger.log("检测到\"Fork me on GitHub\"为开启状态。");
				break;
			case "false":
				setForkMeOnGitHub(false);
				logger.log("检测到\"Fork me on GitHub\"为关闭状态。");
				break;
			default:
				window.localStorage.setItem("fork-me-on-github", "true");
				logger.log("检测到\"Fork me on GitHub\"为空，已设置为开启状态。");
				break;
		}
		switch (window.localStorage.getItem("eruda-enabled")) {
			case "true":
				setErudaEnabled(true);
				logger.log("检测到Eruda为启用状态。");
				break;
			case "false":
				logger.log("检测到Eruda为关闭状态。");
				break;
			default:
				window.localStorage.setItem("eruda-enabled", "false");
				logger.log("检测到Eruda为空，已设置为关闭状态。");
				break;
		};
	}, [setForkMeOnGitHub, setErudaEnabled]);
    return (
        <>
            <HeadBar isIndex={false} pageName="设置" />
            <FormGroup>
                <FormControlLabel control={<Switch checked={forkMeOnGitHub} onChange={event => {
                    setForkMeOnGitHub(event.target.checked);
                    window.localStorage.setItem("fork-me-on-github", String(event.target.checked));
                    logger.log(`已设置选项"Fork Me On GitHub" 为 ${forkMeOnGitHub}。`);
                    window.location.reload();
                }}/>} label="Fork Me On GitHub" />
                <FormControlLabel control={<Switch checked={erudaEnabled} onChange={event => {
                    setErudaEnabled(event.target.checked);
                    window.localStorage.setItem("eruda-enabled", String(event.target.checked));
                    logger.log(`已设置选项"开发控制台" 为 ${erudaEnabled}。`);
                    window.location.reload();
                }}/>} label="开发控制台" />
            </FormGroup>
        </>
    );
};
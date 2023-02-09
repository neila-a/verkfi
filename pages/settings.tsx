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
export function string2boolean(string: string) {
	var _ret: boolean;
	if (string == "true") {
		_ret = true;
	} else if (string == "false") {
		_ret = false;
	}
	return _ret;
}
export function checkOption(id: string, name: string, empty: boolean) {
	var _ret: boolean;
	switch (localStorage.getItem(id)) {
		case "true":
			_ret = true
			logger.log(`检测到“${name}”为开启状态。`);
			break;
		case "false":
			_ret = false;
			logger.log(`检测到“${name}”为关闭状态。`);
			break;
	}
	return _ret;
}
export function setOption(id: string, name: string, value: boolean) {
	localStorage.setItem(id, String(value));
	logger.log(`已设置选项“${name}” 为 ${value}。`);
	location.reload();
	return value;
}
export default function Settings(): JSX.Element {
	var [forkMeOnGitHub, setForkMeOnGitHub] = useState<boolean>(true);
	var [erudaEnabled, setErudaEnabled] = useState<boolean>(false);
	useEffect(function () {
		setForkMeOnGitHub(checkOption("fork-me-on-github", "Fork me on GitHub", false));
		setForkMeOnGitHub(checkOption("eruda-enabled", "Eruda", false));
	}, [setForkMeOnGitHub, setErudaEnabled]);
	return (
		<>
			<HeadBar isIndex={false} pageName="设置" />
			<FormGroup>
				<FormControlLabel control={<Switch checked={forkMeOnGitHub} onChange={event => {
					setForkMeOnGitHub(setOption("fork-me-on-github", "Fork Me On GitHub", event.target.checked));
				}} />} label="Fork Me On GitHub" />
				<FormControlLabel control={<Switch checked={erudaEnabled} onChange={event => {
					setErudaEnabled(setOption("eruda-enabled", "Eruda", event.target.checked));
				}} />} label="开发控制台" />
			</FormGroup>
		</>
	);
};
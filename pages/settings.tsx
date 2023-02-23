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
import {
	checkOption,
	stringToBoolean
} from "../components/HeadBar";
export function setOption(id: string, name: string, value: boolean) {
	localStorage.setItem(id, String(value));
	logger.log(`已设置选项“${name}” 为 ${value}。`);
	location.reload();
	return value;
}
export default function Settings(): JSX.Element {
	var [forkMeOnGitHub, setForkMeOnGitHub] = useState<boolean>(true);
	useEffect(function () {
		setForkMeOnGitHub(stringToBoolean(checkOption("fork-me-on-github", "Fork me on GitHub", String(false))));
	}, [setForkMeOnGitHub]);
	return (
		<>
			<HeadBar isIndex={false} pageName="设置" />
			<FormGroup>
				<FormControlLabel control={
					<Switch checked={forkMeOnGitHub} onChange={event => {
						setForkMeOnGitHub(setOption("fork-me-on-github", "Fork Me On GitHub", event.target.checked));
					}} />
				} label="Fork Me On GitHub" />
			</FormGroup>
		</>
	);
};
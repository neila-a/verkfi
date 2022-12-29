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
                }}/>} label="Fork Me On GitHub" />
            </FormGroup>
        </>
    );
};
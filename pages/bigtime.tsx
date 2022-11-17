import { useEffect } from "react";
import HeadBar from "../components/HeadBar";
function BigTime(): JSX.Element {
    useEffect(() => {
        const getTime = function () {
            document.getElementById("bigtime").innerHTML = `${new Date().getHours()} : ${new Date().getMinutes()}`;
        }
        getTime();
        setTimeout(getTime, 60000);
    });
    return (
        <>
            <HeadBar isIndex={false} pageName="BigTime" />
            <p id="bigtime" style={{
                fontSize: "1500%"
            }}></p>
        </>
    );
};
export default BigTime;
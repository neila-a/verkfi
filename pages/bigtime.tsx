import { useEffect } from "react";
function BigTime(): JSX.Element {
    useEffect(() => {
        const getTime = function () {
            document.getElementById("bigtime").innerHTML = `${new Date().getHours()} : ${new Date().getMinutes()}`;
        }
        getTime();
        setTimeout(getTime, 60000);
    });
    return (<>
        <p id="bigtime" style={{
            fontSize: "1500%"
        }}></p>
    </>);
};
export default BigTime;
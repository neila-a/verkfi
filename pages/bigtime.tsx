import { useState, useEffect } from "react";
import HeadBar from "../components/HeadBar";
import moment from "moment";
function BigTime(): JSX.Element {
    var [time, setTime] = useState<string>();
    useEffect(function () {
        const getTime = () => setTime(moment().format("HH : mm : ss"));
        getTime();
        setInterval(getTime, 1000);
    }, [moment, setTime]);
    return (
        <>
            <HeadBar isIndex={false} pageName="BigTime" />
            <p id="bigtime" style={{
                fontSize: "1500%"
            }}>{time}</p>
        </>
    );
};
export default BigTime;
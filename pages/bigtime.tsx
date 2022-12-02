import { useState } from "react";
import HeadBar from "../components/HeadBar";
import moment from "moment";
function BigTime(): JSX.Element {
    var [hours, setHours] = useState<number>();
    var [minutes, setMinutes] = useState<number>();
    var [seconds, setSeconds] = useState<number>();
    const getTime = function () {
        const { hour, minute, second} = moment();
        setHours(hour());
        setMinutes(minute());
        setSeconds(second());
    };
    getTime();
    setTimeout(getTime, 1000);
    return (
        <>
            <HeadBar isIndex={false} pageName="BigTime" />
            <p id="bigtime" style={{
                fontSize: "1500%"
            }}>{hours} : {minutes} : {seconds}</p>
        </>
    );
};
export default BigTime;
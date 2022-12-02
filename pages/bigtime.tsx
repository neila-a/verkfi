import { useState, useEffect } from "react";
import HeadBar from "../components/HeadBar";
import moment from "moment";
function BigTime(): JSX.Element {
    var [hours, setHours] = useState<number>();
    var [minutes, setMinutes] = useState<number>();
    var [seconds, setSeconds] = useState<number>();
    useEffect(function () {
        const getTime = function () {
            setHours(moment().hour());
            setMinutes(moment().minute());
            setSeconds(moment().second());
        };
        getTime();
        setInterval(getTime, 1000);
    }, [moment, setHours, setMinutes, setSeconds]);
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
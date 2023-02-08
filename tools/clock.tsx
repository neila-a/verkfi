import { useState, useEffect } from "react";
import moment from "moment";
import React from "react";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "Clock",
    level: "log", // 空字符串时，不显示任何信息
});
export default function Clock(): JSX.Element {
    var [time, setTime] = useState<string>();
    useEffect(function () {
        const getTime = () => {
            const calcTime = moment().format("HH : mm : ss");
            setTime(calcTime);
            logger.log(`已设置时间为${calcTime}。`);
        };
        getTime();
        setInterval(getTime, 1000);
    }, [setTime]);
    return (
        <>
            <p id="bigtime" style={{
                fontSize: "1500%"
            }}>{time}</p>
        </>
    );
};
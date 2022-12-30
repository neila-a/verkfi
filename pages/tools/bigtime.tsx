import { useState, useEffect } from "react";
import HeadBar from "../../components/HeadBar";
import moment from "moment";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "BigTime",
    level: "log", // 空字符串时，不显示任何信息
    
});
function BigTime(): JSX.Element {
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
            <HeadBar isIndex={false} pageName="BigTime" />
            <p id="bigtime" style={{
                fontSize: "1500%"
            }}>{time}</p>
        </>
    );
};
export default BigTime;
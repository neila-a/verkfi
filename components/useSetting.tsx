import {
    useState,
    useEffect
} from "react";
import Lplogger from "lp-logger";
export var logger = new Lplogger({
    level: "log",
    name: "useSetting"
});
export function checkOption(id: string, name: string, empty: string) {
    var _ret: string;
    const value = localStorage.getItem(id);
    switch (value) {
        case null:
            localStorage.setItem(id, empty);
            logger.log(`检测到“${name}”为空，已设置为`, empty);
            _ret = empty;
            break;
        default:
            logger.log(`检测到“${name}”为`, value);
            _ret = value;
            break;
    }
    return _ret;
};
export function useReadSetting(id: string, name: string, empty: string) {
    var [set, setSet] = useState<string>("");
    useEffect(function () {
        setSet(checkOption(id, name, empty));
    });
    return set;
}
export function setOption(id: string, name: string, value: boolean) {
    setSetting(id, name, String(value));
    location.reload();
    return value;
}
export function setSetting(id: string, name: string, value: string) {
    localStorage.setItem(id, value);
    logger.log(`已设置选项“${name}” 为`, value);
    return value;
}
export function stringToBoolean(string: string) {
    if (string == "false") string = "";
    return Boolean(string);
};
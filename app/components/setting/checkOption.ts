import logger from "./logger"
export default function checkOption(id: string, name: string, empty: string) {
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
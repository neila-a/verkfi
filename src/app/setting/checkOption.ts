import logger from "./logger"
export default function checkOption<T extends string = string>(id: string, name: string, empty: T) {
    try {
        var _ret: T;
        const value = localStorage.getItem(id) as T;
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
    } catch (error) {
        return undefined;
    }
    return _ret;
};
import db from "db";
import logger from "../logger";
export default function setSetting<setting = any>(id: string, name: string, value: setting) {
    db.options.put({
        key: id,
        value: value
    }).then(_ => logger.log(`已设置选项“${name}” 为`, value));
    return value;
}
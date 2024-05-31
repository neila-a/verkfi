import db from "./db";
export default function setSetting<setting = any>(id: string, name: string, value: setting) {
    db.options.put({
        key: id,
        value: value
    });
    return value;
}

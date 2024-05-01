import db from "db";
import {
    isBrowser
} from "layout/layoutClient";
export default async function settingReader<setting>(id: string, empty: setting): Promise<setting> {
    if (isBrowser()) {
        const got = await db.options.get({
            key: id
        });
        if (got === undefined) {
            await db.options.put({
                key: id,
                value: empty
            });
            return empty;
        }
        return got.value;
    }
    return empty;
}
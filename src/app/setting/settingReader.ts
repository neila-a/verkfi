import db, {
    option
} from "db";
import {
    isBrowser
} from "layout/layoutClient";
export default async function settingReader<T>(id: string, empty: T): Promise<T> {
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
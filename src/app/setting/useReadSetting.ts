import {
    useLiveQuery
} from "dexie-react-hooks";
import db, {
    option
} from "../components/db";
export async function internalSettingReader<T>(id: string, empty: T): Promise<option> {
    const got = await db.options.get({
        key: id
    });
    if (got === undefined) {
        await db.options.put({
            key: id,
            value: empty
        });
        return {
            key: id,
            value: empty
        };
    }
    return got;
}
export default function useReadSetting<T>(id: string, empty: T): T {
    const set = useLiveQuery(() => internalSettingReader(id, empty), [], {
        key: id,
        value: empty
    });
    return set.value;
}

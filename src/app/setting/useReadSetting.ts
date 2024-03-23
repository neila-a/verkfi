import {
    useLiveQuery
} from "dexie-react-hooks";
import db from "../components/db";
export default function useReadSetting<T>(id: string, empty: T): T {
    const set = useLiveQuery(async () => {
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
    }, [], {
        key: id,
        value: empty
    });
    return set.value;
}

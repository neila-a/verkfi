import Dexie, {
    Table
} from "dexie";
import isBrowser from "../isBrowser";
export interface file {
    path: string;
    file: Uint8Array;
}
class DataBase extends Dexie {
    // We just tell the typing system this is the case
    options!: Table<any>;
    constructor() {
        super("Verkfi");
        this.version(7).stores({
            extensionTools: "&to", // Primary key and indexed props
            options: ""
        });
    }
    async readSetting<setting>(id: string, empty: setting): Promise<setting> {
        if (isBrowser()) {
            const got = await this.options.get(id);
            if (got === undefined) {
                await this.options.put(empty, id);
                return empty;
            }
            return got;
        }
        return empty;
    }
    setSetting<setting = any>(id: string, value: setting) {
        this.options.put(value, id);
        return value;
    }
}
const db = new DataBase();
export default db;

import Dexie, {
    Table
} from 'dexie';
import {
    NXTMetadata
} from '../../setting/extendeds/page';
const dbName = 'extendedTools';
export interface single extends NXTMetadata {
    files: [string, Uint8Array][];
}
class ClassedDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    [dbName]!: Table<single>;
    constructor() {
        super(dbName);
        this.version(3).stores({
            [dbName]: 'to, name, desc, to, icon, color, main, files' // Primary key and indexed props
        });
    }
}
const db = new ClassedDexie();
export default db;
import Dexie, {
    Table
} from 'dexie';
const dbName = 'extendedTools';
export interface single {
    name: string;
    desc: string;
    to: Lowercase<string>;
    icon: string;
    color: [string, string];
    file: string;
}
class ClassedDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    [dbName]!: Table<single>;
    constructor() {
        super(dbName);
        this.version(1).stores({
            [dbName]: 'to, name, desc, to, icon, color, file' // Primary key and indexed props
        });
    }
}
const db = new ClassedDexie();
export default db;
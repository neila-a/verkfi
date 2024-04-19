import Dexie, {
    Table
} from 'dexie';
import {
    NXTMetadata
} from 'setting/extensions/page';
export interface single extends NXTMetadata {
    files: [string, Uint8Array][];
}
export interface option<value = any> {
    key: string;
    value: value;
};
class ClassedDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    extensionTools!: Table<single>;
    options!: Table<option>;
    constructor() {
        super('Verkfi');
        this.version(5).stores({
            extensionTools: 'to, name, desc, to, icon, color, main, files, settings', // Primary key and indexed props
            options: 'key, value'
        });
    }
}
const db = new ClassedDexie();
export default db;
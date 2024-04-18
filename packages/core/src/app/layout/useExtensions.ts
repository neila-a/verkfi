import db, {
    single
} from "db";
import {
    useReducer
} from "react";
import useSWR from "swr";
import {
    isBrowser
} from "./layoutClient";
export interface extensionsDispatch extends single {
    action?: "delete"
}
export default function useExtensions() {
    const {
        data: extensionsData
    } = useSWR("db.extensions", () => {
        if (isBrowser()) return db.extensionTools.toArray();
        return [];
    }, {
        suspense: true
    }),
        reduce = useReducer((old: single[], val: extensionsDispatch) => {
            if (val?.action === "delete") {
                db.extensionTools.delete(val.to);
                return old.filter(a => a.to !== val.to);
            } else {
                db.extensionTools.put(val);
                const realOld = old.slice(0),
                    index = old.findIndex(a => a.to === val.to);
                if (index === -1) {
                    realOld.push(val);
                    return realOld;
                } else {
                    return realOld.map(a => {
                        if (a.to === val.to) return val;
                        return a;
                    });
                }
            }
        }, extensionsData);
    return reduce;
}
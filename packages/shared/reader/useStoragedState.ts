import {
    useReducer
} from "react";
import useSWR from "swr";
import db from "./db";
export default function useStoragedState<setting = any>(id: string, empty: setting) {
    const promise = db.readSetting(id, empty),
        reduce = useReducer((old: setting, val: setting) => {
            db.setSetting(id, val);
            return val;
        }, useSWR(id, () => promise, {
            suspense: true
        }).data);
    return reduce;
}

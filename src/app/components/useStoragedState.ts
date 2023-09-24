import {
    useReducer
} from "react";
import {
    isBrowser
} from "../layoutClient";
import checkOption from "../setting/checkOption";
import setSetting from "../setting/setSetting";
export default function useStoragedState<T extends string = string>(id: string, name: string, empty: T) {
    var value = empty;
    if (isBrowser()) {
        value = checkOption(id, name, empty);
    }
    return useReducer((old: T, val: T) => {
        setSetting(id, name, val);
        return val;
    }, value);
}
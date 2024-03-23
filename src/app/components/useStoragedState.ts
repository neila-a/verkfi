import {
    useReducer
} from "react";
import setSetting from "../setting/setSetting";
import {
    internalSettingReader
} from "../setting/useReadSetting";
import {
    isBrowser
} from "../layout/layoutClient";
export default function useStoragedState<T = any>(id: string, name: string, empty: T) {
    const reduce = useReducer((old: T, val: T) => {
        setSetting(id, name, val);
        return val;
    }, empty);
    (() => {
        if (isBrowser()) {
            if (!("setted" in window)) {
                // @ts-ignore 此时还没有setted
                window.setted = {};
            }
            if (!(id in window.setted)) {
                window.setted[id] = false;
            }
            (async () => {
                const {
                    value
                } = await internalSettingReader(id, empty);
                if (!window.setted[id]) {
                    window.setted[id] = true;
                    reduce[1](value);
                };
            })();
        }
    })();
    return reduce;
}
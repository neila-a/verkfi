import {
    KB
} from "../consts";
export default function getSettingsUsed() {
    let cache = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            cache += localStorage.getItem(key).length;
        }
    }
    return Number((cache / KB).toFixed(2));
}

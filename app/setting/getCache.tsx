import {
    MB
} from "./consts";
export default async function getCache(type: "usage" | "quota") {
    const estimate = await navigator.storage.estimate();
    var _ret: number = 0;
    switch (type) {
        case 'usage':
            _ret = estimate.usage / MB;
            break;
        case 'quota':
            _ret = estimate.quota / MB;
            break;
    }
    return _ret;
}

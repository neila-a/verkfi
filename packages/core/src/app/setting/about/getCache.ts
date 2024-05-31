import isBrowser from "@verkfi/shared/isBrowser";
import {
    MB
} from "../consts";
export default async function getCache(type: "usage" | "quota") {
    if (isBrowser()) {
        const estimate = await navigator.storage.estimate();
        return type === "usage" ? estimate.usage / MB : estimate.quota / MB;
    }
    return 0;
}

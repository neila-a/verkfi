import {
    MB
} from "./consts";
export default async function getCache(type: "usage" | "quota") {
    const estimate = await navigator.storage.estimate();
    return type === "usage" ? estimate.usage / MB : estimate.quota / MB;
}

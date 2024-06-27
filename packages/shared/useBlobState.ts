import {
    useReducer
} from "react";
const useBlobState = (initialValue: string = "") => useReducer((old: string, update: Blob) => {
    URL.revokeObjectURL(old);
    return URL.createObjectURL(update);
}, initialValue);
export default useBlobState;

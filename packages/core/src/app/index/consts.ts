import {
    createContext
} from "react";
export type viewMode = "list" | "grid";
export const isImplantContext = createContext<boolean>(false);

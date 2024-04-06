import {
    NXTMetadata
} from "setting/extensions/page";
import {
    single
} from "db";
export const emptyNXTMetadata: NXTMetadata = {
    name: "",
    desc: "",
    to: "",
    icon: "",
    // @ts-ignore 空数据，不需要做效验
    color: ["", ""],
    main: "",
    settings: []
};
export const emptyExtension: single = {
    ...emptyNXTMetadata,
    files: []
};
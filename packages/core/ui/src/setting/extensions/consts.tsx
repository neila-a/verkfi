import {
    settingPage
} from "setting/layout";
interface booleanSetting {
    type: "boolean",
    page: settingPage;
    text: string;
    id: string;
    value: boolean;
    defaultValue: boolean;
}
interface switchSetting {
    type: "switch",
    page: settingPage;
    switches: string[];
    text: string;
    id: string;
    value: string;
    defaultValue: string;
}interface inputSetting {
    type: "input",
    page: settingPage;
    text: string;
    id: string;
    value: string;
    defaultValue: string;
}
export type setting = booleanSetting | switchSetting | inputSetting;

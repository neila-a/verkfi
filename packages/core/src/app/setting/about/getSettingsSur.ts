import getSettingsUsed from "./getSettingsUsed";
const localStorageQuota = 5120;
export const getSettingsSur = () => localStorageQuota - getSettingsUsed();
export default getSettingsSur;

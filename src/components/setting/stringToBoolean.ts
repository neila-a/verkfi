export default function stringToBoolean(string: string) {
    if (string == "false") string = "";
    return Boolean(string);
};
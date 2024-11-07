"use client";
import {
    Filesystem
} from "@tybys/browser-asar";
import extensionsAtom from "@verkfi/shared/atoms/extensions";
import PureDialog from "@verkfi/shared/dialog/Pure";
import {
    file
} from "@verkfi/shared/reader/db";
import {
    flatten
} from "array-flatten";
import {
    useAtomValue
} from "jotai";
import {
    useSearchParams
} from "next/navigation";
import {
    use
} from "react";
import {
    get
} from "react-intl-universal";
import {
    setting
} from "setting/extensions/consts";
import DialogButtons from "setting/extensions/DialogButtons";
import DialogInputs from "setting/extensions/DialogInputs";
import {
    inputTypes
} from "setting/extensions/page";
export default function DirectInstall() {
    const closi = globalThis?.close || (() => null),
        params = useSearchParams(),
        url = params.get("url"),
        response = fetch(url),
        blob = response.then(a => a.blob()),
        arrayBuffer = use(blob.then(a => a.arrayBuffer())),
        fs = new Filesystem(new Uint8Array(arrayBuffer)),
        dir = fs.readdirSync("/"),
        main = JSON.parse(fs.readFileSync("package.json", true)),
        fileInfo = {
            name: main.name,
            to: main.to,
            desc: main.description,
            icon: main.icon,
            color: main.color,
            main: main.main,
            settings: "settings" in main ? (main.settings satisfies setting[]).map((settingItem: setting) => ({
                ...settingItem,
                value: settingItem.defaultValue
            })) : []
        },
        readInternal: (path: string) => file | file[] = path => fs.statSync(path).isDirectory() ? flatten(
            fs.readdirSync(path).map(pathchild => readInternal(`${path}/${pathchild}`))
        ) : {
            path,
            file: fs.readFileSync(path)
        },
        files = dir.map(readInternal).flat(1),
        extensionTools = useAtomValue(extensionsAtom),
        dialogType: inputTypes = extensionTools.some(item => item.to === main.to) ? "modify" : "add";
    return (
        <PureDialog action={(
            <DialogButtons
                type={dialogType}
                fileInfo={fileInfo}
                files={files}
                reset={closi}
            />
        )} add={{
            fullScreen: true
        }} open={true} onClose={closi} title={get(`extensions.${dialogType === "add" ? "添加" : "编辑"}扩展`)}>
            <DialogInputs
                type={dialogType}
                reset={closi}
            />
        </PureDialog>
    );
}

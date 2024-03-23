import {
    Dispatch,
    SetStateAction
} from "react";

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * @deprecated Only supported on Chrome and Android Webview.
 */
export interface BeforeInstallPromptEvent extends Event {

    /**
     * Returns an array of DOMString items containing the platforms on which the event was dispatched.
     * This is provided for user agents that want to present a choice of versions to the user such as,
     * for example, "web" or "play" which would allow the user to chose between a web version or
     * an Android version.
     */
    readonly platforms: Array<string>;

    /**
     * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
     */
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed',
        platform: string
    }>;

    /**
     * Allows a developer to show the install prompt at a time of their own choosing.
     * This method returns a Promise.
     */
    prompt(): Promise<void>;

}

/**
 * 全局属性
 */
declare global {
    interface Window {

        /**
         * 安装至桌面
         */
        installPWA: () => Promise<void>;

    }
}

/**
 * React的useState()产生的第二个变量
 */
export type setState<T> = Dispatch<SetStateAction<T>>;

export namespace Hex {
    type HexDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
    export type HexColor<T extends string> =
        T extends `${HexDigit}${HexDigit}${HexDigit}${infer Rest1}`
        ? (Rest1 extends `${HexDigit}${HexDigit}${HexDigit}`
            ? T  // six-digit hex color
            : never
        )
        : never;
    /**
     * 六位的小写十六进制字符串
     */
    export type Hex = string & { __type: "HexColor" };
    /**
     * 将一个任意字符串的类型锁定为六位的小写十六进制字符串
     * @param string 任意字符串
     * @returns 六位的小写十六进制字符串
     */
    export const hex: <T extends string>(string: HexColor<T>) => Hex = string => string;
}
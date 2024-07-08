/**
 * 全局属性
 */
declare global {
    interface Window {

        /**
         * 安装至桌面
         */
        installPWA: () => Promise<void>;

        webkitSpeechRecognition: {
            new(): SpeechRecognition;
        };

    }
    /**
     * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
     * before a user is prompted to "install" a web site to a home screen on mobile.
     *
     * @deprecated Only supported on Chrome and Android Webview.
     */
    interface BeforeInstallPromptEvent extends Event {

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
            outcome: "accepted" | "dismissed";
            platform: string;
        }>;

        /**
         * Allows a developer to show the install prompt at a time of their own choosing.
         * This method returns a Promise.
         */
        prompt(): Promise<void>;

    }
    class URLPattern {
        constructor(init?: URLPatternInput, baseURL?: string);
        test(input?: URLPatternInput, baseURL?: string): boolean;
        exec(input?: URLPatternInput, baseURL?: string): URLPatternResult | null;
        readonly protocol: string;
        readonly username: string;
        readonly password: string;
        readonly hostname: string;
        readonly port: string;
        readonly pathname: string;
        readonly search: string;
        readonly hash: string;
    }
    type URLPatternInput = URLPatternInit | string;
    interface URLPatternInit {
        baseURL?: string;
        username?: string;
        password?: string;
        protocol?: string;
        hostname?: string;
        port?: string;
        pathname?: string;
        search?: string;
        hash?: string;
    }
    interface URLPatternResult {
        inputs: [URLPatternInput];
        protocol: URLPatternComponentResult;
        username: URLPatternComponentResult;
        password: URLPatternComponentResult;
        hostname: URLPatternComponentResult;
        port: URLPatternComponentResult;
        pathname: URLPatternComponentResult;
        search: URLPatternComponentResult;
        hash: URLPatternComponentResult;
    }
    interface URLPatternComponentResult {
        input: string;
        groups: Record<string, string | undefined>;
    }
    interface SpeechRecognitionEvent {
        isTrusted?: boolean;
        results: {
            isFinal: boolean;
            [key: number]:
            | undefined
            | {
                transcript: string;
            };
        }[];
    }

    abstract class SpeechRecognition extends EventTarget {
        // properties
        grammars: string;
        lang: string;
        continuous: boolean;
        interimResults: boolean;
        maxAlternatives: number;
        serviceURI: string;

        // event handlers
        onaudiostart: () => void;
        onaudioend: () => void;
        onend: () => void;
        onerror: () => void;
        onnomatch: () => void;
        onresult: (event: SpeechRecognitionEvent) => void;
        onsoundstart: () => void;
        onsoundend: () => void;
        onspeechstart: () => void;
        onspeechend: () => void;
        onstart: () => void;

        // methods
        abort: () => void;
        start: () => void;
        stop: () => void;
    }

}

export namespace hex {
    type HexDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f";
    export type HexColor<hexString extends string> =
        hexString extends `${HexDigit}${HexDigit}${HexDigit}${infer Rest1}`
        ? (Rest1 extends `${HexDigit}${HexDigit}${HexDigit}`
            ? hexString // six-digit hex color
            : never
        )
        : never;
    /**
     * 六位的小写十六进制字符串
     */
    export type Hex = string & {
        __type: "HexColor"
    };
}
/**
 * 将一个任意字符串的类型锁定为六位的小写十六进制字符串
 * @param string 任意字符串
 * @returns 六位的小写十六进制字符串
 */
export const hex = <hexString extends string>(string: hex.HexColor<hexString>) => string;

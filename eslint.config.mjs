import {
    fixupConfigRules
} from "@eslint/compat";
import path from "node:path";
import {
    fileURLToPath
} from "node:url";
import js from "@eslint/js";
import {
    FlatCompat
} from "@eslint/eslintrc";
const __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename),
    compat = new FlatCompat({
        baseDirectory: __dirname,
        recommendedConfig: js.configs.recommended,
        allConfig: js.configs.all
    }),
    indentSpacing = 4,
    tabWidth = 4,
    config = [
        ...fixupConfigRules(compat.extends("next", "plugin:react-hooks/recommended")),
        {
            ignores: [
                "**/out/*",
                "**/public/*",

                "**/.next/**/*",

                "**/next.config.js"
            ],
            rules: {
                "react-hooks/rules-of-hooks": "off", // .next会大量触发
                "react-hooks/exhaustive-deps": "warn",
                "semi": [
                    "warn",
                    "always"
                ],
                "jsx-quotes": [
                    "warn",
                    "prefer-double"
                ],
                "quotes": [
                    "warn",
                    "double",
                    {
                        "allowTemplateLiterals": true
                    }
                ],
                "eqeqeq": [
                    "warn",
                    "always"
                ],
                "key-spacing": [
                    "warn",
                    {
                        align: "value"
                    }
                ],
                "no-delete-var": "warn",
                "no-else-return": "warn",
                "no-eval": "error",
                "no-extra-label": "warn",
                "no-extra-semi": "warn",
                "no-proto": "warn",
                "no-script-url": "warn",
                "no-var": "warn",
                "no-with": "warn",
                "array-bracket-spacing": [
                    "warn",
                    "never"
                ],
                "arrow-parens": [
                    "warn",
                    "as-needed"
                ],
                "no-extra-parens": [
                    "warn",
                    "all"
                ],
                "no-extra-boolean-cast": "warn",
                "no-extra-bind": "warn",
                "arrow-spacing": [
                    "warn",
                    {
                        "before": true,
                        "after": true
                    }
                ],
                "block-spacing": "warn",
                "brace-style": "warn",
                "comma-dangle": [
                    "warn",
                    "never"
                ],
                "comma-spacing": [
                    "warn",
                    {
                        "before": false,
                        "after": true
                    }
                ],
                "comma-style": [
                    "warn",
                    "last"
                ],
                "dot-location": [
                    "warn",
                    "property"
                ],
                "eol-last": [
                    "warn",
                    "always"
                ],
                "func-call-spacing": [
                    "warn",
                    "never"
                ],
                "generator-star-spacing": [
                    "warn",
                    {
                        "before": false,
                        "after": true
                    }
                ],
                "implicit-arrow-linebreak": [
                    "warn"
                ],
                "indent": [
                    "warn",
                    indentSpacing,
                    {
                        "SwitchCase": 1
                    }
                ],
                "key-spacing": [
                    "warn"
                    // 全部使用默认
                ],
                "keyword-spacing": "warn",
                "linebreak-style": [
                    "warn",
                    "unix"
                ],
                "max-statements-per-line": [
                    "warn",
                    {
                        "max": 2
                    }
                ],
                "multiline-ternary": [
                    "warn",
                    "never"
                ],
                "new-parens": "warn",
                "no-multi-spaces": "warn",
                "no-multiple-empty-lines": "warn",
                "no-trailing-spaces": "warn",
                "no-whitespace-before-property": "warn",
                "nonblock-statement-body-position": "warn",
                "object-curly-newline": [
                    "warn",
                    "always"
                ],
                "object-curly-spacing": [
                    "warn",
                    "never"
                ],
                "object-property-newline": "warn",
                "operator-linebreak": [
                    "warn",
                    "before"
                ],
                "padded-blocks": [
                    "warn",
                    "never"
                ],
                "rest-spread-spacing": [
                    "warn",
                    "never"
                ],
                "semi-spacing": [
                    "warn",
                    {
                        "before": false,
                        "after": true
                    }
                ],
                "semi-style": [
                    "warn",
                    "last"
                ],
                "space-before-blocks": [
                    "warn",
                    "always"
                ],
                "space-before-function-paren": [
                    "warn",
                    {
                        "anonymous": "always",
                        "named": "never",
                        "asyncArrow": "always"
                    }
                ],
                "space-in-parens": [
                    "warn",
                    "never"
                ],
                "space-infix-ops": [
                    "warn"
                ],
                "space-unary-ops": [
                    "warn",
                    {
                        "words": true,
                        "nonwords": false
                    }
                ],
                "switch-colon-spacing": [
                    "warn"
                ],
                "template-curly-spacing": [
                    "warn",
                    "never"
                ],
                "template-tag-spacing": [
                    "warn",
                    "never"
                ],
                "unicode-bom": "warn",
                "wrap-iife": [
                    "warn",
                    "inside"
                ],
                "yield-star-spacing": [
                    "warn",
                    "after"
                ],
                "no-magic-numbers": [
                    "warn",
                    {
                        "ignoreArrayIndexes": true,
                        "ignore": [
                            -1,
                            0,
                            1
                        ]
                    }
                ],
                "max-len": [
                    "warn",
                    {
                        "code": 160,
                        tabWidth
                    }
                ]
            }
        }
    ];
export default config;

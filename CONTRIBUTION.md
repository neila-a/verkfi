# 贡献

## 创建一个新工具

- 在`/packages/`中创建一个包；
- 添加到核心包里的`/tools`。

## 添加新语言

- 在`/locales/`中写入一个JSON文件；
- 添加到 `/layout/layoutClient.tsx`。

## 标准

- 不要使用 JavaScript 代替 TypeScript。
- 如果你的提交涉及大型或重大更改，请创建一个新分支并创建拉取请求。
   即使你拥有此存储库的写入权限，也不要直接修改 main。
   如果只有一些小的改变，你可以改变 main。
- 必须使用缩进，缩进为4个空格。
- 多个声明需要换行符。
- 不要使用“any”（除非作为类型参数的默认值）。
- 你必须使用最新的依赖项。 如果它们不兼容，请修复它们。
  如果无法修复它们，请将 package.json 中的版本号改为“小于最新的可运行版本”。

## 后备方案

像 canvas、audio 这些 HTML5 元素不需要后备方案，因为在连 HTML5 都不完整支持的浏览器上 Verkfi 会直接报错推出。

## 存储库结构

此存储库是一个 monorepo 存储库。

- packages
  - core（核心包）
  - init-tool（创建扩展的工具的包）
  - verkfi-tool-\*（工具\*的包）

## zIndex

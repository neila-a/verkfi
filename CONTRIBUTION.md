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

## 为什么是这样

### 后备方案

像 canvas、audio 这些 HTML5 元素不需要后备方案，因为在连 HTML5 都不完整支持的浏览器上 Verkfi 会直接报错推出。  
浏览器最低版本是依照[Navigator#share](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/share#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)来确定的。

#### 分享

分享功能不止与浏览器的版本有关，还和浏览器的配置有关，所以需要作为例外显示后备方案。

### PWA

PWA 的缓存方案采取的是缓存优先模式，因为对于 Verkfi 来说，保持可用比保持最新更重要。

### indexedDB

Verkfi 中对 indexedDB 的使用方式基本上是“能存储非字符串类型的 localStorage”，所以 indexedDB 中仅存储键值对。

## 废弃提案

### 更新说明

Verkfi 采用的是渐进式更新（即所有提交都直接提交至生产），版本号仅对开发有用，所以不需要更新说明。

### GPU.js 应用于解方程

解方程中的代码为`string`类型，不被 GPU.js 支持。
> <https://github.com/gpujs/gpu.js/?tab=readme-ov-file#declaring-variablesfunctions-within-kernels>

## zIndex

| 组件                   | zIndex        |
| ---------------------- | ------------- |
| 主页、设置中的 HeadBar | 比 drawer 多1 |
| HeadBar 默认           | 38600         |
| 菜单、拼图编辑界面     | 38601         |
| Window 标题栏          | 38602         |
| Popover                | 38602         |
| 拼图重置界面           | 38602         |
| Fork me on Github      | 99999         |

## Suspense

Suspense 只有不知道内容是什么的时候才能使用 Loading 组件，否则就要使用 Skeleton 组件。

## Devtools 中常用指令

```javascript
const s = document.createElement("script");
s.src = "https://cdn.jsdelivr.net/npm/opfs-tools-explorer";
document.body.append(s);
OTExplorer.init();
```

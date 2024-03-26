---
description: 配置你的工具，让Verkfi知道它是什么
---

# 配置

## package.json

没错，就是npm中使用的package.json。你将在其中编写一些内容，告诉Verkfi除npm需要知道的东西外的其他东西。

{% code title="原始的package.json" lineNumbers="true" fullWidth="true" %}
```json
{
  "name": "example",
  "version": "1.0.0",
  "description": "A example tool.",
  "main": "index.html",
  "author": "Example"
}
```
{% endcode %}

{% code title="Verkfi需要的package.json" lineNumbers="true" fullWidth="true" %}
```json
{
    "name": "example",
    "to": "example",
    "description": "A example tool.",
    "icon": "icon.png",
    "color": [
        "000000",
        "FFFFFF"
    ],
    "main": "index.html"
}
```
{% endcode %}

我想你已经发现，Verkfi的package.json和npm的package.json既有重合，又有不同。这完全不用担心——Verkfi的解析器不会因为你在package.json中放入了npm或别的什么东西需要而Verkfi不需要的字段而报错，它只会读取自己需要的字段。

### 字段说明

name：工具的名称。

icon：工具的图标。

description：工具的描述。

to：工具的路径。在Verkfi内部，工具的路径一般是发挥了ID的作用的，所以它必须是唯一的。

color：工具的颜色。当用户开启了“多彩主页”功能时，工具会显示出背景色。

main: 工具的入口，例如`index.html`（相对于工具自身的根路径）

> 注意：扩展工具中的根路径为
>
> ```typescript
> /extensionfiles/ID
> ```

settings: 非必填，可在Verkfi设置中添加设置项。

### 示例

<figure><img src="../../.gitbook/assets/tool.png" alt="一张工具的效果图"><figcaption><p>一张工具的效果图</p></figcaption></figure>

{% code title="这个工具的package.json" lineNumbers="true" fullWidth="true" %}
```json
{
    name: "画圆",
    to: "cylinder",
    desc: "根据各种不同的选项画圆",
    icon: "AdjustIcon.svg",
    color: ["fff1eb", "ace0f9"],
    main: "index.html"
}
```
{% endcode %}

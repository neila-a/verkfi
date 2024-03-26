---
description: 介绍扩展设置的配置和使用方法
---

# 扩展设置

上一篇中settings字段的类型：

{% code title="settings的类型" lineNumbers="true" %}
```tsx
interface setting {
    type: "boolean" | "switch" | "input", // 设置的类型
    page: settingPage; // 要添加设置项的页面
    switches?: string[]; // 如果设置的类型为switch，那么切换的种类
    text: string; // 文本提示
    id: string; // 这个扩展设置的ID
    defaultValue: boolean | string; // 默认的值
}
type settingPage = "option" | "about" | "reset" | "extensions" | "theme";
```
{% endcode %}

当你配置了settings字段后，可以在扩展工具中对扩展设置进行操作。

## 读取设置

<pre class="language-jsx" data-title="扩展工具中读取设置的代码" data-line-numbers><code class="lang-jsx">window.top.postMessage({
<strong>    action: "getSetting",
</strong><strong>    id: 上面设置的id
</strong>}, location.origin);
</code></pre>

当你发送了消息后，扩展工具中会接到一个类型为下面的消息。

{% code title="扩展工具接到的消息类型" lineNumbers="true" %}
```tsx
MessageEvent<{
    value: 读取到的扩展的值;
}>
```
{% endcode %}

## 设置设置

<pre class="language-jsx" data-title="扩展工具中设置设置的代码" data-line-numbers><code class="lang-jsx">window.top.postMessage({
<strong>    action: "setSetting",
</strong><strong>    id: 上面设置的id,
</strong><strong>    value: 要设置的值
</strong>}, location.origin);
</code></pre>

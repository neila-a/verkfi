---
description: 将你的工具编译成VXT工具
---

# 编译

在上一页中，我们已经配置好了一个工具，是时候给它打包了。

Verkfi的扩展工具文件后缀是“VXT”，意为“Verkfi eXtended Tool”，它实际上是一个未经压缩的ASAR归档（没错，即使它和Electron一点关系都没有）。

要想将工具打包为VXT，只需用asar打包工具将其打包起来即可。

```bash
npm install @electron/asar -g
# foo为要打包的整个目录，bar为文件名（可以相同）
asar pack foo bar.vxt
```

或者

```bash
# foo为要打包的整个目录，bar为文件名（可以相同）
npx @electron/asar pack foo bar.vxt
```

就这样，我们的第一个Verkfi工具制作成功了！

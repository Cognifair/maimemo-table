<img width="2000" height="424" alt="4992ea1b-017d-4a33-a0e6-66d10eb6fd76" src="https://github.com/user-attachments/assets/309d47e7-8e78-4f1e-935b-a6b0c864ff3f" />

# Maimemo Table

将 Markdown、LaTeX、粘贴文本或结构化数据转换为清晰美观的墨墨风格表格，并输出透明背景 PNG 图片和可编辑 HTML 文件。

> An agent skill for rendering Maimemo-style tables as transparent PNG images and editable HTML files.

## 主要功能

- 支持 Markdown 表格、LaTeX 表格、粘贴文本和结构化数据
- 默认生成宽度为 2000 px 的高清 PNG
- PNG 表格外部背景完全透明
- 同时保留可继续编辑的 HTML 文件
- 支持直角和 Apple 风圆角
- 支持中文内容和自动换行
- 支持自定义颜色、字体和图片宽度
- 默认使用绿色墨墨风格视觉设计

## 默认样式

- 标题与重点表头：墨绿色
- 表头文字：白色
- 普通单元格：透明背景
- 首列标签：淡绿色半透明背景
- 中文字体：优先使用 Microsoft YaHei
- 默认图片宽度：2000 px

生成表格前，如果没有指定样式，Maimemo Table 会询问：

```text
这张表格使用直角还是 Apple 风圆角？
```

## 安装方法

### 使用 Skill Installer 安装

在 Codex 中输入：

```text
请使用 $skill-installer 从
https://github.com/Cognifair/maimemo-table
安装这个 Skill。
```

安装完成后，如果技能没有立即出现，请重新启动 Codex。

### 手动安装

1. 点击本仓库右上方的绿色 `Code` 按钮。
2. 选择 `Download ZIP`。
3. 解压下载的文件。
4. 将文件夹重命名为 `maimemo-table`。
5. 将它放入个人 Skill 目录。

Windows 用户可以放入：

```text
%USERPROFILE%\.agents\skills\maimemo-table
```

请确保 `SKILL.md` 直接位于 `maimemo-table` 文件夹中，而不是多嵌套一层目录。

正确结构：

```text
maimemo-table/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── assets/
│   └── table-theme.css
└── scripts/
    └── render_table.cjs
```

## 使用方法

在 Codex 中调用 `$maimemo-table`，然后粘贴需要转换的表格。

示例：

```text
使用 $maimemo-table 将下面的内容制作成 Apple 风圆角透明 PNG：

| 特征 | 方案 A | 方案 B |
|---|---|---|
| 价格 | 较低 | 较高 |
| 速度 | 较快 | 一般 |
| 适用场景 | 日常使用 | 专业使用 |
```

也可以使用直角样式：

```text
使用 $maimemo-table 将下面的表格制作成直角透明 PNG。
```

## 输出文件

每次生成表格时会输出：

- `.png`：透明背景高清图片
- `.html`：可继续编辑的网页源文件

透明 PNG 适合在浅色或深色背景中使用，也可以插入笔记、卡片、文档和演示文稿。

## 自定义选项

支持调整：

- `cornerStyle`：`square` 或 `rounded`
- `width`：输出图片宽度
- `fontFamily`：字体
- `theme.accent`：强调色
- `theme.light`：浅色背景
- `theme.deep`：深色文字
- `theme.white`：表头文字颜色

## 运行环境

本 Skill 主要面向 Codex 使用。生成 PNG 时需要：

- Node.js
- Playwright
- Chrome、Microsoft Edge 或 Chromium 浏览器之一

在支持工作区依赖的 Codex 环境中，这些依赖通常可以自动定位。

## 能力边界

这个 Skill 只在本地生成表格图片和 HTML 文件，不会：

- 自动上传图片
- 修改墨墨记忆卡
- 编辑牌组或章节
- 调用墨墨官方 API

## License

本项目使用 [MIT License](LICENSE)。

你可以自由使用、修改和分享本项目，但请保留原始许可证声明。

## Disclaimer

本项目是独立制作的非官方工具，与墨墨记忆卡及其开发团队没有隶属或合作关系。“墨墨风格”仅用于描述视觉设计风格。

---

## English summary

Maimemo Table converts pasted, Markdown, LaTeX, or structured comparison tables into transparent PNG images and editable HTML files.

Install it in Codex with:

```text
Use $skill-installer to install the skill from:
https://github.com/Cognifair/maimemo-table
```

Then invoke `$maimemo-table` and provide your table content. You can choose square or Apple-style rounded corners.

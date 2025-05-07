# 净化百度

一个基于Plasmo框架开发的浏览器扩展，用于屏蔽百度搜索结果页面右侧的热搜榜和搜索结果中的广告。

## 功能特点

- 自动隐藏百度搜索页右侧的热搜榜
- 提供悬浮控制按钮，可随时切换热搜榜显示状态
- 支持用户自定义设置，可通过弹出窗口快速调整
- 使用React组件化开发，代码结构清晰
- 基于TypeScript，类型安全
- 轻量级设计，不影响浏览器性能

## 技术栈

- [Plasmo](https://www.plasmo.com/) - 浏览器扩展开发框架
- [React](https://reactjs.org/) - UI组件库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript超集

## 本地开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建扩展
pnpm build

# 打包扩展
pnpm package
```

## 安装方法

### 从源码安装

1. 克隆仓库并安装依赖
   ```
   git clone <仓库地址>
   cd baidu-hotsearch-blocker
   pnpm install
   ```

2. 构建扩展
   ```
   pnpm build
   ```

3. 在浏览器中加载扩展
   - Chrome/Edge: 访问 `chrome://extensions/` 或 `edge://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展"
   - 选择 `build/chrome-mv3-dev` 目录

### 从打包文件安装

1. 下载发布页面的最新版本扩展包
2. 解压扩展包
3. 按照上述方法在浏览器中加载扩展

## 使用方法

1. 安装扩展后，访问百度搜索页面
2. 右侧热搜榜将自动隐藏
3. 页面右下角有一个"显示热搜"按钮，点击可以切换热搜榜的显示状态
4. 点击扩展图标，可以快速开启/关闭屏蔽功能和控制按钮

## 隐私声明

- 本扩展不收集任何用户数据
- 只需要访问百度网站的权限和存储设置的权限
- 所有代码均开源可查

## 贡献

欢迎提交问题和功能请求。如果你想贡献代码，请提交Pull Request。

## 许可证

MIT

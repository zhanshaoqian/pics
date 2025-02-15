# 仿Instagram相册

使用 Next.js 和 Tailwind CSS 构建的类似 Instagram 标签页的相册应用。

### author: zhansq

## 在线预览

🌐 [在线演示地址](https://pics-teal-mu.vercel.app/)

## 功能特点

- 📱 响应式瀑布流布局
- ♾️ 无限滚动加载
- 🖼️ 图片预览模态框
- 💬 评论展示
- 🎨 美观的用户界面
- 💫 图片悬停动画效果
- 💝 点赞数和评论数统计
- 📊 模拟后端 API

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Headless UI
- React Infinite Scroll Component
- React Masonry CSS (瀑布流布局)
- Heroicons (图标)

## 界面特性

- 瀑布流布局自适应不同屏幕尺寸
- 图片悬停效果：
  - 图片轻微放大
  - 半透明黑色遮罩
  - 显示点赞数和评论数
  - 平滑过渡动画
- 响应式设计：
  - 大屏幕：4列
  - 中等屏幕：3列
  - 平板：2列
  - 手机：1列

## 开始使用

1. 安装依赖：

```bash
yarn install
```

2. 启动开发服务器：

```bash
yarn dev
```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
├── app/
│   ├── api/
│   │   └── photos/
│   │       └── route.ts      # 图片数据 API
│   ├── components/
│   │   └── PhotoModal.tsx    # 图片预览模态框组件
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 应用布局
│   └── page.tsx              # 主页面
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## API 说明

### GET /api/photos

获取图片列表，支持分页。

查询参数：
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：12）

响应示例：
```json
{
  "photos": [
    {
      "id": 1,
      "imageUrl": "...",
      "thumbnailUrl": "...",
      "likes": 123,
      "comments": [...],
      "username": "photographer_abc",
      "timestamp": "2024-02-20T12:00:00Z"
    }
  ],
  "hasMore": true
}
```

## 开发说明

- 图片来源：使用 [Lorem Picsum](https://picsum.photos/) 提供的随机图片
- 数据模拟：所有数据通过后端 API 模拟生成
- 性能优化：
  - 使用图片缩略图进行预览
  - 点击后加载高清图片
  - 瀑布流布局优化图片展示
  - 懒加载和无限滚动

## 构建生产版本

```bash
yarn build
yarn start
```
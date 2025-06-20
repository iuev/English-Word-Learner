# 英语单词学习应用 📚

一个现代化的网络应用程序，帮助用户通过上传包含文本的图片来学习英语词汇。该应用使用 AI 识别图片中的英语单词，并提供交互式学习体验，包含翻译和进度跟踪功能。

## ✨ 功能特性

### 核心功能
- 📸 **智能图片上传**：拖拽或点击上传包含英文文本的图片
- 🤖 **AI 文字识别**：使用 OpenAI Vision API 进行高精度单词提取
- 🌐 **即时翻译**：为所有识别的英语单词提供实时中文翻译
- 📚 **交互式学习**：卡片式学习，带有翻转动画效果
- 📊 **进度跟踪**：可视化进度条和学习统计
- 💾 **本地存储**：自动保存学习进度和偏好设置

### 用户体验
- 🎨 **现代化界面**：使用 Tailwind CSS 的美观响应式设计
- ⚡ **快速性能**：通过 React.memo、图片压缩和懒加载优化
- 📱 **移动端友好**：适配所有设备的完全响应式设计
- 🎭 **流畅动画**：CSS3 动画提供引人入胜的用户交互
- 🔄 **实时更新**：实时进度跟踪和状态管理

## 🛠 技术栈

### 前端
- **React 18** - 现代 React，使用 hooks 和 context
- **Vite** - 快速构建工具和开发服务器
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Axios** - API 调用的 HTTP 客户端
- **自定义 Hooks** - 本地存储、性能优化

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **Multer** - 文件上传中间件
- **OpenAI API** - gpt-4.1-mini（通过中国镜像服务）
- **CORS** - 跨域资源共享

### 开发工具
- **ESLint** - 代码检查
- **PostCSS** - CSS 处理
- **Autoprefixer** - CSS 厂商前缀

## 🚀 快速启动

### 方法一：使用启动脚本（推荐）

#### Windows 批处理文件
```bash
# 双击运行
start-services.bat
```

#### PowerShell 脚本
```powershell
# 右键 -> 使用 PowerShell 运行
.\start-services.ps1
```

### 方法二：使用根目录脚本
```bash
# 安装所有依赖
npm run install:all

# 启动后端（新终端窗口）
npm run start:backend

# 启动前端（新终端窗口）
npm run start:frontend
```

### 方法三：手动启动

#### 前置要求
- Node.js >= 16.0.0
- npm 或 yarn 包管理器
- OpenAI API 密钥（可选 - 提供模拟服务）

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd english-word-learner
   ```

2. **设置环境变量**
   ```bash
   # 复制环境变量模板
   cp .env.example .env
   cp frontend/.env.example frontend/.env

   # 添加你的 OpenAI API 密钥到 .env 文件（可选）
   echo "OPENAI_API_KEY=your_api_key_here" >> .env
   ```

3. **安装依赖**
   ```bash
   # 安装后端依赖
   cd backend
   npm install

   # 安装前端依赖
   cd ../frontend
   npm install
   ```

### 运行应用

1. **启动后端服务器**
   ```bash
   cd backend
   npm run dev
   # 服务器运行在 http://localhost:5000
   ```

2. **启动前端开发服务器**
   ```bash
   cd frontend
   npm run dev
   # 应用运行在 http://localhost:3000
   ```

3. **打开浏览器**
   访问 http://localhost:3000 开始使用应用

## 📡 API 文档

### 接口端点

| 方法 | 端点 | 描述 |
|--------|----------|-------------|
| GET | `/api/health` | 健康检查和服务器状态 |
| POST | `/api/upload` | 上传图片文件 |
| POST | `/api/analyze` | 分析图片并提取单词 |
| GET | `/api/test-openai` | 测试 OpenAI API 连接 |
| GET | `/api/status` | 获取服务配置状态 |

### 请求/响应示例

**分析图片**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "image=@your-image.jpg"
```

响应：
```json
{
  "success": true,
  "message": "成功分析图片并找到 5 个单词",
  "data": {
    "words": ["hello", "world", "computer", "learning", "english"],
    "translations": [
      {"english": "hello", "chinese": "你好"},
      {"english": "world", "chinese": "世界"},
      {"english": "computer", "chinese": "电脑"},
      {"english": "learning", "chinese": "学习"},
      {"english": "english", "chinese": "英语"}
    ],
    "count": 5
  }
}
```

## 📁 项目结构

```
english-word-learner/
├── frontend/                 # React 前端应用
│   ├── src/
│   │   ├── components/      # 可复用的 UI 组件
│   │   │   ├── Layout.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── UploadComponent.jsx
│   │   │   ├── WordList.jsx
│   │   │   ├── WordCard.jsx
│   │   │   └── LearningControls.jsx
│   │   ├── context/         # React 状态管理上下文
│   │   │   └── AppContext.jsx
│   │   ├── hooks/           # 自定义 React hooks
│   │   │   └── useLocalStorage.js
│   │   ├── services/        # API 服务层
│   │   │   └── api.js
│   │   ├── utils/           # 工具函数
│   │   │   ├── fileValidator.js
│   │   │   └── performance.js
│   │   ├── styles/          # CSS 和动画
│   │   │   └── animations.css
│   │   └── App.jsx          # 主应用组件
│   ├── public/              # 静态资源
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js 后端 API
│   ├── src/
│   │   ├── routes/          # API 路由处理器
│   │   │   ├── api.js
│   │   │   └── analyze.js
│   │   ├── services/        # 业务逻辑服务
│   │   │   ├── openai.js
│   │   │   └── openai-mock.js
│   │   ├── middleware/      # Express 中间件
│   │   │   └── upload.js
│   │   ├── utils/           # 工具函数
│   │   │   └── imageProcessor.js
│   │   └── app.js           # Express 应用
│   ├── uploads/             # 临时文件存储
│   ├── package.json
│   └── test-*.js            # 测试脚本
├── .env.example             # 环境变量模板
├── .gitignore
└── README.md
```

## 🎯 使用指南

### 1. 上传图片
- 拖拽包含英文文本的图片到上传区域
- 或点击"选择文件"从设备中选择
- 支持格式：JPG、PNG、GIF（最大 10MB）

### 2. AI 分析
- 应用自动分析你的图片
- 使用 AI 提取英语单词
- 提供中文翻译

### 3. 交互式学习
- 单词以卡片形式显示中文翻译
- 点击卡片显示英语单词
- 用 ✓ 按钮标记已掌握的单词
- 跟踪学习进度

### 4. 学习控制
- **显示全部**：显示所有英语单词
- **隐藏全部**：隐藏所有英语单词
- **学习模式**：在不同学习模式间切换
- **重置**：重新开始，上传新图片

## 🔧 配置

### 环境变量

**后端 (.env)**
```env
# OpenAI API 配置
# 使用中国镜像服务以获得更好的访问体验
OPENAI_API_KEY=your_openai_api_key_here
# API 基础 URL: https://api.openai-ch.top/v1
# 模型: gpt-4.1-mini

# 服务器配置
PORT=5000
NODE_ENV=development

# 文件上传配置
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
```

**前端 (frontend/.env)**
```env
# API 配置
VITE_API_URL=http://localhost:5000

# 开发配置
VITE_NODE_ENV=development
```

### 模拟服务
如果你没有 OpenAI API 密钥，应用会自动使用模拟服务来模拟 AI 功能，用于测试和开发。

## 🧪 测试

### 后端测试
```bash
cd backend

# 测试 API 端点
node test-api-openai.js

# 测试 OpenAI 集成
node test-openai-simple.js

# 测试服务器健康状态
curl http://localhost:5000/api/health
```

### 前端测试
```bash
cd frontend

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 🚀 部署

### 生产构建
```bash
# 构建前端
cd frontend
npm run build

# 构建文件将在 frontend/dist/ 目录中
```

### 环境设置
1. 在后端设置 `NODE_ENV=production`
2. 配置正确的 CORS 源
3. 设置文件上传限制
4. 配置 OpenAI API 密钥
5. 设置反向代理（推荐使用 nginx）

## 🤝 贡献

1. Fork 这个仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- OpenAI 提供的 Vision 和 GPT API
- React 团队提供的优秀框架
- Tailwind CSS 提供的实用优先 CSS 框架
- 所有贡献者和项目用户

## 📞 支持

如果你遇到任何问题或有疑问：

1. 查看 [Issues](../../issues) 页面
2. 创建新的 issue 并提供详细信息
3. 包含错误信息和重现步骤

---

**祝学习愉快！🎉**

# Git 设置指南

## 📋 项目上传到 GitHub 的步骤

### 1. 初始化 Git 仓库（如果还没有）
```bash
git init
```

### 2. 添加所有文件到暂存区
```bash
git add .
```

### 3. 提交初始版本
```bash
git commit -m "Initial commit: English Word Learner App

- Frontend: React + Vite application
- Backend: Node.js + Express API
- Features: Image OCR, AI translation, word learning
- OpenAI integration with gpt-4.1-mini model"
```

### 4. 在 GitHub 上创建新仓库
1. 登录 GitHub
2. 点击 "New repository"
3. 仓库名称：`english-word-learner`
4. 描述：`AI-powered English word learning app with image OCR`
5. 选择 "Public" 或 "Private"
6. **不要**勾选 "Add a README file"（我们已经有了）
7. **不要**勾选 "Add .gitignore"（我们已经配置了）
8. 点击 "Create repository"

### 5. 连接本地仓库到 GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/english-word-learner.git
git branch -M main
git push -u origin main
```

## 🔒 安全注意事项

### ✅ 已被 .gitignore 忽略的敏感文件：
- `.env` 文件（包含 OpenAI API 密钥）
- `backend/.env` 文件
- `backend/uploads/` 目录（用户上传的图片）
- `node_modules/` 目录

### ✅ 保留的配置模板：
- `.env.example` - 环境变量配置模板
- `backend/uploads/.gitkeep` - 保持目录结构

### ⚠️ 上传前检查清单：
1. 确认 `.env` 文件不在 Git 跟踪中
2. 确认没有真实的 API 密钥被提交
3. 确认用户上传的图片不被跟踪
4. 检查是否有其他敏感信息

## 📝 推荐的提交信息格式

### 功能开发
```bash
git commit -m "feat: add image compression feature"
git commit -m "feat: implement word progress tracking"
```

### Bug 修复
```bash
git commit -m "fix: resolve OpenAI API timeout issue"
git commit -m "fix: correct translation display bug"
```

### 文档更新
```bash
git commit -m "docs: update API documentation"
git commit -m "docs: add deployment guide"
```

### 样式调整
```bash
git commit -m "style: improve responsive design"
git commit -m "style: update color scheme"
```

### 重构
```bash
git commit -m "refactor: optimize image processing logic"
git commit -m "refactor: simplify API error handling"
```

## 🌿 分支管理建议

### 主分支
- `main` - 生产环境代码

### 开发分支
- `develop` - 开发环境代码
- `feature/功能名` - 新功能开发
- `fix/问题描述` - Bug 修复
- `hotfix/紧急修复` - 生产环境紧急修复

### 创建新分支
```bash
# 创建并切换到新分支
git checkout -b feature/word-statistics

# 开发完成后合并到 main
git checkout main
git merge feature/word-statistics
git branch -d feature/word-statistics
```

## 🚀 部署相关

### 环境变量设置
在部署平台（如 Vercel、Netlify、Heroku）设置以下环境变量：

**后端环境变量：**
```
OPENAI_API_KEY=your_actual_api_key
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

**前端环境变量：**
```
VITE_API_URL=https://your-backend-domain.com
VITE_NODE_ENV=production
```

### 构建命令
```bash
# 前端构建
cd frontend && npm run build

# 后端启动
cd backend && npm start
```

## 📚 相关文档
- [README.md](./README.md) - 项目说明和使用指南
- [.env.example](./.env.example) - 环境变量配置模板
- [package.json](./package.json) - 项目依赖和脚本

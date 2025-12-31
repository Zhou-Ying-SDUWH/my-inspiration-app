# 智能跑步记录应用

这是一个基于Next.js的智能跑步记录应用，集成了AI功能，可以根据用户的跑步历史记录生成个性化的跑步计划。

## 功能特点

- 🏃‍♂️ 跑步记录管理：添加、编辑、删除跑步记录
- 🤖 AI智能计划：根据历史跑步数据生成个性化训练计划
- 📊 数据统计：自动计算配速、总距离等数据
- 🔐 用户认证：安全的用户登录和数据隔离
- 📱 响应式设计：适配各种设备屏幕

## 技术栈

- **前端**: Next.js 16.1.1, React 19.2.3, TypeScript
- **后端**: Next.js API Routes
- **数据库**: InsForge
- **AI服务**: Google Gemini API
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **认证**: InsForge Auth

## 环境设置

1. 克隆项目到本地：
```bash
git clone https://github.com/Zhou-Ying-SDUWH/my-inspiration-app.git
cd my-inspiration-app
```

2. 安装依赖：
```bash
npm install
```

3. 设置环境变量：
创建 `.env.local` 文件并添加以下内容：

```env
# Gemini API Key (从 https://makersuite.google.com/app/apikey 获取)
GEMINI_API_KEY=your_gemini_api_key_here

# InsForge Configuration
NEXT_PUBLIC_INSFORGE_URL=https://q7crgduz.us-west.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MTIwMTV9.zcfNvjx7mHkRL__jqBssMSHkDKsD_ieG3sdEUFVN4TU
```

4. 运行开发服务器：
```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
my-inspiration-app/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   └── ai/            # AI相关API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页面
│   └── providers.tsx      # 提供者组件
├── components/            # React组件
│   ├── AIPlanComponent.tsx    # AI计划组件
│   ├── CustomUserButton.tsx   # 自定义用户按钮
│   ├── RunCard.tsx            # 跑步记录卡片
│   └── RunFormModal.tsx       # 跑步记录表单
├── config/                # 配置文件
│   └── insforge.ts        # InsForge配置
├── contexts/              # React上下文
│   └── authContext.tsx    # 认证上下文
├── store/                 # 状态管理
│   └── useRunStore.ts     # 跑步记录状态
├── types/                 # TypeScript类型定义
│   └── run.ts             # 跑步记录类型
└── utils/                 # 工具函数
    └── paceCalculations.ts # 配速计算
```

## API端点

### 生成AI跑步计划
- **路径**: `/api/ai/generate-plan`
- **方法**: POST
- **请求体**: `{ userId: string }`
- **响应**: `{ success: boolean, plan: AIPlan, planId?: string }`

### 获取已保存的计划
- **路径**: `/api/ai/get-plans`
- **方法**: GET
- **查询参数**: `userId`
- **响应**: `{ success: boolean, plans: Plan[] }`

## 部署

### 部署到Vercel

1. 将代码推送到GitHub仓库
2. 访问 [Vercel](https://vercel.com)
3. 使用GitHub账号登录
4. 点击"Add New..." → "Project"
5. 导入GitHub仓库
6. 在环境变量部分添加：
   - `GEMINI_API_KEY`: 您的Gemini API密钥
7. 点击"Deploy"

### 环境变量

在部署时，请确保设置以下环境变量：

- `GEMINI_API_KEY`: Google Gemini API密钥（必需）
- `NEXT_PUBLIC_INSFORGE_URL`: InsForge服务URL（可选，有默认值）
- `NEXT_PUBLIC_INSFORGE_ANON_KEY`: InsForge匿名密钥（可选，有默认值）

## 安全注意事项

- Gemini API密钥存储在服务器端环境变量中，不会暴露给客户端
- 所有API调用都通过后端进行，确保API密钥安全
- 用户数据通过InsForge进行隔离，确保数据安全

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License
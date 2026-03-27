# 小小老师 - MVP版本

## 📝 项目说明

一个让小学生当"小老师"、AI当学生的教学评价单页应用。

## 🎯 核心功能

1. **上传教学视频** - 孩子录制5分钟教学视频并上传
2. **AI即时评价** - 自动生成温暖、具体的评价报告
3. **分享报告** - 一键复制分享到微信

## 📁 文件结构

```
little-teacher/
├── index.html      # 主页面
├── style.css       # 样式文件
├── app.js          # 核心逻辑
└── README.md       # 说明文档
```

## 🚀 快速开始

### 方式1：本地运行（推荐）

```bash
# 进入项目目录
cd little-teacher

# 使用Python启动本地服务器
python3 -m http.server 8000

# 或使用Node.js
npx serve

# 浏览器访问
open http://localhost:8000
```

### 方式2：直接打开

双击 `index.html` 文件即可在浏览器中打开。

## ⚙️ 配置API（可选）

当前使用模拟数据，如需接入真实AI评价：

1. 打开 `app.js`
2. 修改配置：

```javascript
const CONFIG = {
    API_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
    API_KEY: '你的API密钥',
    MAX_FILE_SIZE: 100 * 1024 * 1024,
};
```

支持的API：
- OpenAI GPT-4
- Claude API
- 其他兼容OpenAI格式的API

## 🎨 功能特点

- ✅ 零依赖，纯HTML/CSS/JS
- ✅ 响应式设计，手机/平板/电脑都能用
- ✅ 模拟数据，无需API也能测试
- ✅ 温暖的评价语气，保护孩子积极性
- ✅ 一键分享功能

## 📱 使用流程

1. 输入昵称（如：小明老师）
2. 输入教学主题（如：折纸飞机）
3. 上传教学视频（建议5分钟内）
4. 点击"开始教学"
5. 等待AI评价（约3秒）
6. 查看评价报告
7. 点击"生成分享卡片"分享

## 🎯 评价维度

- ✨ 教学亮点（1-2条）
- 💡 改进建议（1条）
- ⭐ 综合评分（5-10分）
- 🏆 获得徽章（8种）
- 📚 学习收获

## 🏆 徽章系统

- 🦁 勇敢小老师
- 🌟 清晰表达奖
- 💡 创意点子奖
- ❤️ 耐心讲解奖
- 🎨 生动有趣奖
- 🔗 举一反三奖
- 🎤 自信表达奖
- 📚 知识达人奖

## 🔧 技术栈

- HTML5
- CSS3（渐变、动画、响应式）
- Vanilla JavaScript（ES6+）
- 无框架、无构建工具

## 📦 部署

### Vercel（推荐）

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel
```

### GitHub Pages

1. 上传到GitHub仓库
2. 设置 → Pages → 选择分支
3. 访问 `https://用户名.github.io/仓库名`

### Netlify

拖拽整个文件夹到 netlify.com 即可。

## 🎓 教育价值

- 培养表达能力
- 深度理解知识
- 建立自信心
- 获得即时反馈

## 📝 待优化

- [ ] 视频实际分析（目前为模拟）
- [ ] 历史记录保存
- [ ] 多人排行榜
- [ ] 实时语音互动
- [ ] 家长后台

## 📄 许可证

MIT License

## 👨‍💻 作者

吕维杰

---

**让每个孩子都能体验当老师的快乐！** 🎓

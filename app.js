// ===== 配置 =====
const CONFIG = {
    API_ENDPOINT: 'YOUR_API_ENDPOINT', // 替换为实际的API地址
    API_KEY: 'YOUR_API_KEY', // 替换为实际的API密钥
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
};

// ===== DOM 元素 =====
const elements = {
    nickname: document.getElementById('nickname'),
    topic: document.getElementById('topic'),
    videoFile: document.getElementById('videoFile'),
    submitBtn: document.getElementById('submitBtn'),
    uploadSection: document.getElementById('uploadSection'),
    reportSection: document.getElementById('reportSection'),
    loading: document.getElementById('loading'),
    greeting: document.getElementById('greeting'),
    highlightsList: document.getElementById('highlightsList'),
    suggestionText: document.getElementById('suggestionText'),
    scoreValue: document.getElementById('scoreValue'),
    badgeIcon: document.getElementById('badgeIcon'),
    badgeName: document.getElementById('badgeName'),
    badgeReason: document.getElementById('badgeReason'),
    learnedText: document.getElementById('learnedText'),
    ending: document.getElementById('ending'),
    shareBtn: document.getElementById('shareBtn'),
};

// ===== 状态管理 =====
let videoData = null;
let reportData = null;

// ===== 事件监听 =====
elements.submitBtn.addEventListener('click', handleSubmit);
elements.shareBtn.addEventListener('click', handleShare);
elements.videoFile.addEventListener('change', handleFileChange);

// ===== 文件选择处理 =====
function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > CONFIG.MAX_FILE_SIZE) {
        alert('视频文件太大了！请选择小于100MB的视频。');
        e.target.value = '';
        return;
    }

    videoData = file;
}

// ===== 表单验证 =====
function validateForm() {
    const nickname = elements.nickname.value.trim();
    const topic = elements.topic.value.trim();

    if (!nickname) {
        alert('请输入你的昵称哦！');
        return false;
    }

    if (!topic) {
        alert('请输入教学主题！');
        return false;
    }

    if (!videoData) {
        alert('请上传教学视频！');
        return false;
    }

    return true;
}

// ===== 提交处理 =====
async function handleSubmit() {
    if (!validateForm()) return;

    // 显示加载状态
    showLoading();

    try {
        // 获取视频时长
        const duration = await getVideoDuration(videoData);
        
        // 调用AI评价
        const evaluation = await getAIEvaluation({
            nickname: elements.nickname.value.trim(),
            topic: elements.topic.value.trim(),
            duration: formatDuration(duration),
        });

        // 显示评价报告
        displayReport(evaluation);
        
    } catch (error) {
        console.error('评价失败:', error);
        alert('哎呀，出错了！请稍后再试。');
        hideLoading();
    }
}
// ===== 接上script.js =====

// ===== 获取视频时长 =====
function getVideoDuration(file) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.src = URL.createObjectURL(file);
    });
}

// ===== 格式化时长 =====
function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}分${s}秒`;
}

// ===== AI评价（模拟/真实）=====
async function getAIEvaluation(params) {
    // 如果还没配置真实API，使用模拟数据
    if (CONFIG.API_KEY === 'YOUR_API_KEY') {
        return getMockEvaluation(params);
    }

    // ===== 真实API调用 =====
    const prompt = buildPrompt(params);
    
    const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: prompt.system
                },
                {
                    role: 'user',
                    content: prompt.user
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.8,
        }),
    });

    if (!response.ok) throw new Error('API请求失败');
    
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return result;
}

// ===== 构建Prompt =====
function buildPrompt(params) {
    const system = `
你是"小AI"，一个8岁的好奇小学生。
你刚看完小老师的教学视频，要写一份真实温暖的学习反馈。

评价原则：
- 真实：不说空话套话
- 具体：每个评价都有例子
- 温暖：保护孩子积极性
- 有用：建议要能真正改进

语言风格：
- 像小朋友说话：短句、口语化
- 带情绪：用感叹号、疑问句
- 举例子：说具体感受

硬性规定：
- 亮点：1-2条，每条20字内
- 建议：只能1条，30字内
- 评分：5-10分（整数）
- 禁用词：非常、很棒、太厉害了、非常好、很不错

徽章选一个最合适的：
🦁 勇敢小老师（第一次上台，很勇敢）
🌟 清晰表达奖（步骤讲得很清楚）
💡 创意点子奖（有独特的教学方法）
❤️ 耐心讲解奖（讲得很细致）
🎨 生动有趣奖（课堂很有趣）
🔗 举一反三奖（能联系生活）
🎤 自信表达奖（声音洪亮大方）
📚 知识达人奖（内容丰富准确）

严格按照JSON格式输出：
{
  "greeting": "第一感受（15字内）",
  "highlights": ["亮点1（20字内）", "亮点2（20字内，可不填）"],
  "suggestion": "改进建议（30字内）",
  "score": 8,
  "badge_icon": "🌟",
  "badge_name": "清晰表达奖",
  "badge_reason": "为什么给这个徽章（15字内）",
  "learned": "我学会了（20字内）",
  "ending": "结束语（15字内）"
}`;

    const user = `
小老师信息：
- 昵称：${params.nickname}
- 教学主题：${params.topic}
- 视频时长：${params.duration}

请根据以上信息，生成一份评价报告。
（注：本次为模拟评价，请根据主题合理想象教学内容）`;

    return { system, user };
}

// ===== 模拟评价数据（开发测试用）=====
function getMockEvaluation(params) {
    return new Promise((resolve) => {
        // 模拟网络延迟
        setTimeout(() => {
            resolve({
                greeting: `哇！${params.topic}原来是这样的！`,
                highlights: [
                    `讲解${params.topic}的步骤很清晰，我完全跟上了`,
                    `举了生活中的例子，很容易理解`
                ],
                suggestion: `下次可以讲慢一点点，这样我能记得更牢`,
                score: 8,
                badge_icon: `🌟`,
                badge_name: `清晰表达奖`,
                badge_reason: `把${params.topic}讲得简单易懂`,
                learned: `${params.topic}的关键就是要细心和耐心`,
                ending: `期待${params.nickname}下次的精彩课程！`
            });
        }, 2500);
    });
}

// ===== 显示评价报告 =====
function displayReport(data) {
    reportData = data;

    // 填充数据
    elements.greeting.textContent = data.greeting;

    elements.highlightsList.innerHTML = '';
    data.highlights.forEach(h => {
        if (h) {
            const li = document.createElement('li');
            li.textContent = h;
            elements.highlightsList.appendChild(li);
        }
    });

    elements.suggestionText.textContent = data.suggestion;
    elements.learnedText.textContent = data.learned;
    elements.ending.textContent = data.ending;

    // 动画评分
    animateScore(data.score);

    // 徽章
    elements.badgeIcon.textContent = data.badge_icon;
    elements.badgeName.textContent = data.badge_name;
    elements.badgeReason.textContent = data.badge_reason;

    // 切换显示
    hideLoading();
    elements.reportSection.classList.remove('hidden');
    
    // 滚动到报告
    elements.reportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 分数动画 =====
function animateScore(targetScore) {
    let current = 0;
    const interval = setInterval(() => {
        current++;
        elements.scoreValue.textContent = current;
        if (current >= targetScore) clearInterval(interval);
    }, 100);
}

// ===== 分享卡片 =====
function handleShare() {
    if (!reportData) return;

    const nickname = elements.nickname.value.trim();
    const topic = elements.topic.value.trim();

    // 生成分享文本
    const shareText = `
🎓 ${nickname} 当小老师啦！

📚 教学主题：${topic}
⭐ AI评分：${reportData.score}/10
🏆 获得徽章：${reportData.badge_icon}${reportData.badge_name}

✨ 亮点：${reportData.highlights[0]}
💡 AI学到了：${reportData.learned}

${reportData.ending}

「小小老师」教学评价系统
    `.trim();

    // 尝试使用原生分享
    if (navigator.share) {
        navigator.share({
            title: `${nickname}的小老师评价报告`,
            text: shareText,
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

// ===== 复制到剪贴板 =====
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('报告已复制到剪贴板！可以直接粘贴到微信分享 😊');
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('报告已复制！可以直接粘贴到微信分享 😊');
    }
}

// ===== 显示/隐藏加载 =====
function showLoading() {
    elements.submitBtn.disabled = true;
    elements.loading.classList.remove('hidden');
    elements.reportSection.classList.add('hidden');
    elements.loading.scrollIntoView({ behavior: 'smooth' });
}

function hideLoading() {
    elements.loading.classList.add('hidden');
    elements.submitBtn.disabled = false;
}

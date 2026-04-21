// ==================== 状态管理 ====================
let currentSection = 'home';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let lastArticleId = null;
let traderType = JSON.parse(localStorage.getItem('traderType')) || null;
let wallPosts = JSON.parse(localStorage.getItem('wallPosts')) || [];
let sbTimerInterval = null;

// 呼吸训练状态
let breathingInterval = null;
let breathingPattern = 'relax';
let isBreathing = false;

// 笔记状态
let currentMood = 'calm';

// ==================== 幽默金句翻译 ====================
const quoteTranslations = {
    "截断亏损，让利润奔跑。": "意思是你刚才那笔单子早该割了，别死扛。",
    "亏损是交易的一部分，接受它，然后继续前行。": "意思是亏了就亏了，别天天复盘那笔单子了。",
    "市场永远是对的。": "意思是亏钱了别骂庄家，骂自己。",
    "不要把所有鸡蛋放在一个篮子里。": "意思是别梭哈，除非你想体验人生过山车。",
    "耐心是交易者最重要的品质。": "意思是别天天盯盘，该干嘛干嘛去。",
    "趋势是你的朋友。": "意思是别逆势抄底，底下面还有地下室。",
    "计划你的交易，交易你的计划。": "意思是别看到涨了就追，跌了就怂。",
    "控制风险，利润会自己照顾自己。": "意思是先把止损设好，别想着暴富。",
    "交易不是预测未来，而是管理现在。": "意思是别觉得自己能预知未来，你没有水晶球。",
    "最大的敌人是你自己。": "意思是亏了别怪市场，是你自己手贱。",
    "简单就是最好的。": "意思是别搞一堆指标，看不懂的。",
    "不要试图接飞刀。": "意思是别抄底，底下面还有十八层地狱。",
    "成功的交易者不怕犯错，只怕不从错误中学习。": "意思是亏了要认，别老犯同样的错。",
    "贪婪和恐惧是交易者最大的敌人。": "意思是涨了别飘，跌了别怂。",
    "纪律比聪明更重要。": "意思是别自作聪明，老实执行规则。"
};

// ==================== 毒鸡汤数据 ====================
const poisonQuotes = [
    { text: "只要我不卖，我就永远是股东", author: "被套牢的你" },
    { text: "止损是为了下一次更完美的亏损", author: "交易哲学" },
    { text: "亏损是最好的老师，可惜学费太贵了", author: "交学费的你" },
    { text: "市场永远有机会让你亏钱", author: "残酷真相" },
    { text: "你以为抄到底了，其实只是抄到天花板", author: "抄底大师" },
    { text: "仓位管理？满仓梭哈才刺激！", author: "赌狗宣言" },
    { text: "技术分析就是用过去的图表预测未来的钱包空空", author: "技术派" },
    { text: "每一次亏损都是通往破产的门票", author: "破产指南" },
    { text: "追涨杀跌，散户本色", author: "散户精神" },
    { text: "别人贪婪我恐惧，别人恐惧我更恐惧", author: "怂货语录" },
    { text: "资金曲线比心电图还刺激", author: "过山车玩家" },
    { text: "每天告诉自己：今天不亏就是赚", author: "保本派" },
    { text: "看了100本书，依然做不好这一笔", author: "学渣交易员" },
    { text: "止损设好了，然后看着它穿过止损线继续跌", author: "程序化交易" },
    { text: "赚钱的交易都是运气，亏钱的都是实力", author: "自我认知" },
    { text: "一买就跌，一卖就涨，这是玄学", author: "市场操纵论" },
    { text: "复盘三个月，依然复不了一笔盈利", author: "复盘大师" },
    { text: "别人一年十倍，我一年负债", author: "人间清醒" },
    { text: "交易系统？我的系统是：开盘看心情", author: "佛系交易" },
    { text: "风险控制就是控制你亏完的速度", author: "风控专家" },
    { text: "盈利加仓？亏损加仓才是信仰", author: "马丁格尔" },
    { text: "看对方向赚不到钱，看错方向亏大钱", author: "操盘手的悲哀" },
    { text: "技术指标都金叉了，然后死叉了", author: "指标党" },
    { text: "满仓干！梭哈！赢了会所嫩模，输了下海干活", author: "赌徒圣经" },
    { text: "每一次反弹都是逃命的机会", author: "熊市生存法则" }
];

// ==================== 最蠢操作数据 ====================
const stupidOperations = [
    { op: "当天涨停板买入，第二天跌停开盘", likes: 666, author: "追高小王子" },
    { op: "看了利好新闻冲进去，收盘公告说是假消息", likes: 520, author: "新闻受害者" },
    { op: "止损设置错了，设成了止盈，然后真的止盈了", likes: 888, author: "误打误撞" },
    { op: "满仓梭哈某币，第二天币归零了", likes: 999, author: "币圈难民" },
    { op: "做空大涨的股票，被强平后它跌了", likes: 444, author: "时间管理大师" },
    { op: "做多了跌停板，想着抄底，结果连续十个跌停", likes: 777, author: "底在哪" },
    { op: "期货满仓隔夜，第二天跳空开盘直接爆仓", likes: 555, author: "隔夜恐惧症" },
    { op: "听群主喊单买入，群主跑了", likes: 333, author: "韭菜一号" },
    { op: "一天交易47次，手续费比我工资还高", likes: 999, author: "券商最喜欢的客户" },
    { op: "亏了50%割肉，然后它涨了300%", likes: 888, author: "精准逃顶" }
];

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    document.getElementById('greeting').textContent = getGreeting();
    setDailyQuote();
    loadRecommendedContent();
    loadNotes();
    updateProfileData();
    loadFavorites();
    loadHistory();
    displayTraderType();
    checkTimeAlert();
    loadWallPosts();
    loadPoisonList();
    loadStupidOps();
    
    setTimeout(() => {
        showMascotSpeech('多喝热水！☕');
    }, 2000);
}

// ==================== 时间提醒 ====================
function checkTimeAlert() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const day = now.getDay();
    
    // 周末不提醒
    if (day === 0 || day === 6) {
        document.getElementById('timeAlert').style.display = 'none';
        return;
    }
    
    const timeAlert = document.getElementById('timeAlert');
    
    // 开盘前半小时 (9:00-9:30)
    if (hour === 9 && minute < 30) {
        timeAlert.innerHTML = `
            <span class="alert-icon">🧘</span>
            <span class="alert-text">开盘前冷静提醒：今天也要管住手，别一开盘就梭哈。</span>
        `;
        timeAlert.style.display = 'block';
        timeAlert.className = 'time-alert calm';
    }
    // 收盘前半小时 (14:30-15:00)
    else if (hour === 14 && minute >= 30) {
        timeAlert.innerHTML = `
            <span class="alert-icon">🛑</span>
            <span class="alert-text">尾盘手痒症警告：别追涨杀跌了，马上收盘了，明天再来。</span>
        `;
        timeAlert.style.display = 'block';
        timeAlert.className = 'time-alert warning';
    }
    else {
        timeAlert.style.display = 'none';
    }
}

// ==================== 金句相关 ====================
function setDailyQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('dailyQuote').textContent = `"${quote.text}"`;
    document.getElementById('quoteAuthor').textContent = `—— ${quote.author}`;
    
    // 幽默翻译
    const translation = quoteTranslations[quote.text] || "意思是：听人劝，吃饱饭。";
    document.getElementById('quoteTranslation').textContent = translation;
}

function refreshQuote() {
    setDailyQuote();
    showMascotSpeech('新的一条来了！');
}

// ==================== SB操作冷静模式 ====================
function triggerSBMode() {
    const modal = document.getElementById('sbModal');
    modal.classList.add('active');
    
    let seconds = 300; // 5分钟
    const timerDisplay = document.getElementById('sbTimer');
    const btn = document.getElementById('sbModalBtn');
    
    sbTimerInterval = setInterval(() => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        if (seconds <= 0) {
            clearInterval(sbTimerInterval);
            btn.disabled = false;
            btn.textContent = '我冷静了';
            btn.onclick = closeSBMode;
        }
        seconds--;
    }, 1000);
    
    showMascotSpeech('先冷静一下！');
}

function closeSBMode() {
    document.getElementById('sbModal').classList.remove('active');
    if (sbTimerInterval) {
        clearInterval(sbTimerInterval);
    }
    showMascotSpeech('冷静就好！');
}

// ==================== 毒鸡汤生成器 ====================
function generatePoison() {
    const poison = poisonQuotes[Math.floor(Math.random() * poisonQuotes.length)];
    const card = document.getElementById('poisonCard');
    const text = document.getElementById('poisonText');
    
    card.style.animation = 'shake 0.5s';
    text.textContent = `"${poison.text}"`;
    
    setTimeout(() => {
        card.style.animation = '';
    }, 500);
    
    showMascotSpeech('干了这碗毒鸡汤！');
}

function loadPoisonList() {
    const container = document.getElementById('poisonList');
    const topPoisons = poisonQuotes.slice(0, 10);
    
    container.innerHTML = topPoisons.map(p => `
        <div class="poison-item">
            <p class="poison-item-text">"${p.text}"</p>
            <p class="poison-item-author">—— ${p.author}</p>
        </div>
    `).join('');
}

// ==================== 交易员哭墙 ====================
function loadStupidOps() {
    const container = document.getElementById('stupidOpsList');
    
    container.innerHTML = stupidOperations.map(op => `
        <div class="stupid-op-card">
            <p class="stupid-op-text">${op.op}</p>
            <div class="stupid-op-meta">
                <span class="stupid-op-author">@${op.author}</span>
                <span class="stupid-op-likes">😂 ${op.likes}</span>
            </div>
        </div>
    `).join('');
}

function postToWall() {
    const input = document.getElementById('wallInput');
    const text = input.value.trim();
    
    if (!text) {
        showMascotSpeech('说点什么吧！');
        return;
    }
    
    const post = {
        id: Date.now(),
        text: text,
        time: new Date().toISOString(),
        likes: 0
    };
    
    wallPosts.unshift(post);
    localStorage.setItem('wallPosts', JSON.stringify(wallPosts));
    
    input.value = '';
    loadWallPosts();
    showMascotSpeech('发泄出来就好！');
}

function loadWallPosts() {
    const container = document.getElementById('wallPosts');
    
    if (wallPosts.length === 0) {
        container.innerHTML = '<p class="wall-empty">还没有人吐槽，来第一个吧！</p>';
        return;
    }
    
    container.innerHTML = wallPosts.slice(0, 20).map(post => {
        const date = new Date(post.time);
        const timeStr = date.toLocaleString('zh-CN');
        
        return `
            <div class="wall-post">
                <p class="wall-post-text">${post.text}</p>
                <div class="wall-post-meta">
                    <span class="wall-post-time">${timeStr}</span>
                    <button class="wall-post-like" onclick="likePost(${post.id})">😭 ${post.likes}</button>
                </div>
            </div>
        `;
    }).join('');
}

function likePost(id) {
    const post = wallPosts.find(p => p.id === id);
    if (post) {
        post.likes++;
        localStorage.setItem('wallPosts', JSON.stringify(wallPosts));
        loadWallPosts();
    }
}

// ==================== 导航相关 ====================
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo(0, 0);
    
    if (sectionId === 'quiz') {
        initQuiz();
    }
    
    currentSection = sectionId;
}

function goBack() {
    showSection('home');
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

function closeBanner() {
    document.getElementById('suicideBanner').style.display = 'none';
}

// ==================== 交易员类型测试 ====================
const quizQuestions = [
    {
        question: "当你亏损了一笔交易后，你会怎么做？",
        options: [
            { text: "立刻寻找下一个机会，翻本！", scores: { gambler: 2 } },
            { text: "冷静分析原因，做好记录", scores: { analyzer: 2 } },
            { text: "关掉软件，喝杯热水冷静", scores: { zen: 2 } },
            { text: "找群友吐槽，大家一起亏", scores: { social: 2 } }
        ]
    },
    {
        question: "你看盘的时候，通常是什么状态？",
        options: [
            { text: "盯死屏幕，眼睛都不敢眨", scores: { hyper: 2 } },
            { text: "设置好提醒，该干嘛干嘛", scores: { zen: 2 } },
            { text: "一边看盘一边刷手机", scores: { casual: 1 } },
            { text: "忍不住频繁下单", scores: { gambler: 2 } }
        ]
    },
    {
        question: "你做交易决策主要依靠什么？",
        options: [
            { text: "技术分析和各种指标", scores: { analyzer: 2 } },
            { text: "盘感和直觉", scores: { intuitive: 2 } },
            { text: "群里大佬的建议", scores: { social: 2 } },
            { text: "抛硬币（不是开玩笑）", scores: { gambler: 2 } }
        ]
    },
    {
        question: "当你的持仓大涨时，你的第一反应是？",
        options: [
            { text: "加仓！乘胜追击！", scores: { gambler: 2 } },
            { text: "按计划分批止盈", scores: { analyzer: 2 } },
            { text: "开心但不敢动，怕卖飞", scores: { anxious: 2 } },
            { text: "截图发朋友圈炫耀", scores: { social: 2 } }
        ]
    },
    {
        question: "周末没有行情时，你会做什么？",
        options: [
            { text: "复盘这周的交易，总结经验", scores: { analyzer: 2 } },
            { text: "研究各种交易策略", scores: { analyzer: 1 } },
            { text: "完全不想看行情，去玩！", scores: { zen: 2 } },
            { text: "盯着外盘和其他市场", scores: { hyper: 2 } }
        ]
    },
    {
        question: "你给自己设定的止损纪律执行得怎么样？",
        options: [
            { text: "严格执行，从不犹豫", scores: { zen: 2, analyzer: 1 } },
            { text: "偶尔会想再等等", scores: { anxious: 2 } },
            { text: "根本没什么止损概念", scores: { gambler: 2 } },
            { text: "止损后就后悔，经常反手", scores: { gambler: 1, anxious: 1 } }
        ]
    }
];

const traderTypes = {
    zen: {
        name: "禅意交易者",
        emoji: "🧘",
        color: "#38A169",
        description: "你是交易界的「佛系选手」。涨跌都是浮云，只有内心的平静才是真。你不追求暴富，相信细水长流，偶尔还会忘记自己持仓了啥。",
        strengths: ["心态超级稳", "不会被情绪左右", "生活质量高"],
        weaknesses: ["可能过于佛系错过机会", "有时候会忘记止损"],
        tips: "保持这份佛系，但别忘了偶尔看看账户"
    },
    analyzer: {
        name: "分析型交易者",
        emoji: "🔍",
        color: "#3182CE",
        description: "你是交易界的「学霸」。每一笔交易前都要做大量研究，每一笔交易后都要写复盘报告。数据就是你的好朋友。",
        strengths: ["分析能力强", "善于总结经验", "交易有计划"],
        weaknesses: ["想太多可能错过时机", "有时候过于追求完美"],
        tips: "分析是好事，但别让分析变成借口"
    },
    hyper: {
        name: "亢奋交易者",
        emoji: "⚡",
        color: "#DD6B20",
        description: "你是交易界的「永动机」。盯盘盯到眼睛出血，24小时都想交易，账户数字跳动就是你最好的兴奋剂。",
        strengths: ["反应迅速", "精力充沛", "把握机会能力强"],
        weaknesses: ["容易过度交易", "情绪波动大", "身体可能吃不消"],
        tips: "记住：休息是为了走更远的路，多喝热水"
    },
    gambler: {
        name: "赌徒型交易者",
        emoji: "🎰",
        color: "#E53E3E",
        description: "你是交易界的「孤勇者」。满仓梭哈，一把定胜负，输了就当交学费。刺激是你的追求，暴富是你的梦想。",
        strengths: ["胆量大", "敢拼", "有时候运气确实好"],
        weaknesses: ["风险控制几乎为零", "容易爆仓"],
        tips: "建议把交易账户和买菜钱分开，至少还能吃上饭"
    },
    social: {
        name: "社交型交易者",
        emoji: "💬",
        color: "#805AD5",
        description: "你是交易界的「意见领袖」。买卖都要问问群友意见，看到别人赚钱比自己亏钱还难受。",
        strengths: ["信息来源广", "善于交流", "心态开放"],
        weaknesses: ["容易被人带节奏", "缺乏独立判断"],
        tips: "别人的意见听听就好，最后还得自己拿主意"
    },
    anxious: {
        name: "焦虑型交易者",
        emoji: "😰",
        color: "#D69E2E",
        description: "你是交易界的「纠结大师」。买也怕，卖也怕，不买不卖更怕。每天都在「要不要操作」中度过。",
        strengths: ["谨慎小心", "不会犯大错"],
        weaknesses: ["机会来了不敢抓", "内耗严重"],
        tips: "设好止损就放手去做，别让恐惧成为绊脚石"
    }
};

let currentQuestionIndex = 0;
let userScores = {};

function initQuiz() {
    currentQuestionIndex = 0;
    userScores = {};
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizProgress').style.display = 'block';
    document.getElementById('quizQuestion').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const progressFill = document.getElementById('progressFill');
    const currentQuestion = document.getElementById('currentQuestion');
    const questionContainer = document.getElementById('quizQuestion');
    
    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    currentQuestion.textContent = currentQuestionIndex + 1;
    
    questionContainer.innerHTML = `
        <h3 class="quiz-question-text">${question.question}</h3>
        <div class="quiz-options">
            ${question.options.map((option, index) => `
                <div class="quiz-option" onclick="selectAnswer(${index})">
                    ${option.text}
                </div>
            `).join('')}
        </div>
    `;
}

function selectAnswer(optionIndex) {
    const question = quizQuestions[currentQuestionIndex];
    const option = question.options[optionIndex];
    
    Object.keys(option.scores).forEach(type => {
        userScores[type] = (userScores[type] || 0) + option.scores[type];
    });
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length){
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('quizProgress').style.display = 'none';
    document.getElementById('quizQuestion').style.display = 'none';
    
    let maxScore = 0;
    let resultType = 'zen';
    
    Object.keys(userScores).forEach(type => {
        if (userScores[type] > maxScore) {
            maxScore = userScores[type];
            resultType = type;
        }
    });
    
    traderType = resultType;
    localStorage.setItem('traderType', JSON.stringify(resultType));
    
    const typeInfo = traderTypes[resultType];
    
    const resultContainer = document.getElementById('quizResult');
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
        <div class="result-card" style="border-color: ${typeInfo.color}">
            <div class="result-emoji" style="background: ${typeInfo.color}">
                ${typeInfo.emoji}
            </div>
            <h2 class="result-title" style="color: ${typeInfo.color}">${typeInfo.name}</h2>
            <p class="result-desc">${typeInfo.description}</p>
        </div>
        <div class="result-section">
            <h3 class="result-section-title">💪 你的优势</h3>
            <ul class="result-list">${typeInfo.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="result-section">
            <h3 class="result-section-title">📌 需要注意</h3>
            <ul class="result-list">${typeInfo.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
        </div>
        <div class="result-tip">
            <p><strong>💡 小贴士：</strong>${typeInfo.tips}</p>
        </div>
        <button class="result-btn" onclick="resetQuiz()">重新测试</button>
    `;
    
    displayTraderType();
    showMascotSpeech(`你是${typeInfo.name}！`);
}

function resetQuiz() {
    initQuiz();
}

function displayTraderType() {
    if (traderType && traderTypes[traderType]) {
        const typeInfo = traderTypes[traderType];
        document.getElementById('profileAvatar').textContent = typeInfo.emoji;
        document.getElementById('profileType').textContent = typeInfo.name;
    }
}

// ==================== 内容相关 ====================
function loadRecommendedContent() {
    const container = document.getElementById('recommendedContent');
    const shuffled = [...contentData].sort(() => Math.random() - 0.5);
    const recommended = shuffled.slice(0, 3);
    container.innerHTML = recommended.map(item => createContentCard(item)).join('');
}

function createContentCard(item) {
    const isFavorited = favorites.includes(item.id);
    return `
        <div class="content-card" onclick="showArticle(${item.id})">
            <div class="card-image ${item.category}">${item.icon}</div>
            <div class="card-body">
                <span class="card-category">${item.categoryLabel}</span>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc">${item.desc}</p>
                <div class="card-meta">
                    <span>阅读 ${item.readTime}</span>
                    <button class="card-action ${isFavorited ? 'favorited' : ''}" 
                            onclick="event.stopPropagation(); toggleFavorite(${item.id})">
                        ${isFavorited ? '♥' : '♡'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showRandomArticle(scenario) {
    let filtered = contentData;
    if (scenario !== 'all' && ['loss', 'win', 'anxious', 'sleep'].includes(scenario)) {
        filtered = contentData.filter(item => item.scenario === scenario);
    }
    let randomArticle;
    do {
        randomArticle = filtered[Math.floor(Math.random() * filtered.length)];
    } while (randomArticle.id === lastArticleId && filtered.length > 1);
    
    lastArticleId = randomArticle.id;
    showArticle(randomArticle.id);
}

function showArticle(id) {
    const article = contentData.find(item => item.id === id);
    if (!article) return;
    
    const isFavorited = favorites.includes(id);
    const articleContent = `
        <div class="article-header">
            <span class="article-category">${article.categoryLabel}</span>
            <h1 class="article-title">${article.title}</h1>
            <p class="article-meta">${new Date().toLocaleDateString('zh-CN')} · 阅读 ${article.readTime}</p>
        </div>
        <div class="article-body">${article.content}</div>
        <div class="article-footer">
            <button class="footer-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavorite(${id})">
                <span>${isFavorited ? '♥' : '♡'}</span>
                <span>${isFavorited ? '已收藏' : '收藏'}</span>
            </button>
            <button class="footer-btn" onclick="showRandomArticle('all')">
                <span>📖</span>
                <span>换一篇</span>
            </button>
        </div>
    `;
    
    document.getElementById('articleContent').innerHTML = articleContent;
    addToHistory(id);
    showSection('detail');
}

function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
        showMascotSpeech('收藏成功！');
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadRecommendedContent();
    loadFavorites();
    updateProfileData();
    if (currentSection === 'detail') showArticle(id);
}

function loadFavorites() {
    const container = document.getElementById('favoriteList');
    const emptyState = document.getElementById('emptyFavorites');
    
    if (favorites.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = favorites.map(id => {
        const item = contentData.find(c => c.id === id);
        return `<div class="favorite-item" onclick="showArticle(${id})">
            <span class="item-title">${item.title}</span>
            <span class="item-date">${item.categoryLabel}</span>
        </div>`;
    }).join('');
}

function addToHistory(id) {
    history = history.filter(item => item.id !== id);
    history.unshift({ id: id, time: new Date().toISOString() });
    if (history.length > 20) history = history.slice(0, 20);
    localStorage.setItem('history', JSON.stringify(history));
}

// ==================== 个人中心 ====================
function updateProfileData() {
    document.getElementById('readCount').textContent = history.length;
    document.getElementById('favoriteCount').textContent = favorites.length;
    document.getElementById('noteCount').textContent = notes.length;
    
    let streak = 0;
    if (history.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const hasToday = history.some(item => {
            const d = new Date(item.time);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });
        if (hasToday) {
            streak = 1;
            for (let i = 1; i < 30; i++) {
                const checkDate = new Date(today);
                checkDate.setDate(checkDate.getDate() - i);
                const hasRecord = history.some(item => {
                    const d = new Date(item.time);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime() === checkDate.getTime();
                });
                if (hasRecord) streak++;
                else break;
            }
        }
    }
    document.getElementById('streakCount').textContent = streak;
}

// ==================== 呼吸训练 ====================
const breathingPatterns = {
    relax: { inhale: 4, hold: 7, exhale: 8 },
    focus: { inhale: 4, hold: 4, exhale: 4 },
    sleep: { inhale: 6, hold: 0, exhale: 6 }
};

function setBreathingPattern(pattern) {
    breathingPattern = pattern;
    document.querySelectorAll('.pattern-card').forEach(card => card.classList.remove('active'));
    event.target.closest('.pattern-card').classList.add('active');
}

function startBreathing() {
    if (isBreathing) return;
    isBreathing = true;
    
    const pattern = breathingPatterns[breathingPattern];
    const circle = document.getElementById('breathingCircle');
    const phaseText = document.getElementById('breathingPhase');
    const textText = document.getElementById('breathingText');
    
    function cycle() {
        phaseText.textContent = '吸气...';
        textText.textContent = `吸气 ${pattern.inhale} 秒`;
        circle.className = 'breathing-circle inhale';
        
        setTimeout(() => {
            if (!isBreathing) return;
            if (pattern.hold > 0) {
                phaseText.textContent = '屏气...';
                textText.textContent = `屏气 ${pattern.hold} 秒`;
                circle.className = 'breathing-circle hold';
                setTimeout(() => {
                    if (!isBreathing) return;
                    phaseText.textContent = '呼气...';
                    textText.textContent = `呼气 ${pattern.exhale} 秒`;
                    circle.className = 'breathing-circle exhale';
                }, pattern.hold * 1000);
            } else {
                phaseText.textContent = '呼气...';
                textText.textContent = `呼气 ${pattern.exhale} 秒`;
                circle.className = 'breathing-circle exhale';
            }
        }, pattern.inhale * 1000);
    }
    
    cycle();
    breathingInterval = setInterval(cycle, (pattern.inhale + pattern.hold + pattern.exhale) * 1000);
}

function stopBreathing() {
    isBreathing = false;
    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
    }
    document.getElementById('breathingCircle').className = 'breathing-circle';
    document.getElementById('breathingPhase').textContent = '点击开始';
    document.getElementById('breathingText').textContent = '准备好开始了吗？';
}

function toggleBreathing() {
    isBreathing ? stopBreathing() : startBreathing();
}

// ==================== 交易笔记 ====================
function loadNotes() {
    const container = document.getElementById('notesList');
    const emptyState = document.getElementById('emptyNotes');
    
    if (notes.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    const moodEmojis = { happy: '😊', calm: '😌', sad: '😢', anxious: '😰', angry: '😠', tired: '😴' };
    const statusTexts = { profit: '盈利', loss: '亏损', break_even: '持平', no_trade: '没交易' };
    
    container.innerHTML = notes.slice(0, 10).map(note => `
        <div class="note-card">
            <div class="note-header">
                <span class="note-date">${new Date(note.time).toLocaleDateString('zh-CN')}</span>
                <span class="note-mood">${moodEmojis[note.mood] || '😐'}</span>
            </div>
            <div class="note-content">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
            ${note.tradeStatus ? `<div class="note-tags"><span class="note-tag">${statusTexts[note.tradeStatus]}</span></div>` : ''}
        </div>
    `).join('');
}

function openNoteModal() {
    document.getElementById('noteModal').classList.add('active');
    document.getElementById('noteContent').value = '';
    document.getElementById('noteTradeStatus').value = '';
    currentMood = 'calm';
    document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
}

function closeNoteModal() {
    document.getElementById('noteModal').classList.remove('active');
}

function selectMood(element) {
    document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    currentMood = element.dataset.mood;
}

function saveNote() {
    const content = document.getElementById('noteContent').value.trim();
    if (!content) {
        showMascotSpeech('写点什么吧！');
        return;
    }
    
    notes.unshift({
        id: Date.now(),
        mood: currentMood,
        tradeStatus: document.getElementById('noteTradeStatus').value,
        content: content,
        time: new Date().toISOString()
    });
    localStorage.setItem('notes', JSON.stringify(notes));
    closeNoteModal();
    loadNotes();
    updateProfileData();
    showMascotSpeech('笔记已保存！');
}

// ==================== 吉祥物 ====================
function showMascotSpeech(text) {
    const speech = document.getElementById('mascotSpeech');
    speech.textContent = text;
    speech.classList.add('show');
    setTimeout(() => speech.classList.remove('show'), 3000);
}

function toggleMascotMenu() {
    document.getElementById('mascotMenu').classList.toggle('show');
}

document.addEventListener('click', function(e) {
    const mascot = document.querySelector('.mascot-float');
    if (mascot && !mascot.contains(e.target)) {
        document.getElementById('mascotMenu').classList.remove('show');
    }
});
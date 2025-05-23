// 平滑滚动效果
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        // 获取当前滚动位置
        const startPosition = window.pageYOffset;
        // 获取目标位置
        const targetPosition = targetSection.offsetTop - 80; // 减去导航栏高度
        // 计算需要滚动的距离
        const distance = targetPosition - startPosition;

        // 平滑滚动动画
        const duration = 600; // 从1000ms改为600ms，使动画更快
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);

            // 使用 easeInOutCubic 缓动函数
            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startPosition + (distance * ease));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    });
});

// 滚动时显示动画
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '-100px'
});

document.querySelectorAll('.section-content').forEach(section => {
    observer.observe(section);
});

// 添加时间线项目的动画
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.3
});

document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// 为技能标签添加动画延迟
document.querySelectorAll('.skill-tag').forEach((tag, index) => {
    tag.style.setProperty('--tag-index', index);
});

// 添加导航水珠效果
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        const dot = link.querySelector('::after');
        if (dot) {
            dot.style.animation = 'none';
            setTimeout(() => {
                dot.style.animation = '';
            }, 10);
        }
    });
});

// 获取导航栏元素
const header = document.querySelector('header');
let lastScrollTop = 0; // 记录上一次的滚动位置

window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 判断滚动方向
    if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
        // 向下滚动，隐藏导航栏
        header.style.transform = 'translateY(-100%)';
    } else {
        // 向上滚动，显示导航栏
        header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop; // 更新上一次的滚动位置
});

// 语言切换功能
let currentLang = 'en';

function switchLanguage(lang) {
    if (!window.translations || !window.translations[lang]) {
        console.error('Translations not loaded!');
        return;
    }

    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (window.translations[lang][key]) {
            element.textContent = window.translations[lang][key];
        } else {
            console.warn(`Translation missing for key: ${key} in language: ${lang}`);
        }
    });

    // 更新按钮状态
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // 保存语言偏好
    localStorage.setItem('preferred-language', lang);
}

// 初始化语言
function initializeLanguage() {
    // 检查是否有保存的语言偏好
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    switchLanguage(savedLang);

    // 添加语言切换按钮事件监听
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
}

// 确保在 DOM 和翻译加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguage);
} else {
    initializeLanguage();
}
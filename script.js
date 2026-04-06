// 耳机变体数据
const variants = [
    {
        id: 1,
        name: "NH-01",
        subtitle: "纯净听感",
        description: "bBox，将耳机拆解为可感知的声学成分。记忆海绵、蛋白皮、金属网孔、声波粒子——从箱体中迸发，环绕耳廓，定格为纯净听感。",
        color: "#fff",
        frames: []
    },
    {
        id: 2,
        name: "NH-02",
        subtitle: "沉浸体验",
        description: "升级的驱动单元，提供更强劲的低音和更清晰的高音，让您完全沉浸在音乐的世界中。声波粒子呈360度环绕，创造沉浸式听觉体验。",
        color: "#fff",
        frames: []
    },
    {
        id: 3,
        name: "NH-03",
        subtitle: "无线自由",
        description: "蓝牙5.0技术，提供稳定的无线连接和长达30小时的电池续航，让您摆脱线缆的束缚。轻量化设计，长时间佩戴无压力。",
        color: "#fff",
        frames: []
    }
];

// 全局变量
let currentVariant = 0;
let currentFrame = 0;
let totalFrames = 241; // 序列图片总数
let isLoading = true;
let loadedFrames = 0;
let frameImages = [];

// DOM元素
const loadingOverlay = document.querySelector('.loading-overlay');
const loadingBar = document.querySelector('.loading-bar');
const loadingPercentage = document.querySelector('.loading-percentage');
const heroFrame = document.querySelector('.hero-frame');
const heroProduct = document.querySelector('.hero-product');
const heroSubtitle = document.querySelector('.hero-subtitle');
const heroDescription = document.querySelector('.hero-description');
const variantIndex = document.querySelector('.variant-index');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const faqQuestions = document.querySelectorAll('.faq-question');
const navbarLinks = document.querySelectorAll('.navbar-link');

// 初始化
function init() {
    // 预加载帧图片
    preloadFrames();
    
    // 绑定事件
    window.addEventListener('scroll', handleScroll);
    prevBtn.addEventListener('click', () => switchVariant('prev'));
    nextBtn.addEventListener('click', () => switchVariant('next'));
    
    // FAQ手风琴效果
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 导航栏滚动高亮
    window.addEventListener('scroll', updateActiveNavLink);
}

// 预加载帧图片
function preloadFrames() {
    frameImages = [];
    
    for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(3, '0');
        img.src = `assets/consequence/frame_${frameNum}_delay-0.041s.webp`;
        
        img.onload = function() {
            loadedFrames++;
            updateLoadingProgress();
            
            if (loadedFrames === totalFrames) {
                // 所有帧加载完成
                setTimeout(() => {
                    // 缓慢淡出加载覆盖层
                    loadingOverlay.style.transition = 'opacity 1.5s ease-out';
                    loadingOverlay.style.opacity = '0';
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                        isLoading = false;
                        // 初始化第一帧
                        updateFrame(0);
                    }, 1500);
                }, 1000);
            }
        };
        
        img.onerror = function() {
            loadedFrames++;
            updateLoadingProgress();
        };
        
        frameImages.push(img);
    }
}

// 更新加载进度
function updateLoadingProgress() {
    // 减慢加载条速度，让加载过程更有仪式感
    const progress = Math.min(Math.round((loadedFrames / totalFrames) * 100), 100);
    // 使用 setTimeout 延迟更新，使加载条动画更慢
    setTimeout(() => {
        loadingBar.style.width = `${progress}%`;
        loadingPercentage.textContent = `加载 ${progress}%`;
    }, loadedFrames * 20); // 每个帧延迟20毫秒，使总加载时间更长
}

// 处理滚动事件
function handleScroll() {
    if (isLoading) return;
    
    // 计算滚动位置
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // 计算页面一半的位置
    const halfPage = documentHeight / 2;
    
    // 调整滚动范围，使图片序列在页面下滑到一半后看完
    // 滚动范围设为页面一半的高度，确保用户在滚动到页面一半时能够看到完整的序列
    const scrollRange = halfPage;
    
    // 计算当前帧索引，使用缓动效果使动画更平滑
    const targetFrame = Math.min(Math.round((scrollY / scrollRange) * (totalFrames - 1)), totalFrames - 1);
    
    // 缓动效果，使帧切换更平滑
    currentFrame += (targetFrame - currentFrame) * 0.1;
    currentFrame = Math.round(currentFrame);
    
    updateFrame(currentFrame);
}

// 更新当前帧
function updateFrame(frameIndex) {
    if (frameImages[frameIndex]) {
        heroFrame.src = frameImages[frameIndex].src;
    }
}

// 切换变体
function switchVariant(direction) {
    if (direction === 'prev') {
        currentVariant = (currentVariant - 1 + variants.length) % variants.length;
    } else if (direction === 'next') {
        currentVariant = (currentVariant + 1) % variants.length;
    }
    
    updateVariant();
}

// 更新变体信息
function updateVariant() {
    const variant = variants[currentVariant];
    
    // 更新文本内容（带科技感淡入动画）
    heroProduct.style.opacity = '0';
    heroProduct.style.transform = 'translateY(20px)';
    heroProduct.style.filter = 'blur(5px)';
    
    heroSubtitle.style.opacity = '0';
    heroSubtitle.style.transform = 'translateY(20px)';
    heroSubtitle.style.filter = 'blur(5px)';
    
    heroDescription.style.opacity = '0';
    heroDescription.style.transform = 'translateY(20px)';
    heroDescription.style.filter = 'blur(5px)';
    
    setTimeout(() => {
        heroProduct.textContent = variant.name;
        heroSubtitle.textContent = variant.subtitle;
        heroDescription.textContent = variant.description;
        variantIndex.textContent = String(variant.id).padStart(2, '0');
        
        // 应用动画
        heroProduct.style.transition = 'all 0.8s ease-out';
        heroProduct.style.opacity = '1';
        heroProduct.style.transform = 'translateY(0)';
        heroProduct.style.filter = 'blur(0)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 0.8s ease-out';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
            heroSubtitle.style.filter = 'blur(0)';
            
            setTimeout(() => {
                heroDescription.style.transition = 'all 0.8s ease-out';
                heroDescription.style.opacity = '1';
                heroDescription.style.transform = 'translateY(0)';
                heroDescription.style.filter = 'blur(0)';
            }, 200);
        }, 200);
    }, 300);
}

// 更新活跃的导航链接
function updateActiveNavLink() {
    const scrollPosition = window.scrollY;
    
    navbarLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const targetTop = targetElement.offsetTop - 100;
            const targetBottom = targetTop + targetElement.offsetHeight;
            
            if (scrollPosition >= targetTop && scrollPosition < targetBottom) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// 滚动触发动画
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // 重置所有动画元素的状态
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.filter = 'blur(5px)';
        element.style.transition = 'all 1.2s ease-out';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.filter = 'blur(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // 重新观察所有元素
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    // 刷新时回到顶部
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
    
    init();
    initScrollAnimations();
});

// 监听页面加载完成事件，确保页面完全加载后回到顶部
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// 监听浏览器历史记录变化，确保回退操作时动画也能出来
window.addEventListener('popstate', function() {
    // 重新初始化滚动动画
    initScrollAnimations();
    // 回到顶部
    window.scrollTo(0, 0);
});
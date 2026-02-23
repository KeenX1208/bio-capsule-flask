// ==========================================================
// 1. 全局加载动画 (Loader)
// ==========================================================
(function() {
    const body = document.body;
    const loaderWrapper = document.getElementById('loader-wrapper');
    const loaderPercent = document.getElementById('loader-percent');

    // 只有当页面存在 loader 时才运行
    if (loaderWrapper) {
        body.classList.add('loading-locked');

        let progress = 0;
        let isRealLoaded = false; 

        window.addEventListener('load', () => {
            isRealLoaded = true;
        });

        const simulationInterval = setInterval(() => {
            if (!isRealLoaded) {
                progress += Math.random() * 0.5 + 0.2;
                if (progress >= 80) progress = 80;
            } else {
                progress += 2;
            }

            if (progress >= 100) {
                progress = 100;
                clearInterval(simulationInterval);
                finishLoader();
            }
            
            updateLoaderState(progress);
        }, 30); 

        function updateLoaderState(progValue) {
            progValue = Math.min(progValue, 100);
            const cleanProgress = Math.floor(progValue);
            const decimalProgress = progValue / 100; 
            
            if (loaderPercent) loaderPercent.innerText = cleanProgress;
            if (loaderWrapper) {
                loaderWrapper.style.setProperty('--progress-decimal', decimalProgress);
            }
        }

        function finishLoader() {
            setTimeout(() => {
                if (loaderWrapper) loaderWrapper.classList.add('loaded');
                body.classList.remove('loading-locked');
            }, 500);
        }
    }
})();


// ==========================================================
// 2. Lenis 平滑滚动 (全局)
// ==========================================================
const lenis = new Lenis({
    duration: 1.2,          
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,     
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


// ==========================================================
// 3. 导航栏交互 (全局)
// ==========================================================
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 20) {
                navbar.classList.add('floater');
            } else {
                navbar.classList.remove('floater');
            }
            ticking = false;
        });
        ticking = true;
    }
});

if (hamburger) {
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // 浮动状态样式处理
        if (navMenu.classList.contains('active')) {
            navbar.style.background = 'rgba(255,255,255,0)';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = 'none';
            navbar.style.border = 'none';
            document.body.style.overflow = 'hidden';
        } else {
            navbar.style = '';
            document.body.style.overflow = 'auto';
        }
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if(hamburger) hamburger.classList.remove('active');
        if(navMenu) navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
        if(navbar) navbar.style = '';
    });
});


// ==========================================================
// 4. 深海视差引擎 (仅 Index 首页)
// ==========================================================
const parallaxWrapper = document.querySelector('.deep-sea-wrapper');
// 获取元素 (如果在 cell.html，这些可能为 null，下面的逻辑会自动跳过)
const imgBubbles = document.querySelector('.img-bubbles');
const imgJelly1 = document.querySelector('.img-jelly-1');
const imgJelly2 = document.querySelector('.img-jelly-2');
const imgJellyMain = document.querySelector('.img-jelly-main');
const imgStarfish = document.querySelector('.img-starfish');
const imgWhale1 = document.querySelector('.img-whale-1');
const imgWhale2 = document.querySelector('.img-whale-2');
const depthCounter = document.getElementById('depth-counter');
const depthMeter = document.querySelector('.depth-meter');
const storyLines = document.querySelectorAll('.story-line');

let parallaxTicking = false; 

// 只有当页面存在视差容器时，才添加滚动监听
if (parallaxWrapper) {
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            window.requestAnimationFrame(() => {
                updateDeepSea();
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    });
}

function updateDeepSea() {
    if (!parallaxWrapper) return; 

    const rect = parallaxWrapper.getBoundingClientRect();
    const wrapperHeight = rect.height;
    const windowHeight = window.innerHeight;
    
    let progress = -rect.top / (wrapperHeight - windowHeight);
    progress = Math.min(Math.max(progress, 0), 1);

    if (rect.bottom < -windowHeight || rect.top > windowHeight) return;

    if(imgBubbles) {
        imgBubbles.style.opacity = 0.4 + progress * 0.4; 
        imgBubbles.style.transform = `translateY(-${progress * 100}px)`;
    }
    if(imgJelly1) {
        imgJelly1.style.opacity = progress > 0.05 ? 1 : 0;
        imgJelly1.style.transform = `translateY(-${progress * 600}px) rotate(${progress * 20}deg)`;
    }
    if(imgJelly2) {
        imgJelly2.style.opacity = progress > 0.1 ? 1 : 0;
        imgJelly2.style.transform = `translateY(-${progress * 700}px) scale(${1 + progress * 0.2})`;
    }
    if(imgJellyMain) {
        imgJellyMain.style.opacity = progress > 0.15 ? 1 : 0;
        imgJellyMain.style.transform = `translateX(-50%) translateY(-${progress * 900}px)`;
    }
    if(imgStarfish) {
        imgStarfish.style.opacity = progress > 0.2 ? 1 : 0;
        imgStarfish.style.transform = `translateY(-${(progress - 0.2) * 800}px) rotate(${progress * 180}deg)`;
    }

    if(imgWhale1) {
        if (progress > 0.4) {
            imgWhale1.style.opacity = 1;
            const whaleProgress = (progress - 0.4) * 1.666; 
            imgWhale1.style.transform = `translate(-${whaleProgress * 600}px, -${whaleProgress * 800}px) scale(1.2)`;
        } else {
            imgWhale1.style.opacity = 0;
        }
    }

    if(imgWhale2) {
        if (progress > 0.5) {
            imgWhale2.style.opacity = 1;
            const whaleProgress = (progress - 0.5) * 2; 
            imgWhale2.style.transform = `translate(${whaleProgress * 500}px, -${whaleProgress * 900}px) scale(1.3)`;
        } else {
            imgWhale2.style.opacity = 0;
        }
    }

    const depthStart = 0.75;
    if (depthMeter && depthCounter) {
        if (progress > depthStart) {
            depthMeter.style.opacity = 1;
            const depthFactor = (progress - depthStart) * 4; 
            const currentDepth = Math.floor(depthFactor * 10924);
            depthCounter.innerText = currentDepth;
            depthMeter.style.transform = `translateY(${(1 - depthFactor) * 20}vh)`;
        } else {
            depthMeter.style.opacity = 0;
            depthMeter.style.transform = `translateY(50vh)`;
        }
    }

    const lineTriggers = [0.1, 0.25, 0.4, 0.55, 0.65]; 
    storyLines.forEach((line, index) => {
        if (progress > 0.75) {
            line.classList.remove('active');
        } else if (progress > lineTriggers[index]) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
    
    const scrollPath = document.getElementById('scroll-path');
    if (scrollPath) {
        const drawLength = 1 - progress;
        scrollPath.style.strokeDashoffset = Math.max(0, drawLength);
    }
}

(function() {
    const triggers = document.querySelectorAll('[data-tooltip]');

    if (triggers.length > 0) {
        const tooltip = document.createElement('div');
        tooltip.className = 'bio-tooltip';
        tooltip.innerHTML = `
            <span class="bio-tooltip-title">INFO</span>
            <span class="bio-tooltip-content"></span>
        `;
        document.body.appendChild(tooltip);

        const tooltipContent = tooltip.querySelector('.bio-tooltip-content');
        const tooltipTitle = tooltip.querySelector('.bio-tooltip-title');

        function positionTooltip(target) {
            const rect = target.getBoundingClientRect();
            const tipRect = tooltip.getBoundingClientRect();

            let left = rect.left + (rect.width / 2) - (tipRect.width / 2);

            let top = rect.top - tipRect.height - 20;

            if (left < 10) left = 10;
            if (left + tipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tipRect.width - 10;
            }

            if (top < 10) {
                top = rect.bottom + 20;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        }

        triggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => {
                const text = trigger.getAttribute('data-tooltip');
                const title = trigger.getAttribute('data-title') || 'DATA';
                
                tooltipContent.textContent = text;
                tooltipTitle.textContent = title;

                tooltip.style.display = 'block';

                positionTooltip(trigger);

                requestAnimationFrame(() => {
                    tooltip.classList.add('is-visible');
                });
            });

            trigger.addEventListener('mouseleave', () => {
                tooltip.classList.remove('is-visible');
            });
            

        });

        window.addEventListener('scroll', () => {
            if(tooltip.classList.contains('is-visible')) {
                tooltip.classList.remove('is-visible');
            }
        }, { passive: true });
    }
})();
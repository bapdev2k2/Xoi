/**
 * A GARDEN OF LOVE - WOMEN'S DAY 20/10
 * Senior Creative Frontend Developer Implementation
 */

// --- CẤU HÌNH HỆ THỐNG ---
const CONFIG = {
    photos: [
        { src: 'images/photo1.jpg', text: 'Kỷ niệm đẹp' },
        { src: 'images/photo2.jpg', text: 'Nụ cười tỏa nắng' },
        { src: 'images/photo3.jpg', text: 'Khoảnh khắc' },
        { src: 'images/photo4.jpg', text: 'Ngày rực rỡ' },
        { src: 'images/photo5.jpg', text: 'Yêu thương' },
        { src: 'images/photo6.jpg', text: 'Xinh đẹp' }
    ],
    density: {
        flowers: window.innerWidth < 768 ? 20 : 40, // Responsive: giảm hoa trên mobile
        petals: window.innerWidth < 768 ? 30 : 60,
        photos: window.innerWidth < 768 ? 4 : 6
    },
    colors: {
        tulip: ['#FFD6E7', '#FFB7D5', '#F48FB1'],
        rose: ['#FFB7D5', '#F48FB1', '#D85C91', '#E8D5FF'],
        daisy: ['#FFF9F5', '#FFD6E7'],
        stem: ['#78B98A', '#4A8059', '#63A074']
    }
};

// --- DOM ELEMENTS ---
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
const fgCanvas = document.getElementById('fg-canvas');
const fgCtx = fgCanvas.getContext('2d');
const gardenLayers = {
    back: document.getElementById('garden-layer-back'),
    mid: document.getElementById('garden-layer-mid'),
    front: document.getElementById('garden-layer-front')
};
const photoContainer = document.getElementById('photo-container');

// Khởi tạo kích thước Canvas
function resizeCanvas() {
    bgCanvas.width = fgCanvas.width = window.innerWidth;
    bgCanvas.height = fgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- 1. HỆ THỐNG HOA ĐỘNG (SVG GENERATOR) ---

// SVG Templates & Helper Functions
const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];
const randomRange = (min, max) => Math.random() * (max - min) + min;

// Hàm tạo mã SVG Inline cho các loại hoa
function generateFlowerSVG(type, color, scale) {
    let svgContent = '';
    
    if (type === 'tulip') {
        svgContent = `
            <path d="M15,50 C15,20 25,5 35,5 C45,5 55,20 55,50 C45,60 25,60 15,50 Z" fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
            <path d="M35,5 C25,20 25,40 35,50 C45,40 45,20 35,5 Z" fill="rgba(255,255,255,0.2)"/>
        `;
    } else if (type === 'daisy') {
        for(let i=0; i<12; i++) {
            let angle = i * 30;
            svgContent += `<ellipse cx="35" cy="35" rx="8" ry="25" fill="${color}" transform="rotate(${angle} 35 35)" stroke="rgba(0,0,0,0.05)" stroke-width="0.5"/>`;
        }
        svgContent += `<circle cx="35" cy="35" r="8" fill="${CONFIG.colors.stem[0]}"/>`;
    } else if (type === 'rose') {
        const darker = '#D85C91'; // Hardcoded for simplicity in demo
        svgContent = `
            <circle cx="35" cy="35" r="22" fill="${color}"/>
            <path d="M25,25 Q35,15 45,25 Q55,35 45,45 Q35,55 25,45 Z" fill="rgba(255,255,255,0.3)"/>
            <circle cx="35" cy="35" r="14" fill="${darker}" opacity="0.6"/>
            <path d="M30,30 Q35,25 40,30 Q45,35 40,40 Q35,45 30,40 Z" fill="rgba(255,255,255,0.4)"/>
            <circle cx="35" cy="35" r="6" fill="${color}"/>
        `;
    }

    return `
        <svg width="70" height="70" viewBox="0 0 70 70" class="flower-head" style="transform: scale(${scale});">
            <defs>
                <filter id="glow-${type}"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <g filter="url(#glow-${type})">
                ${svgContent}
            </g>
        </svg>
    `;
}

// Xây dựng một cây hoàn chỉnh (Thân + Lá + Hoa)
function buildPlant(layerName, index) {
    const plant = document.createElement('div');
    plant.className = 'plant';
    
    // Thuộc tính theo layer
    let height, swayAnim, scaleYBase;
    if (layerName === 'back') {
        height = randomRange(100, 180);
        swayAnim = `swayBack ${randomRange(4, 7)}s infinite ease-in-out alternate`;
        scaleYBase = 0.8;
    } else if (layerName === 'mid') {
        height = randomRange(150, 250);
        swayAnim = `swayMid ${randomRange(3.5, 6)}s infinite ease-in-out alternate`;
        scaleYBase = 1;
    } else {
        height = randomRange(220, 350);
        swayAnim = `swayFront ${randomRange(3, 5)}s infinite ease-in-out alternate`;
        scaleYBase = 1.2;
    }

    // Vị trí ngang
    plant.style.left = `${randomRange(2, 95)}%`;
    plant.style.height = `${height}px`;
    plant.style.animation = swayAnim;
    plant.style.animationDelay = `-${randomRange(0, 5)}s`;

    // Sinh SVG Thân cong
    const stemColor = randomItem(CONFIG.colors.stem);
    const curve = randomRange(-30, 30);
    const stemSVG = `
        <svg width="100" height="${height}" viewBox="0 0 100 ${height}" class="stem" style="position:absolute; bottom:0; left:-50px; overflow:visible;">
            <path d="M50,${height} Q${50 + curve},${height/2} 50,20" fill="none" stroke="${stemColor}" stroke-width="${layerName === 'front' ? 4 : 2}" stroke-linecap="round"/>
            <!-- Lá đơn giản -->
            <path d="M50,${height - 50} Q${50 + curve*1.5},${height - 70} ${50 + curve*2},${height - 90} Q${50 + curve},${height - 60} 50,${height - 40}" fill="${stemColor}" opacity="0.8"/>
        </svg>
    `;

    // Chọn loại hoa ngẫu nhiên
    const types = ['tulip', 'daisy', 'rose'];
    const type = randomItem(types);
    const color = randomItem(CONFIG.colors[type]);
    const flowerScale = (layerName === 'front' ? 1.2 : layerName === 'mid' ? 0.9 : 0.6) * randomRange(0.8, 1.2);
    const flowerSVG = generateFlowerSVG(type, color, flowerScale);

    // Bọc hoa lại để đặt lên đỉnh thân
    const flowerWrapper = document.createElement('div');
    flowerWrapper.style.position = 'absolute';
    flowerWrapper.style.top = '-10px';
    flowerWrapper.style.left = '50%';
    flowerWrapper.style.transform = 'translateX(-50%)';
    flowerWrapper.innerHTML = flowerSVG;

    plant.innerHTML = stemSVG;
    plant.appendChild(flowerWrapper);

    // Hiệu ứng Hover - tạo Sparkle
    plant.addEventListener('mouseenter', (e) => {
        createSparkles(e.clientX, e.clientY, color);
    });

    return plant;
}

function plantGarden() {
    const distribution = { back: 0.4, mid: 0.35, front: 0.25 };
    const total = CONFIG.density.flowers;
    
    Object.keys(distribution).forEach(layer => {
        let count = Math.floor(total * distribution[layer]);
        for(let i=0; i<count; i++) {
            let plant = buildPlant(layer, i);
            gardenLayers[layer].appendChild(plant);
        }
    });
}

// --- 2. HỆ THỐNG CANVAS PARTICLES ---

// Lớp cha cho các hạt
class Particle {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.w = width;
        this.h = height;
    }
}

// Đốm sáng mờ (Orbs) Layer Background
class LightOrb extends Particle {
    constructor(ctx, w, h) {
        super(ctx, w, h);
        this.reset();
    }
    reset() {
        this.x = randomRange(0, this.w);
        this.y = randomRange(0, this.h);
        this.r = randomRange(20, 80);
        this.dx = randomRange(-0.2, 0.2);
        this.dy = randomRange(-0.2, 0.2);
        this.opacity = randomRange(0.05, 0.2);
        const isGold = Math.random() > 0.7;
        this.color = isGold ? '255, 230, 167' : '255, 183, 213';
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        if(this.x < -this.r || this.x > this.w + this.r || this.y < -this.r || this.y > this.h + this.r) this.reset();
    }
    draw() {
        const gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        this.ctx.beginPath();
        this.ctx.fillStyle = gradient;
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// Cánh hoa rơi (Petals) Layer Foreground
class CherryPetal extends Particle {
    constructor(ctx, w, h) {
        super(ctx, w, h);
        this.reset(true);
    }
    reset(initial = false) {
        this.x = randomRange(0, this.w);
        this.y = initial ? randomRange(-this.h, 0) : -30;
        this.size = randomRange(8, 16);
        this.speedY = randomRange(1, 2.5);
        this.speedX = randomRange(-1, 1.5);
        this.angle = randomRange(0, Math.PI * 2);
        this.spin = randomRange(-0.05, 0.05);
        this.flip = 0;
        this.flipSpeed = randomRange(0.02, 0.05);
        // Gradient màu hoa đào
        this.color1 = randomItem(['#F48FB1', '#FFB7D5', '#ffffff']);
        this.color2 = '#FFD6E7';
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * 0.5; // Gió thổi lượn sóng
        this.angle += 0.02;
        this.flip += this.flipSpeed;
        
        if (this.y > this.h + 30) this.reset();
        if (this.x > this.w + 30) this.x = -30;
        if (this.x < -30) this.x = this.w + 30;
    }
    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        // Mô phỏng 3D lật cánh hoa bằng scaleY
        this.ctx.scale(1, Math.abs(Math.sin(this.flip))); 
        
        // Vẽ hình dáng cánh hoa tự nhiên bằng bezier curves
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(this.size/2, -this.size/2, this.size, 0, 0, this.size);
        this.ctx.bezierCurveTo(-this.size, 0, -this.size/2, -this.size/2, 0, 0);
        
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.size);
        grad.addColorStop(0, this.color1);
        grad.addColorStop(1, this.color2);
        this.ctx.fillStyle = grad;
        this.ctx.fill();
        this.ctx.restore();
    }
}

const orbs = [];
const petals = [];
for(let i=0; i<15; i++) orbs.push(new LightOrb(bgCtx, window.innerWidth, window.innerHeight));
for(let i=0; i<CONFIG.density.petals; i++) petals.push(new CherryPetal(fgCtx, window.innerWidth, window.innerHeight));

function animateCanvas() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);

    orbs.forEach(orb => { orb.update(); orb.draw(); });
    petals.forEach(petal => { petal.update(); petal.draw(); });

    requestAnimationFrame(animateCanvas);
}

// --- 3. POLAROID FALLING PHOTOS ---
const fallingPhotos = [];

function initPhotos() {
    // Chỉ lấy số lượng theo cấu hình
    const selectedPhotos = CONFIG.photos.slice(0, CONFIG.density.photos);
    
    selectedPhotos.forEach((photoData, index) => {
        const div = document.createElement('div');
        div.className = 'polaroid intro-hidden';
        
        const img = document.createElement('img');
        // Xử lý ảnh mẫu hoặc ảnh thực tế
        img.src = photoData.src; 
        img.onerror = () => { img.src = `https://picsum.photos/seed/${index+1}/200/200`; }; // Fallback nếu chưa có ảnh
        
        div.appendChild(img);
        photoContainer.appendChild(div);

        // Khởi tạo Object quản lý logic rơi
        const photoObj = {
            el: div,
            data: photoData,
            x: randomRange(10, 80) * (window.innerWidth / 100),
            y: randomRange(-1000, -200), // Rải rác phía trên
            speed: randomRange(0.5, 1.2),
            angle: randomRange(-15, 15),
            drift: randomRange(0, Math.PI * 2),
            isHovered: false
        };

        // Sự kiện
        div.addEventListener('mouseenter', () => photoObj.isHovered = true);
        div.addEventListener('mouseleave', () => photoObj.isHovered = false);
        div.addEventListener('click', () => openPhotoModal(photoObj));

        fallingPhotos.push(photoObj);
    });

    animatePhotos();
}

function animatePhotos() {
    fallingPhotos.forEach(p => {
        if (!p.isHovered) {
            p.y += p.speed;
            p.drift += 0.01;
            const currentX = p.x + Math.sin(p.drift) * 30; // Lắc lư ngang
            p.el.style.transform = `translate3d(${currentX}px, ${p.y}px, 0) rotate(${p.angle}deg)`;

            // Loop back
            if (p.y > window.innerHeight + 200) {
                p.y = -200;
                p.x = randomRange(10, 80) * (window.innerWidth / 100);
            }
        }
    });
    requestAnimationFrame(animatePhotos);
}

// --- 4. TƯƠNG TÁC (INTERACTIONS) ---

// Mouse Parallax Effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX - window.innerWidth / 2;
    const mouseY = e.clientY - window.innerHeight / 2;
    document.documentElement.style.setProperty('--mouseX', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouseY', `${mouseY}px`);
});

// Click to Bloom (Tạo hoa nhỏ ngay tại vị trí click)
document.addEventListener('click', (e) => {
    // Bỏ qua nếu click vào UI hoặc Ảnh
    if(e.target.closest('#ui-layer') || e.target.closest('.polaroid') || e.target.closest('.modal')) return;

    const dummyFlower = document.createElement('div');
    dummyFlower.style.position = 'absolute';
    dummyFlower.style.left = `${e.clientX - 35}px`;
    dummyFlower.style.top = `${e.clientY - 35}px`;
    dummyFlower.style.zIndex = 4;
    dummyFlower.style.animation = `growUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
    
    dummyFlower.innerHTML = generateFlowerSVG(randomItem(['tulip', 'daisy']), randomItem(CONFIG.colors.rose), 0.8);
    document.body.appendChild(dummyFlower);

    createSparkles(e.clientX, e.clientY, '#FFE6A7', 10);

    setTimeout(() => {
        dummyFlower.style.transition = 'opacity 1s, transform 1s';
        dummyFlower.style.opacity = '0';
        dummyFlower.style.transform += ' translateY(-20px)';
        setTimeout(() => dummyFlower.remove(), 1000);
    }, 2000);
});

// Tạo hạt lấp lánh bằng DOM ngắn hạn
function createSparkles(x, y, color, count = 5) {
    for(let i=0; i<count; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.width = '6px';
        sparkle.style.height = '6px';
        sparkle.style.backgroundColor = color;
        sparkle.style.borderRadius = '50%';
        sparkle.style.boxShadow = `0 0 8px ${color}`;
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = 10;
        
        const angle = randomRange(0, Math.PI * 2);
        const distance = randomRange(20, 60);
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        sparkle.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: randomRange(600, 1200),
            easing: 'ease-out'
        });

        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1200);
    }
}

// --- 5. MODALS & UI ---

// Photo Modal
const modalPhoto = document.getElementById('modal-photo');
const zoomedPhoto = document.getElementById('zoomed-photo');
const photoCaption = document.getElementById('photo-caption');

function openPhotoModal(photoObj) {
    zoomedPhoto.src = photoObj.el.querySelector('img').src;
    photoCaption.innerText = photoObj.data.text;
    modalPhoto.classList.remove('hidden');
}

// Message Modal
const modalMessage = document.getElementById('modal-message');
document.getElementById('btn-heart').addEventListener('click', (e) => {
    // Hiệu ứng pháo hoa trái tim nhỏ
    createSparkles(e.clientX, e.clientY, '#F48FB1', 20);
    modalMessage.classList.remove('hidden');
});

// Đóng Modals
document.querySelectorAll('.close-btn, .modal-backdrop').forEach(btn => {
    btn.addEventListener('click', () => {
        modalPhoto.classList.add('hidden');
        modalMessage.classList.add('hidden');
    });
});

// Âm thanh
let audioFile = new Audio('assets/music.mp3');
audioFile.loop = true;
audioFile.volume = 1;
let isPlaying = false;
const btnAudio = document.getElementById('btn-audio');

btnAudio.addEventListener('click', () => {
    if(isPlaying) {
        audioFile.pause();
        btnAudio.innerText = "🎵 Bật nhạc";
    } else {
        // Handle lỗi nếu không có file mp3
        audioFile.play().catch(e => {
            console.log("Audio file 'assets/music.mp3' not found or browser blocked autoplay.");
            alert("Vui lòng thêm file music.mp3 vào thư mục assets/ để nghe nhạc nhé!");
        });
        btnAudio.innerText = "⏸ Tạm dừng";
    }
    isPlaying = !isPlaying;
});

// --- 6. CINEMATIC INTRO SEQUENCE ---
async function startIntro() {
    // Chờ DOM load xong
    await new Promise(r => setTimeout(r, 500));

    // Hiện Background
    document.querySelectorAll('.garden-layer').forEach(layer => {
        layer.style.transition = 'opacity 2s ease, transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        layer.style.opacity = 1;
        // Bắt đầu cho hoa mọc lên
        layer.querySelectorAll('.plant').forEach((plant, i) => {
            plant.style.animation = `growUp 1.5s ease backwards`;
            plant.style.animationDelay = `${(i * 0.1) % 1}s`;
            
            // Sau khi mọc xong, chuyển sang animation đung đưa
            setTimeout(() => {
                let swayAnim;
                if(layer.classList.contains('back')) swayAnim = `swayBack ${randomRange(4, 7)}s infinite ease-in-out alternate`;
                else if(layer.classList.contains('mid')) swayAnim = `swayMid ${randomRange(3.5, 6)}s infinite ease-in-out alternate`;
                else swayAnim = `swayFront ${randomRange(3, 5)}s infinite ease-in-out alternate`;
                
                plant.style.animation = swayAnim;
            }, 2000 + (i * 100) % 1000);
        });
    });

    await new Promise(r => setTimeout(r, 1000));

    // Hiện Text
    document.querySelector('.main-title').classList.add('intro-animate');
    await new Promise(r => setTimeout(r, 500));
    document.querySelector('.sub-title').classList.add('intro-animate');
    await new Promise(r => setTimeout(r, 500));
    document.querySelector('.message').classList.add('intro-animate');
    document.querySelector('.controls').classList.add('intro-animate');

    // Bắt đầu cho ảnh rơi
    await new Promise(r => setTimeout(r, 1000));
    document.querySelectorAll('.polaroid').forEach(el => el.classList.remove('intro-hidden'));
}

// Khởi chạy
window.onload = () => {
    plantGarden();
    initPhotos();
    animateCanvas();
    startIntro();
};
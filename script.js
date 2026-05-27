// ================= script.js =================
// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // إزالة شاشة التحميل
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1000);

    // تعيين السنة الحالية في الفوتر
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.innerText = new Date().getFullYear();

    // تهيئة البطاقة بالاسم الافتراضي عند الفتح لأول مرة
    if (typeof generateCard === 'function') generateCard();
});

// 1. الوضع الليلي / النهاري
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        if (typeof generateCard === 'function') generateCard();
    });
}

// 2. تشغيل / إيقاف الموسيقى
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            bgMusic.play().catch(e => console.log("Auto-play prevented:", e));
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        isPlaying = !isPlaying;
    });
}

// 3. مصفوفة الأشخاص المهنئين وعرضها
const peopleToGreet = [
    { name: 'العائلة الكريمة', msg: 'كل عام وأنتم السند والخير' },
    { name: 'أصدقائي الأعزاء', msg: 'عيدكم مبارك وأيامكم سعيدة' },
    { name: 'زملاء العمل والدراسة', msg: 'تقبل الله منا ومنكم صالح الأعمال' },
    { name: 'كل من أحب', msg: 'عساكم من عواده' }
];

const greetingsContainer = document.getElementById('greetingsContainer');
if (greetingsContainer) {
    peopleToGreet.forEach(person => {
        greetingsContainer.innerHTML += `
            <div class="glass-card greeting-card">
                <i class="fas fa-star-and-crescent"></i>
                <h3>${person.name}</h3>
                <p style="margin-top: 10px; color: var(--secondary-color);">${person.msg}</p>
            </div>
        `;
    });
}

// 4. قوالب البطاقات وإعداد Canvas
const canvas = document.getElementById('eidCanvas');
let ctx = null;
if (canvas) ctx = canvas.getContext('2d');

let uploadedImgSrc = null;

const templates = {
    '1': { bg: '#0F4C3A', border: '#D4AF37', accent: '#D4AF37', text: '#ffffff' }, // الأخضر الملكي
    '2': { bg: '#0B2046', border: '#C0C0C0', accent: '#C0C0C0', text: '#ffffff' }, // الأزرق الفضي
    '3': { bg: '#4A0E1B', border: '#D4AF37', accent: '#D4AF37', text: '#ffffff' }, // العنابي الذهبي
    '4': { bg: '#1A1A1A', border: '#D4AF37', accent: '#D4AF37', text: '#ffffff' } // الأسود الراقي
};

// تحميل الصورة الشخصية
const userImageInput = document.getElementById('userImage');
if (userImageInput) {
    userImageInput.addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            uploadedImgSrc = event.target.result;
            if (typeof generateCard === 'function') generateCard();
        }
        if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
    });
}

// وظيفة رسم الخلفية الأساسية والنصوص
function drawDefaultCanvas(senderName, templateId, customMsg) {
    if (!ctx || !canvas) return;
    const t = templates[templateId] || templates['1'];

    // لون الخلفية بناءً على القالب
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // إطار فاخر
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.lineWidth = 5;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // زخارف بسيطة في الزوايا
    ctx.fillStyle = t.accent;
    ctx.font = "50px 'Font Awesome 6 Free'";
    ctx.fillText("\uf6d6", 100, 150);
    ctx.fillText("\uf6d6", canvas.width - 130, 150);
    ctx.fillText("\uf6d6", 100, canvas.height - 100);
    ctx.fillText("\uf6d6", canvas.width - 130, canvas.height - 100);

    // النصوص الأساسية
    ctx.textAlign = "center";
    ctx.direction = "rtl";

    ctx.fillStyle = t.accent;
    ctx.font = "bold 110px 'Cairo'";
    ctx.fillText("عيد أضحى مبارك", canvas.width / 2, 250);

    ctx.fillStyle = t.text;
    ctx.font = "46px 'Cairo'";
    ctx.fillText("أعاده الله عليكم باليمن والبركات", canvas.width / 2, 350);

    // منطقة توقيع كاتب البطاقة
    ctx.font = "38px 'Cairo'";
    ctx.fillStyle = t.accent;
    ctx.fillText("مع تحيات:", canvas.width / 2, canvas.height - 160);
    ctx.fillStyle = t.text;
    ctx.font = "bold 52px 'Cairo'";
    ctx.fillText(senderName, canvas.width / 2, canvas.height - 90);

    // إضافة التهنئة الخاصة إن وجدت
    if (customMsg && customMsg.trim() !== "") {
        ctx.fillStyle = t.accent;
        ctx.font = "48px 'Cairo'";
        ctx.fillText(customMsg, canvas.width / 2, canvas.height - 250);
    }
}

// دالة رسم الصورة أو الأيقونة الافتراضية
function drawImageOrIcon(templateId) {
    if (!ctx || !canvas) return;
    const t = templates[templateId] || templates['1'];
    const centerX = canvas.width / 2;
    const centerY = 580;
    const radius = 170;

    if (uploadedImgSrc) {
        const img = new Image();
        img.onload = function() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const aspectRatio = img.width / img.height;
            let drawWidth = radius * 2;
            let drawHeight = radius * 2;

            if (aspectRatio > 1) {
                drawWidth = drawHeight * aspectRatio;
            } else {
                drawHeight = drawWidth / aspectRatio;
            }

            ctx.drawImage(img, centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight);
            ctx.restore();

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.lineWidth = 12;
            ctx.strokeStyle = t.accent;
            ctx.stroke();
        };
        img.src = uploadedImgSrc;
    } else {
        // أيقونة افتراضية جميلة
        ctx.fillStyle = t.accent === '#D4AF37' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(192, 192, 192, 0.15)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = t.accent;
        ctx.font = "140px 'Font Awesome 6 Free'";
        ctx.fillText('\uf678', centerX - 70, centerY + 50);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.lineWidth = 8;
        ctx.strokeStyle = t.accent;
        ctx.stroke();
    }
}

// دالة أساسية لإنشاء البطاقة مع تأثير الكونفيتي
function generateCard() {
    if (!ctx || !canvas) return;

    const nameInput = document.getElementById('userName');
    const msgInput = document.getElementById('userMsg');
    const templateSelect = document.getElementById('cardTemplate');

    const name = (nameInput && nameInput.value) ? nameInput.value : 'محمد عبد المنعم محمد مصطفى عتمان';
    const customMsg = (msgInput && msgInput.value) ? msgInput.value : 'كل عام وأنتم بخير';
    const templateId = (templateSelect && templateSelect.value) ? templateSelect.value : '1';

    // رسم الخلفية والنصوص
    drawDefaultCanvas(name, templateId, customMsg);
    // رسم الصورة أو الأيقونة
    drawImageOrIcon(templateId);

    // إطلاق الكونفيتي بشكل خفيف عند كل توليد للبطاقة (مرة واحدة كل 300ms على الأقل لمنع التكدس)
    if (typeof confetti === 'function') {
        // تأخير بسيط للتأكد من الرسم قبل الكونفيتي
        setTimeout(() => {
            fireConfettiLight();
        }, 50);
    }
}

// كونفيتي خفيف وجميل
let confettiTimeout = null;

function fireConfettiLight() {
    if (confettiTimeout) return;
    confettiTimeout = setTimeout(() => {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, startVelocity: 15, colors: ['#D4AF37', '#0F4C3A', '#ffffff'] });
            confetti({ particleCount: 80, spread: 100, origin: { y: 0.7, x: 0.3 }, startVelocity: 20 });
            confetti({ particleCount: 80, spread: 100, origin: { y: 0.7, x: 0.7 }, startVelocity: 20 });
        }
        confettiTimeout = null;
    }, 100);
}

// دالة تحميل البطاقة
function downloadCard() {
    if (!canvas) return;
    try {
        const link = document.createElement('a');
        link.download = 'بطاقة_عيد_الأضحى.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (e) {
        alert("حدث خطأ أثناء تحميل البطاقة");
    }
}

// دالة مشاركة البطاقة
async function shareCard() {
    if (!canvas) return;
    canvas.toBlob(async(blob) => {
        if (!blob) return;
        const file = new File([blob], 'eid-card.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'بطاقة تهنئة بعيد الأضحى',
                    text: 'كل عام وأنتم بخير بمناسبة عيد الأضحى المبارك!',
                    files: [file]
                });
            } catch (error) {
                console.log('خطأ أثناء المشاركة:', error);
                alert("تم إلغاء المشاركة أو حدث خطأ.");
            }
        } else {
            alert("المشاركة المباشرة غير مدعومة في متصفحك حالياً، يرجى تحميل البطاقة وإرسالها يدوياً.");
        }
    });
}

// ربط الأحداث بالعناصر بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // ربط أزرار إنشاء البطاقة وتحميلها ومشاركتها
    const generateBtn = document.getElementById('generateCardBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateCard);
    }

    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCard);
    }

    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareCard);
    }

    // إضافة مستمعين للحقول لتحديث البطاقة بشكل تلقائي (اختياري لتحسين التجربة)
    const userNameField = document.getElementById('userName');
    const userMsgField = document.getElementById('userMsg');
    const templateField = document.getElementById('cardTemplate');

    if (userNameField) userNameField.addEventListener('input', generateCard);
    if (userMsgField) userMsgField.addEventListener('input', generateCard);
    if (templateField) templateField.addEventListener('change', generateCard);

    // توليد البطاقة لأول مرة بعد ربط الأحداث
    if (typeof generateCard === 'function') generateCard();

    // إضافة تأثيرات إضافية: عند النقر على أي بطاقة في قسم الأشخاص يتم عمل كونفيتي صغير تحية
    const greetingCards = document.querySelectorAll('.greeting-card');
    greetingCards.forEach(card => {
        card.addEventListener('click', () => {
            if (typeof confetti === 'function') {
                confetti({ particleCount: 60, spread: 55, origin: { y: 0.8 }, startVelocity: 12 });
            }
        });
    });
});
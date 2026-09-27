// ===== Typing Animation Effect =====
const textElement = document.getElementById('typing-text');
const texts = ['Ethical Hacker', 'Network Engineer', 'Web Developer', 'UI/UX Designer'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
        textElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        textElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500; // Pause before typing
    }

    setTimeout(type, typingSpeed);
}

document.addEventListener('DOMContentLoaded', type);

// ===== Smooth scrolling for in-page links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const navMenu = document.getElementById('navMenu');
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
            }
        }
    });
});

// ===== Parallax effect on hero glow =====
document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.bg-glow');
    if (!glow) return;
    const x = (window.innerWidth - e.pageX) / 50;
    const y = (window.innerHeight - e.pageY) / 50;
    glow.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
});

// ===== Mobile menu toggle =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

// ===== Reveal on scroll (fade/slide in) =====
// Content is visible by default in CSS. Only hide-then-reveal once the observer
// is confirmed working — never add "pending" before the observer can guarantee
// it will be removed again (a construction error would otherwise trap content
// permanently invisible).
const revealEls = document.querySelectorAll('.reveal');

try {
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.remove('pending');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(el => {
            el.classList.add('pending');
            revealObserver.observe(el);
        });
    }
} catch (err) {
    // Fall back to everything simply visible (default CSS state).
    revealEls.forEach(el => el.classList.remove('pending'));
}

// ===== Animate skill bars + circular meters when in view =====
const barFills = document.querySelectorAll('.bar-fill');
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 52; // r=52 from SVG
const circleFills = document.querySelectorAll('.circle-fill');

function showFinalValues() {
    // Fallback: just show the final values immediately, no animation.
    barFills.forEach(bar => { bar.style.width = bar.getAttribute('data-value') + '%'; });
    circleFills.forEach(circle => {
        const value = parseFloat(circle.getAttribute('data-value'));
        const offset = CIRCLE_CIRCUMFERENCE - (value / 100) * CIRCLE_CIRCUMFERENCE;
        circle.style.strokeDasharray = CIRCLE_CIRCUMFERENCE;
        circle.style.strokeDashoffset = offset;
    });
}

try {
    if ('IntersectionObserver' in window) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const value = entry.target.getAttribute('data-value');
                    entry.target.style.width = value + '%';
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const circleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const value = parseFloat(entry.target.getAttribute('data-value'));
                    const offset = CIRCLE_CIRCUMFERENCE - (value / 100) * CIRCLE_CIRCUMFERENCE;
                    entry.target.style.strokeDasharray = CIRCLE_CIRCUMFERENCE;
                    entry.target.style.strokeDashoffset = offset;
                    circleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        barFills.forEach(bar => barObserver.observe(bar));
        circleFills.forEach(circle => circleObserver.observe(circle));
    } else {
        showFinalValues();
    }
} catch (err) {
    showFinalValues();
}

// ===== Active nav link highlighting on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ===== Back to top button =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// ===== Contact form (front-end only — opens the visitor's email client) =====
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        const subject = encodeURIComponent(`Portfolio contact from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

        window.location.href = `mailto:sammichael1233@gmail.com?subject=${subject}&body=${body}`;
        formNote.textContent = "Opening your email app...";
        contactForm.reset();
    });
}

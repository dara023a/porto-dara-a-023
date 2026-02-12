// MODE GELAP/TERAMG

class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggle() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
}

// SPOTLIGHT EFFECT

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--cursor-x', x + 'px');
    document.documentElement.style.setProperty('--cursor-y', y + 'px');
});

// ACTIVE NAVIGATION (SCROLL SPY)

const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');

const observerOptions = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(nav => nav.classList.remove('active'));
            
            const id = entry.target.getAttribute('id');
            const activeLink = document.querySelector(`.nav-item[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// CONTACT FORM

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        if (!formData.name || !formData.email || !formData.message) {
            this.showNotification('Mohon lengkapi semua field!', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showNotification('Format email tidak valid!', 'error');
            return;
        }

        this.showNotification(
            `Terima kasih ${formData.name}! Pesan Anda telah diterima. Saya akan segera menghubungi Anda.`,
            'success'
        );

        this.form.reset();
        console.log('Form data:', formData);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        
        const bgColor = type === 'success' 
            ? (document.documentElement.getAttribute('data-theme') === 'dark' 
                ? '#a6da95'  // macchiato green
                : '#40a02b') // latte green
            : (document.documentElement.getAttribute('data-theme') === 'dark'
                ? '#ed8796'  // macchiato red
                : '#d20f39'); // latte red
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '10px',
            backgroundColor: bgColor,
            color: 'white',
            fontWeight: '600',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateX(400px)',
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ANIMASI SCROLL

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );

        const animatedElements = document.querySelectorAll(
            '.stat-card, .skill-category, .card-item, .timeline-item, .education-card'
        );

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            
            observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }
}

// SMOOTH SCROLL FOR NAVIGATION LINKS

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// INITIALIZATION

document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    const contactForm = new ContactForm();
    const scrollAnimations = new ScrollAnimations();
    
    // Log initialization
    console.log('Portfolio initialized successfully');
    console.log('Theme:', themeManager.theme);
});

// ============================================
// KEYBOARD NAVIGATION ACCESSIBILITY
// ============================================
document.addEventListener('keydown', (e) => {
    // Alt + T to toggle theme
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) toggleBtn.click();
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized mousemove for spotlight effect
const optimizedMouseMove = debounce((e) => {
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--cursor-x', x + 'px');
    document.documentElement.style.setProperty('--cursor-y', y + 'px');
}, 10);

// Replace the direct mousemove listener with optimized version
document.removeEventListener('mousemove', document.querySelector('mousemove'));
document.addEventListener('mousemove', optimizedMouseMove);

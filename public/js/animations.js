document.addEventListener('DOMContentLoaded', () => {
    // Theme Switcher Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Initial theme set by server in data-theme attribute on <html> or <body>
    // We'll trust the body attribute set in main.ejs

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const theme = themeToggle.checked ? 'dark' : 'light';
            body.setAttribute('data-theme', theme);

            // Sync with session
            fetch('/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme })
            });

            // ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'theme-ripple';
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1000);
        });
    }

    // Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                }, index * 100);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Typing Effect for Hero
    const typingEl = document.querySelector('.typing-text');
    if (typingEl) {
        const text = typingEl.dataset.text;
        let i = 0;
        function type() {
            if (i < text.length) {
                typingEl.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        type();
    }

    // Vanilla Tilt Integration (using data attributes)
    // We'll inject the script but for now we'll simulate the feel with CSS transitions

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.dataset.target;
        const speed = 200;
        const updateCount = () => {
            const count = +counter.innerText;
            const inc = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });

    // Ripple Effect on Clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
            const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
            const circle = document.createElement('span');
            const diameter = Math.max(btn.clientWidth, btn.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - btn.offsetLeft - radius}px`;
            circle.style.top = `${e.clientY - btn.offsetTop - radius}px`;
            circle.classList.add('ripple');

            const ripple = btn.getElementsByClassName('ripple')[0];
            if (ripple) ripple.remove();
            btn.appendChild(circle);
        }
    });

    // showToast implementation
    window.showToast = (message, type = 'primary') => {
        const toastContainer = document.getElementById('toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `glass-panel p-3 mb-2 reveal shadow-lg border-start border-4 border-${type}`;
        toast.style.minWidth = '250px';
        toast.style.pointerEvents = 'auto';
        toast.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <i class="fas fa-${type === 'danger' ? 'exclamation-circle' : 'check-circle'} text-${type}"></i>
                <div class="small fw-bold">${message}</div>
            </div>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('reveal-active'), 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '2rem';
        container.style.right = '2rem';
        container.style.zIndex = '9999';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
        return container;
    }
});

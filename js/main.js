// ===== Configuration =====
const BUSINESS_EMAIL = 'varunbhatia2004@gmail.com';

// ===== EmailJS Configuration =====
const EMAILJS_PUBLIC_KEY = 'LdBVqtPcvBKvH5vjC';
const EMAILJS_SERVICE_ID = 'service_t3zap0i';
const EMAILJS_CONTACT_TEMPLATE = 'template_tk2kfwf';

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// ===== Pricing Information =====
const PRICING_INFO = {
    'Starter - $100': {
        name: 'Starter Package',
        price: 100,
        features: ['Individual W-2 Tax Return Only']
    },
    'Standard - $150': {
        name: 'Standard Package',
        price: 150,
        features: ['W-2 Tax Returns', '1099 Forms', 'Schedule C Returns']
    },
    'Premium - $200': {
        name: 'Premium Package',
        price: 200,
        features: ['W-2 Tax Returns', '1099 / Schedule C Returns', 'Gambling Income', 'Investment Income']
    },
    'Other': {
        name: 'Custom Service',
        price: 'Custom',
        features: ['Contact us for details']
    }
};

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const scrollTopBtn = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');
const paymentForm = document.getElementById('paymentForm');

// ===== Mobile Menu Toggle =====
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// ===== Scroll to Top =====
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Contact Form Handling =====
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.service || !data.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Get service display name
        const serviceNames = {
            'w2-only': 'W-2 Only',
            '1099-schedule-c': '1099 / Schedule C',
            'gambling-income': 'Gambling Income'
        };
        const serviceName = serviceNames[data.service] || data.service;

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Prepare email parameters for EmailJS
        const templateParams = {
            to_email: BUSINESS_EMAIL,
            from_name: data.name,
            from_email: data.email,
            phone: data.phone || 'Not provided',
            service: serviceName,
            message: data.message,
            date: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        try {
            // Send email via EmailJS
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE, templateParams);
            showNotification('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
            this.reset();
        } catch (error) {
            console.error('Email error:', error);
            showNotification('Failed to send message. Please try again or contact us directly.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== Payment Form Handling =====
if (paymentForm) {
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const payerName = document.getElementById('payerName').value;
        const payerEmail = document.getElementById('payerEmail').value;
        const serviceSelected = document.getElementById('serviceSelected').value;
        const paymentAmount = document.getElementById('paymentAmount').value;
        const paymentNotes = document.getElementById('paymentNotes').value;

        // Validation
        if (!payerName || !payerEmail || !serviceSelected || !paymentAmount) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payerEmail)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Get pricing info
        const pricingDetails = PRICING_INFO[serviceSelected] || { name: serviceSelected, features: [] };
        const receiptNumber = 'BTS-' + Date.now().toString().slice(-8);
        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create email subject and body for payment confirmation
        const subject = `Payment Confirmation - ${payerName} - Receipt #${receiptNumber}`;
        const body = `PAYMENT CONFIRMATION
========================

Receipt Number: ${receiptNumber}
Date: ${currentDate}

CLIENT INFORMATION:
Name: ${payerName}
Email: ${payerEmail}

PAYMENT DETAILS:
Service: ${pricingDetails.name || serviceSelected}
Amount Paid: $${paymentAmount}
Payment Method: Zelle

Features Included:
${pricingDetails.features.map(f => '- ' + f).join('\n')}

Additional Notes: ${paymentNotes || 'None'}

========================
Bhatia Tax Services
Email: ${BUSINESS_EMAIL}
Phone: (714) 872-6910`;

        // Open mailto link
        const mailtoLink = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        showNotification(`Opening email client - Receipt #${receiptNumber}`, 'success');
        this.reset();
    });
}

// ===== Copy to Clipboard =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Email copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Email copied to clipboard!', 'success');
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: 0.5rem;
        opacity: 0.8;
    `;
    closeBtn.addEventListener('click', () => removeNotification(notification));

    // Auto remove after 5 seconds
    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .service-card,
        .pricing-card,
        .testimonial-card,
        .about-card,
        .payment-card,
        .payment-info {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .service-card.animate-in,
        .pricing-card.animate-in,
        .testimonial-card.animate-in,
        .about-card.animate-in,
        .payment-card.animate-in,
        .payment-info.animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .service-card:nth-child(2) { transition-delay: 0.1s; }
        .service-card:nth-child(3) { transition-delay: 0.2s; }

        .pricing-card:nth-child(2) { transition-delay: 0.1s; }
        .pricing-card:nth-child(3) { transition-delay: 0.2s; }

        .testimonial-card:nth-child(2) { transition-delay: 0.1s; }
        .testimonial-card:nth-child(3) { transition-delay: 0.2s; }
    `;
    document.head.appendChild(animationStyles);

    // Observe cards
    document.querySelectorAll('.service-card, .pricing-card, .testimonial-card, .about-card, .payment-card, .payment-info').forEach(card => {
        observer.observe(card);
    });
});

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.dataset.suffix || '');
        }
    }

    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                const suffix = text.replace(/[0-9]/g, '');
                stat.dataset.suffix = suffix;
                animateCounter(stat, number);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});

// ===== Active Navigation Highlight =====
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Add active link styles
document.addEventListener('DOMContentLoaded', () => {
    const activeLinkStyles = document.createElement('style');
    activeLinkStyles.textContent = `
        .nav-links a.active {
            color: var(--primary-color);
        }
        .nav-links a.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(activeLinkStyles);
});

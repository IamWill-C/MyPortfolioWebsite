// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const social = document.querySelector('.social');

if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        if (social) social.classList.toggle('open', open);
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
    });
}

// Lightbox: mark any image with the data-lightbox attribute to make it click-to-enlarge
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// The element that opened the lightbox, so focus can go back to it on close
let lightboxOpener = null;

function openLightbox(img) {
    if (lightbox && lightboxImg) {
        // data-full lets a small thumbnail open a larger version of the same image
        lightboxImg.src = img.dataset.full || img.src;
        lightboxImg.alt = img.alt;
        lightboxOpener = img;
        lightbox.classList.add('open');
        lightbox.focus();
    }
}

function closeLightbox() {
    if (lightbox && lightbox.classList.contains('open')) {
        lightbox.classList.remove('open');
        if (lightboxOpener) lightboxOpener.focus();
        lightboxOpener = null;
    }
}

if (lightbox) lightbox.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    // The lightbox has nothing else to focus, so keep Tab from moving focus to the page behind it
    if (e.key === 'Tab' && lightbox && lightbox.classList.contains('open')) e.preventDefault();
});

document.querySelectorAll('img[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => openLightbox(img));
    // Let keyboard users open lightbox images too
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(img);
        }
    });
});

// Contact Form
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('invalid', function() {
        if (emailInput.validity.valueMissing) {
            emailInput.setCustomValidity('Please enter your email address.');
        } else if (emailInput.validity.typeMismatch) {
            emailInput.setCustomValidity('Please enter a valid email address.');
        }
    });

    emailInput.addEventListener('input', function() {
        emailInput.setCustomValidity('');
    });
}

const form = document.querySelector('.contact-form');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');
if (form) {
    const submitBtn = form.querySelector('.submit-btn');
    const submitLabel = submitBtn.textContent;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (formError) formError.classList.remove('show');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Form submission failed with status ' + response.status);
            }

            const header = document.querySelector('.contact-header');
            form.reset();
            form.classList.add('fade-out');
            if (header) header.classList.add('fade-out');
            setTimeout(() => {
                form.style.display = 'none';
                if (header) header.style.display = 'none';
                formSuccess.style.display = 'block';
                setTimeout(() => {
                    formSuccess.classList.add('show');
                }, 10);
            }, 500);
        } catch (err) {
            console.error(err);
            if (formError) formError.classList.add('show');
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
        }
    });
}

// Accordion
document.querySelectorAll('.accordion-btn').forEach((btn, i) => {
    btn.setAttribute('aria-expanded', 'false');
    // Point each button at the panel it controls
    const panel = btn.nextElementSibling;
    if (panel) {
        panel.id = panel.id || 'accordion-panel-' + (i + 1);
        btn.setAttribute('aria-controls', panel.id);
    }
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const iframe = content.querySelector('iframe');
        const opening = !content.classList.contains('open');
        // load the embed the first time the section opens
        if (opening && iframe && iframe.dataset.src && !iframe.getAttribute('src')) {
            iframe.src = iframe.dataset.src;
        }
        btn.classList.toggle('open', opening);
        content.classList.toggle('open', opening);
        btn.setAttribute('aria-expanded', String(opening));
    });
});

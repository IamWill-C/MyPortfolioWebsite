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

// Lightbox
function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        // data-full lets a small thumbnail open a larger version of the same image
        lightboxImg.src = img.dataset.full || img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('open');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// Let keyboard users open lightbox images too
document.querySelectorAll('img[onclick^="openLightbox"]').forEach(img => {
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
document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
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

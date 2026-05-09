// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const social = document.querySelector('.social');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        social.classList.toggle('open');
        hamburger.classList.toggle('open');
    });
}

// Lightbox
function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        document.getElementById('lightbox-img').src = img.src;
        lightbox.classList.add('open');
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('open');
    }
}

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
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            form.reset();
            form.classList.add('fade-out');
            document.querySelector('.contact-header').classList.add('fade-out');
            setTimeout(() => {
                form.style.display = 'none';
                formSuccess.style.display = 'block';
                setTimeout(() => {
                    formSuccess.classList.add('show');
                }, 10);
            }, 500);
        }
    });
}

// Accordion
const accordionBtns = document.querySelectorAll('.accordion-btn');
if (accordionBtns.length > 0) {
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const iframe = content.querySelector('iframe');
            if (!content.classList.contains('open') && iframe) {
                iframe.src = iframe.dataset.src;
            }
            btn.classList.toggle('open');
            content.classList.toggle('open');
        });
    });
}
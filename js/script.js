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
// The sub-nav can wrap onto two rows on small screens, so its real height is measured and shared with CSS.
// An open accordion's title bar sticks just below it (see .accordion-btn.open in project.css), and the
// project sidebar (see .project-sidebar in project.css) sticks below that, so its height is measured too.
const subNav = document.querySelector('.sub-nav');
function syncSubNavHeight() {
    document.documentElement.style.setProperty('--subnav-h', (subNav ? subNav.offsetHeight : 0) + 'px');
}
syncSubNavHeight();
window.addEventListener('resize', syncSubNavHeight);

function syncAccordionHeight() {
    const openBtn = document.querySelector('.accordion-btn.open');
    document.documentElement.style.setProperty('--accordion-h', (openBtn ? openBtn.offsetHeight : 0) + 'px');
}
window.addEventListener('resize', syncAccordionHeight);

function setAccordion(btn, opening) {
    const content = btn.nextElementSibling;
    const iframe = content.querySelector('iframe');
    // load the embed the first time the section opens
    if (opening && iframe && iframe.dataset.src && !iframe.getAttribute('src')) {
        iframe.src = iframe.dataset.src;
    }
    // stop any clip that is still playing when its section closes
    if (!opening) content.querySelectorAll('video').forEach(v => v.pause());
    btn.classList.toggle('open', opening);
    content.classList.toggle('open', opening);
    btn.setAttribute('aria-expanded', String(opening));
    syncAccordionHeight();
}

// Close a section and, if the reader has scrolled down into it, return to where it starts.
// Used by both the title bar and the Close button at the bottom of the panel.
function closeAccordion(btn) {
    const accordion = btn.parentElement;
    // Read where the title bar sticks before closing, since it only sticks while open
    const stuckTop = parseFloat(getComputedStyle(btn).top) || 0;
    setAccordion(btn, false);
    // Measure the accordion, not the title bar, because the sticky title bar moves with the scroll
    const target = Math.max(0, accordion.getBoundingClientRect().top + window.scrollY - stuckTop - 12);
    if (window.scrollY > target + 2) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
    }
}

document.querySelectorAll('.accordion-btn').forEach((btn, i) => {
    btn.setAttribute('aria-expanded', 'false');
    // Point each button at the panel it controls
    const panel = btn.nextElementSibling;
    if (panel) {
        panel.id = panel.id || 'accordion-panel-' + (i + 1);
        btn.setAttribute('aria-controls', panel.id);

        // A Close button at the bottom of the panel, so a long section can be closed without scrolling back up
        const title = btn.firstChild.textContent.trim();
        const row = document.createElement('div');
        row.className = 'accordion-close-row';
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'project-link-btn accordion-close';
        closeBtn.textContent = 'Close ×';
        closeBtn.setAttribute('aria-label', 'Close ' + title);
        closeBtn.addEventListener('click', () => {
            closeAccordion(btn);
            btn.focus({ preventScroll: true });
        });
        row.appendChild(closeBtn);
        panel.appendChild(row);
    }
    btn.addEventListener('click', () => {
        if (btn.nextElementSibling.classList.contains('open')) closeAccordion(btn);
        else setAccordion(btn, true);
    });
});

// Deep link: a URL ending in #some-project (e.g. from the homepage carousel) opens that
// project's accordion and scrolls to it, using the same sticky-header math as closeAccordion.
function openAccordionFromHash() {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (!hash) return;
    const accordion = document.getElementById(hash);
    if (!accordion || !accordion.classList.contains('accordion')) return;
    const btn = accordion.querySelector('.accordion-btn');
    if (!btn) return;
    setAccordion(btn, true);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Wait a frame so the newly-opened panel has taken its layout space before measuring
    requestAnimationFrame(() => {
        const stuckTop = parseFloat(getComputedStyle(btn).top) || 0;
        const target = Math.max(0, accordion.getBoundingClientRect().top + window.scrollY - stuckTop - 12);
        window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
    });
}
openAccordionFromHash();
window.addEventListener('hashchange', openAccordionFromHash);

// Home page hero carousel: cycles through a piece from every project, each linking straight to
// that project's accordion. window.HERO_CAROUSEL_ITEMS is set inline on index.html only, so this
// whole block is a no-op on every other page.
const heroCarouselImgA = document.getElementById('heroCarouselImgA');
const heroCarouselImgB = document.getElementById('heroCarouselImgB');
const heroItems = window.HERO_CAROUSEL_ITEMS;
if (heroCarouselImgA && heroCarouselImgB && heroItems && heroItems.length) {
    const heroCaption = document.getElementById('heroCarouselCaption');
    const heroTitle = document.getElementById('heroCarouselTitle');
    const heroCategory = document.getElementById('heroCarouselCategory');
    const heroCount = document.getElementById('heroCarouselCount');
    const heroBtn = document.getElementById('heroCarouselBtn');
    const heroPrev = document.getElementById('heroCarouselPrev');
    const heroNext = document.getElementById('heroCarouselNext');
    const heroPause = document.getElementById('heroCarouselPause');
    const heroFigure = heroCarouselImgA.closest('.hero-carousel');
    const heroReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const AUTOPLAY_MS = 7000;
    const CAPTION_FADE_MS = 250;
    let heroIndex = 0;
    let heroTimer = null;
    let heroPaused = heroReduceMotion;
    let heroFrontIsA = true;

    function setPauseButton(paused) {
        heroPause.setAttribute('aria-pressed', String(paused));
        heroPause.setAttribute('aria-label', paused ? 'Play carousel' : 'Pause carousel');
        heroPause.classList.toggle('is-paused', paused);
    }
    setPauseButton(heroPaused);

    function showHeroSlide(index) {
        const item = heroItems[index];
        const front = heroFrontIsA ? heroCarouselImgA : heroCarouselImgB;
        const back = heroFrontIsA ? heroCarouselImgB : heroCarouselImgA;

        // Load the next image into the hidden back layer first, then crossfade the two: the old
        // piece dissolves as the new one appears beneath it, instead of fading out to blank first.
        const preload = new Image();
        preload.onload = () => {
            back.src = item.img;
            back.alt = item.alt;
            back.classList.add('is-active');
            front.classList.remove('is-active');
            heroFrontIsA = !heroFrontIsA;
        };
        preload.src = item.img;

        heroCaption.classList.add('is-fading');
        setTimeout(() => {
            heroTitle.textContent = item.title;
            heroCategory.textContent = item.category;
            heroCount.textContent = (index + 1) + ' / ' + heroItems.length;
            heroBtn.href = item.href;
            heroCaption.classList.remove('is-fading');
        }, CAPTION_FADE_MS);
    }

    function goToHeroSlide(index) {
        heroIndex = (index + heroItems.length) % heroItems.length;
        showHeroSlide(heroIndex);
    }

    function stopHeroAutoplay() {
        if (heroTimer) clearInterval(heroTimer);
        heroTimer = null;
    }

    function startHeroAutoplay() {
        if (heroPaused) return;
        stopHeroAutoplay();
        heroTimer = setInterval(() => goToHeroSlide(heroIndex + 1), AUTOPLAY_MS);
    }

    heroPrev.addEventListener('click', () => { goToHeroSlide(heroIndex - 1); startHeroAutoplay(); });
    heroNext.addEventListener('click', () => { goToHeroSlide(heroIndex + 1); startHeroAutoplay(); });

    heroPause.addEventListener('click', () => {
        heroPaused = !heroPaused;
        setPauseButton(heroPaused);
        if (heroPaused) stopHeroAutoplay(); else startHeroAutoplay();
    });

    // Pause while a reader is looking at or interacting with the carousel, resume when they leave
    heroFigure.addEventListener('mouseenter', stopHeroAutoplay);
    heroFigure.addEventListener('mouseleave', startHeroAutoplay);
    heroFigure.addEventListener('focusin', stopHeroAutoplay);
    heroFigure.addEventListener('focusout', startHeroAutoplay);

    // The first slide's title/category are already in the markup (no JS needed pre-load), so this
    // just wires up the count and button href to match.
    heroCount.textContent = '1 / ' + heroItems.length;
    heroBtn.href = heroItems[0].href;
    startHeroAutoplay();
}

// Scroll reveal: [data-reveal] elements fade in as they enter the viewport.
// The inline script in <head> only adds .reveal-ready when this effect is wanted (no reduced motion).
if (document.documentElement.classList.contains('reveal-ready')) {
    const pending = new Set(document.querySelectorAll('[data-reveal]'));

    function reveal(el, delay = 0) {
        pending.delete(el);
        revealObserver.unobserve(el);
        // Stagger items that arrive together (a row of tiles), then clear the delay so hover effects stay instant
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('revealed');
        setTimeout(() => { el.style.transitionDelay = ''; }, 700 + delay);
    }

    const revealObserver = new IntersectionObserver((entries) => {
        let batch = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) reveal(entry.target, batch++ * 90);
        });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    pending.forEach(el => revealObserver.observe(el));

    // The observer only fires when an element crosses into view, so anything scrolled past without ever
    // being seen (End key, anchor link, reload mid-page) would stay hidden. Show those straight away.
    function revealScrolledPast() {
        pending.forEach(el => {
            if (el.getBoundingClientRect().bottom < 0) reveal(el);
        });
    }

    let sweepQueued = false;
    window.addEventListener('scroll', () => {
        if (sweepQueued) return;
        sweepQueued = true;
        requestAnimationFrame(() => { sweepQueued = false; revealScrolledPast(); });
    }, { passive: true });
    revealScrolledPast();
}

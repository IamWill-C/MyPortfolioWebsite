const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const social = document.querySelector('.social');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    social.classList.toggle('open');
    hamburger.classList.toggle('open');
});
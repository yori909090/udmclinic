document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('close-info');
    const contactInfoSection = document.querySelector('.contact-info-section');

    if (closeBtn && contactInfoSection) {
        closeBtn.addEventListener('click', () => {
            const isHidden = window.getComputedStyle(contactInfoSection).display === 'none';
            contactInfoSection.style.display = isHidden ? 'flex' : 'none';
        });
    }

    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for reaching out! Our team will get back to you soon.');
            form.reset();
        });
    }
});

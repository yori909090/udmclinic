// title
const adviceTitle = document.querySelector('.advice-title');

// lahat ng cards
const adviceCards = document.querySelectorAll('.advice-card');

function fadeInAdvice() {
    const screenHeight = window.innerHeight;

    // fade-in yung title pag visible na
    if (adviceTitle.getBoundingClientRect().top < screenHeight - 100) {
        adviceTitle.classList.add('show');
    }

    // fade-in cards with delay
    adviceCards.forEach((card, index) => {
        if (card.getBoundingClientRect().top < screenHeight - 50) {
            setTimeout(() => {
                card.classList.add('show');
            }, index * 150); // bawat card delay 150ms
        }
    });
}

// trigger on scroll at load
window.addEventListener('scroll', fadeInAdvice);
window.addEventListener('load', fadeInAdvice);
